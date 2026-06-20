'use client'
import React, { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'

const PageTransition = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()
    
    const overlayRef = useRef(null)
    const logoOverlayRef = useRef(null)
    const logoRef = useRef(null)
    const isTransitioning = useRef(false)
    
    // Create an array of 20 elements for React to map natively
    const blocksArray = Array.from({ length: 20 })

    useEffect(() => {
        // Fetch blocks using query selector since they are managed by React now
        const blocks = overlayRef.current?.querySelectorAll('.block') || []

        // Initial Setup
        gsap.set(blocks, { scaleX: 0, transformOrigin: 'left' })
        
        const path = logoRef.current?.querySelector('path')
        if (path) {
            const length = path.getTotalLength()
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fill: 'transparent' })
        }

        // Trigger entry animation
        revealPage(blocks)

        const handleLinkClick = (e) => {
            e.preventDefault()
            const href = e.currentTarget.getAttribute('href')
            
            // Check if it's an internal route change
            if (href && href !== pathname) {
                if (isTransitioning.current) return // Guard: Block if already animating
                isTransitioning.current = true
                coverPage(href, blocks)
            }
        }

        // Attach event listeners
        const links = document.querySelectorAll('a[href^="/"]')
        links.forEach(link => link.addEventListener('click', handleLinkClick))

        // Cleanup: Correctly removes the bound reference
        return () => {
            links.forEach(link => link.removeEventListener('click', handleLinkClick))
        }

    }, [pathname]) // Trigger rewrite safely on pathname change

    const coverPage = (url, blocks) => {
        const path = logoRef.current?.querySelector('path')
        const pathLength = path ? path.getTotalLength() : 0

        const tl = gsap.timeline({
            onComplete: () => {
                router.push(url)
            }
        })

        tl.to(blocks, {
            scaleX: 1,
            duration: 0.4,
            stagger: 0.02,
            ease: 'power2.out',
            transformOrigin: 'left'
        })
        .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
        .set(path, {
            strokeDashoffset: pathLength,
            fill: 'transparent'
        }, "-=0.25")
        .to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut'
        }, "-=0.5")
        .to(path, {
            fill: '#e3e4d8',
            duration: 1,
            ease: 'power2.out'
        }, "-=0.5")
        .to(logoOverlayRef.current, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out'
        })
    }

    const revealPage = (blocks) => {
        gsap.set(blocks, { scaleX: 1, transformOrigin: 'left' })

        gsap.to(blocks, {
            scaleX: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: 'power2.out',
            transformOrigin: 'right',
            onComplete: () => {
                isTransitioning.current = false
            }
        })
    }

    return (
        <>
            <div ref={overlayRef} className='transition-overlay'>
                {blocksArray.map((_, index) => (
                    <div key={index} className="block" />
                ))}
            </div>
            <div ref={logoOverlayRef} className='logo-overlay' style={{ opacity: 0 }}>
                <div className='logo-container'>
                    {/* Ensure your <Logo /> component uses React.forwardRef */}
                    <Logo ref={logoRef} />
                </div>
            </div>
            {children}
        </>
    )
}

export default PageTransition