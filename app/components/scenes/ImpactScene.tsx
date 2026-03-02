"use client";

import { ScrollScene } from "../ScrollScene";

interface ImpactSceneProps {
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
}

export function ImpactScene({ onProgressUpdate }: ImpactSceneProps) {
    return (
        <ScrollScene
            folderName="session 3"
            totalFrames={120}
            scrollMultiplier={5}
            sceneName="Impact — Car Rush"
            onProgressUpdate={onProgressUpdate}
            overlapPrevious={true}
        >
            {(progress) => (
                <div className="relative h-full">
                    {/* Light bloom that intensifies as the car approaches */}
                    <div
                        className="absolute inset-0 light-bloom pointer-events-none z-10"
                        style={{
                            opacity: progress > 0.5 ? (progress - 0.5) * 2 : 0,
                        }}
                    />

                    {/* Extra white overlay for final flash */}
                    <div
                        className="absolute inset-0 bg-white pointer-events-none z-10"
                        style={{
                            opacity: progress > 0.85 ? (progress - 0.85) * 6.67 : 0,
                        }}
                    />

                    {/* Dramatic text mid-scene */}
                    {progress > 0.1 && progress < 0.45 && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10"
                            style={{
                                opacity: Math.min(1, (progress - 0.1) * 5) * Math.min(1, (0.45 - progress) * 5),
                            }}
                        >
                            <div className="text-center px-8">
                                <p className="text-3xl md:text-5xl font-black text-white tracking-tight text-glow">
                                    Velocidade sem limites
                                </p>
                                <p className="text-white/40 text-sm md:text-base mt-3 font-light">
                                    Resultados em tempo real. Sem esperas.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Radial light glow from center (headlights) */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${progress * 0.3}) 0%, transparent 60%)`,
                        }}
                    />
                </div>
            )}
        </ScrollScene>
    );
}
