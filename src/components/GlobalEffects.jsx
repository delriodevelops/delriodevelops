'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GlobalEffects() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        // Check if device works with hover (desktop)
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const cursor = cursorRef.current;
            const follower = followerRef.current;

            const moveCursor = (e) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: 'power2.out'
                });
                gsap.to(follower, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            };

            const handleHover = () => {
                cursor.classList.add('hovered');
            };

            const handleUnhover = () => {
                cursor.classList.remove('hovered');
            };

            window.addEventListener('mousemove', moveCursor);

            // Add hover effect to all links and buttons
            const interactiveElements = document.querySelectorAll('a, button, .project-item, .magnetic-btn');
            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', handleHover);
                el.addEventListener('mouseleave', handleUnhover);
            });

            return () => {
                window.removeEventListener('mousemove', moveCursor);
                interactiveElements.forEach((el) => {
                    el.removeEventListener('mouseenter', handleHover);
                    el.removeEventListener('mouseleave', handleUnhover);
                });
            };
        }
    }, []);

    return (
        <>
            <div className="noise-overlay" />
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={followerRef} className="custom-cursor-follower" />
        </>
    );
}
