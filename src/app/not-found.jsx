'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import gsap from 'gsap';

export default function NotFound() {
    const containerRef = useRef(null);
    const numberRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.2 });

        // Animate 404 number
        tl.fromTo('.not-found-number',
            { opacity: 0, y: 100, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
        )
            .fromTo('.not-found-text',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.5'
            )
            .fromTo('.not-found-actions',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                '-=0.3'
            );

        // Floating animation for 404
        gsap.to('.not-found-number', {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });

        // Glitch effect on hover
        const number = numberRef.current;
        if (number) {
            const handleHover = () => {
                gsap.to(number, {
                    x: () => gsap.utils.random(-5, 5),
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    ease: 'power1.inOut',
                    onComplete: () => gsap.set(number, { x: 0 })
                });
            };
            number.addEventListener('mouseenter', handleHover);
            return () => number.removeEventListener('mouseenter', handleHover);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-6"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full filter blur-[200px] opacity-20" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[150px] opacity-15" />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl">
                {/* 404 Number */}
                <h1
                    ref={numberRef}
                    className="not-found-number text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter cursor-pointer select-none"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, #fff 50%, var(--color-accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 100px rgba(200, 255, 0, 0.3)'
                    }}
                >
                    404
                </h1>

                {/* Text */}
                <div className="not-found-text space-y-4 mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold">
                        Page Not Found
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto font-mono">
                        The page you're looking for doesn't exist or has been moved to another dimension.
                    </p>
                </div>

                {/* Actions */}
                <div className="not-found-actions flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="magnetic-btn bg-[var(--color-accent)] !text-black border-none hover:bg-white inline-flex items-center gap-2"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="magnetic-btn border-white/20 inline-flex items-center gap-2 hover:border-white/40"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                {/* Fun Message */}
                <p className="mt-16 text-xs text-gray-600 font-mono uppercase tracking-widest">
                    Error Code: LOST_IN_THE_VOID
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-8 left-8 text-xs font-mono text-gray-700 hidden md:block">
                <div>STATUS: 404</div>
                <div>PATH: {typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</div>
            </div>

            <div className="absolute bottom-8 right-8 text-xs font-mono text-gray-700 hidden md:block text-right">
                <div>delrío.dev</div>
                <div>© {new Date().getFullYear()}</div>
            </div>

            {/* Animated Noise Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Custom Styles */}
            <style jsx global>{`
                .magnetic-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 2rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border: 1px solid;
                    border-radius: 0;
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: var(--font-mono);
                }

                .magnetic-btn:hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}
