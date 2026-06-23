"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const Hero = ({ image, alt, className, children }) => {
  const imageRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.set(headingRef.current, { y: 130 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(imageRef.current, { scale: 2 }, { scale: 1, duration: 1 }).to(
      headingRef.current,
      {
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      0.5,
    );

    return () => tl.kill();
  }, []);

  return (
    <section className={`hero ${className}`}>
      <img ref={imageRef} src={image} alt={alt} className="hero-image" />
      <div className="hero-heading-mask">
        <h1 ref={headingRef}>{children}</h1>
      </div>
    </section>
  );
};

export default Hero;
