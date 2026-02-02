import React, { useEffect, useState } from 'react';

export function LogoAnimation({ onComplete }) {
    const [fadeOut, setFadeOut] = useState(false);
    const [showFull, setShowFull] = useState(false);

    useEffect(() => {
        // Show full image without mask after drawing completes to ensure perfect clarity
        const fullTimer = setTimeout(() => {
            setShowFull(true);
        }, 2500);

        // Fade out splash screen
        const exitTimer = setTimeout(() => {
            setFadeOut(true);
        }, 3500);

        // Complete callback
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 4500);

        return () => {
            clearTimeout(fullTimer);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative flex flex-col items-center">

                <div className="relative w-64 h-64">
                    {/* SVG wrapper for masking */}
                    <svg viewBox="0 0 512 512" className="w-full h-full absolute inset-0">
                        <defs>
                            <mask id="logo-mask" maskUnits="userSpaceOnUse">
                                {/* Background is black (hides everything) */}
                                <rect width="100%" height="100%" fill="black" />

                                {/* Paths are white (reveals the image). Animate stroke-dashoffset to draw.
                     These paths approximate the N shape and document shape of the logo. 
                     Thick strokes to uncover the underlying image. */}

                                {/* The "N" shape left part */}
                                <path
                                    d="M120 120 L120 380 Q120 420 180 380 L300 280"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="80"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="svg-draw-1"
                                />

                                {/* The "N" shape right/diagonal part */}
                                <path
                                    d="M280 280 L380 120 L380 380"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="80"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="svg-draw-2"
                                />

                                {/* The document fold/top right */}
                                <path
                                    d="M380 120 L440 180 L380 180"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="80"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="svg-draw-3"
                                />

                            </mask>
                        </defs>

                        {/* The Logo Image using the mask */}
                        <image
                            href="/logo.png"
                            x="0"
                            y="0"
                            width="512"
                            height="512"
                            mask="url(#logo-mask)"
                            style={{ opacity: showFull ? 0 : 1 }}
                        />
                    </svg>

                    {/* The unmasked image fades in at the end to correct any masking imperfections */}
                    <img
                        src="/logo.png"
                        alt="Navigate AI"
                        className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-500 ${showFull ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>

                {/* Text appearing below */}
                <div className="mt-8 text-center animate-fade-up">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 tracking-wider">
                        NAVIGATE AI
                    </h1>
                </div>
            </div>
        </div>
    );
}
