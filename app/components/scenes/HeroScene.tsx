"use client";

import { ScrollScene } from "../ScrollScene";

interface HeroSceneProps {
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
}

export function HeroScene({ onProgressUpdate }: HeroSceneProps) {
    return (
        <ScrollScene
            folderName="session 1"
            totalFrames={120}
            scrollMultiplier={6}
            sceneName="Hero — Crowd to Eye"
            onProgressUpdate={onProgressUpdate}
        >
            {(progress) => (
                <div className="flex flex-col items-center justify-center h-full relative">
                    {/* Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                    {/* Logo and tagline — visible at the start, fades as we zoom in */}
                    <div
                        className="relative z-10 flex flex-col items-center gap-6 text-center px-8 transition-opacity duration-300"
                        style={{
                            opacity: progress < 0.4 ? Math.max(0, 1 - progress * 2.5) : 0,
                            transform: `translateY(${progress * 50}px)`
                        }}
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white text-glow">
                            wowflow
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 max-w-lg font-light tracking-wide">
                            Automações inteligentes. Dashboards criativos.
                            <br />
                            <span className="text-white/80 font-medium">Revolucionando o mundo.</span>
                        </p>
                        <div className="flex items-center gap-2 text-white/30 text-sm mt-8 animate-pulse">
                            <span>Scroll para explorar</span>
                            <span>↓</span>
                        </div>
                    </div>

                    {/* Mid-scroll text — appears as we zoom into eye */}
                    {progress > 0.3 && progress < 0.8 && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10"
                            style={{
                                opacity: Math.min(1, (progress - 0.3) * 4) * Math.min(1, (0.8 - progress) * 4),
                                transform: `scale(${0.9 + progress * 0.2})`
                            }}
                        >
                            <div className="text-center">
                                <p className="text-2xl md:text-4xl font-light text-white/70 tracking-wide text-glow">
                                    Olhe além do comum
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Subtle dark vignette intensifies at end */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
                            opacity: Math.min(1, progress * 1.5),
                        }}
                    />
                </div>
            )}
        </ScrollScene>
    );
}
