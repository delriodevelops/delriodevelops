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

            // Delegated so links rendered after mount (client-only pages, async data) also react
            const interactiveSelector = 'a, button, .project-item, .magnetic-btn';
            const handleOver = (e) => {
                cursor.classList.toggle('hovered', !!e.target.closest?.(interactiveSelector));
            };

            window.addEventListener('mousemove', moveCursor);
            document.addEventListener('mouseover', handleOver);

            return () => {
                window.removeEventListener('mousemove', moveCursor);
                document.removeEventListener('mouseover', handleOver);
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
