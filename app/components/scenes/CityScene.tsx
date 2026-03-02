"use client";

import { ScrollScene } from "../ScrollScene";

interface CitySceneProps {
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
}

export function CityScene({ onProgressUpdate }: CitySceneProps) {
    return (
        <ScrollScene
            folderName="session 2"
            totalFrames={120}
            scrollMultiplier={6}
            sceneName="Cyberpunk City"
            onProgressUpdate={onProgressUpdate}
            overlapPrevious={true}
        >
            {(progress) => (
                <div className="flex flex-col items-center justify-end h-full pb-24 relative">
                    {/* Top gradient for continuity */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                    {/* Cyberpunk glow overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at 50% 60%, rgba(99, 102, 241, ${0.05 + progress * 0.1}) 0%, transparent 70%)`,
                        }}
                    />

                    {/* Text callouts that appear mid-scroll */}
                    {progress > 0.15 && progress < 0.5 && (
                        <div
                            className="absolute top-1/4 left-8 md:left-16 z-10 max-w-xs"
                            style={{
                                opacity: Math.min(1, (progress - 0.15) * 5) * Math.min(1, (0.5 - progress) * 4),
                                transform: `translateY(${(1 - Math.min(1, (progress - 0.15) * 5)) * 20}px)`,
                            }}
                        >
                            <div className="border-l-2 border-indigo-500/50 pl-4">
                                <p className="text-sm text-indigo-300/80 uppercase tracking-[0.2em] font-medium">
                                    Visão futurista
                                </p>
                                <p className="text-white/50 text-sm mt-1 font-light">
                                    Dashboards que transformam dados em experiências visuais únicas
                                </p>
                            </div>
                        </div>
                    )}

                    {progress > 0.4 && progress < 0.75 && (
                        <div
                            className="absolute top-1/3 right-8 md:right-16 z-10 max-w-xs text-right"
                            style={{
                                opacity: Math.min(1, (progress - 0.4) * 5) * Math.min(1, (0.75 - progress) * 4),
                                transform: `translateY(${(1 - Math.min(1, (progress - 0.4) * 5)) * 20}px)`,
                            }}
                        >
                            <div className="border-r-2 border-violet-500/50 pr-4">
                                <p className="text-sm text-violet-300/80 uppercase tracking-[0.2em] font-medium">
                                    Automação inteligente
                                </p>
                                <p className="text-white/50 text-sm mt-1 font-light">
                                    Fluxos automatizados que conectam todos os seus sistemas
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Bottom gradient for continuity */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
            )}
        </ScrollScene>
    );
}
