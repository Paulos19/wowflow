"use client";

import { ScrollScene } from "../ScrollScene";

interface WhiteTransitionProps {
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
}

export function WhiteTransition({ onProgressUpdate }: WhiteTransitionProps) {
    return (
        <ScrollScene
            folderName="session 4"
            totalFrames={120}
            scrollMultiplier={4}
            sceneName="White Transition"
            onProgressUpdate={onProgressUpdate}
            overlapPrevious={true}
        >
            {(progress) => (
                <div className="relative h-full">
                    {/* White overlay that increases with progress */}
                    <div
                        className="absolute inset-0 bg-white pointer-events-none"
                        style={{
                            opacity: progress > 0.3 ? Math.min(1, (progress - 0.3) * 1.5) : 0,
                        }}
                    />

                    {/* Bottom white bleed for seamless transition to white content */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                        style={{
                            background: "linear-gradient(to top, white, transparent)",
                            opacity: progress > 0.5 ? Math.min(1, (progress - 0.5) * 2) : 0,
                        }}
                    />
                </div>
            )}
        </ScrollScene>
    );
}
