"use client";

import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const ROWS = 4;
const COLUMNS = 16;
const RESIZE_DEBOUNCE = 200;

const TransitionProvider = ({ children }) => {
  const transitionGridRef = useRef(null);
  const blockRefs = useRef([]);
  const activeTimelineRef = useRef(null);
  const pendingResizeRef = useRef(false);

  const createTransitionGrid = () => {
    if (!transitionGridRef.current) return;

    if (activeTimelineRef.current?.isActive()) {
      pendingResizeRef.current = true;
      return;
    }

    const container = transitionGridRef.current;
    container.innerHTML = "";
    blockRefs.current = [];

    const blockWidth = window.innerWidth / COLUMNS;
    const blockHeight = window.innerHeight / ROWS;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const block = document.createElement("div");
        block.className = "transition-block";
        block.style.cssText = `
            width: ${blockWidth + 1}px;
            height: ${blockHeight + 1}px;
            left: ${col * blockWidth}px;
            top: ${row * blockHeight}px;
            transform-origin: ${row % 2 === 0 ? "left" : "right"} center;
        `;
        container.appendChild(block);
        blockRefs.current.push(block);
      }
    }

    gsap.set(blockRefs.current, { scaleX: 0 });
  };

  useEffect(() => {
    createTransitionGrid();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(createTransitionGrid, RESIZE_DEBOUNCE);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRowBlocks = (row) =>
    blockRefs.current.slice(row * COLUMNS, row * COLUMNS + COLUMNS);

  const runRowTimeline = (onComplete, { scaleX, duration, ease }) => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        if (pendingResizeRef.current) {
          pendingResizeRef.current = false;
          createTransitionGrid();
        }
      },
    });
    activeTimelineRef.current = tl;

    Array.from({ length: ROWS }).forEach((_, row) => {
      const blocks = getRowBlocks(row);
      tl.to(
        blocks,
        {
          scaleX,
          duration,
          ease,
          stagger: {
            each: 0.018,
            from: row % 2 === 0 ? "start" : "end",
          },
        },
        "<",
      );
    });

    return tl;
  };

  const animateIn = (onComplete) =>
    runRowTimeline(onComplete, {
      scaleX: 1,
      duration: 0.7,
      ease: "expo.inOut",
    });

  const animateOut = (onComplete) =>
    runRowTimeline(onComplete, {
      scaleX: 0,
      duration: 0.6,
      ease: "power3.inOut",
    });

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tl = animateIn(next);
        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = animateOut(next);
        return () => tl.kill();
      }}
    >
      <div ref={transitionGridRef} className="transition-grid" />
      {children}
    </TransitionRouter>
  );
};

export default TransitionProvider;
