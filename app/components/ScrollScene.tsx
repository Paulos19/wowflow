"use client";

import { useRef, useMemo, useEffect, type ReactNode } from "react";
import { useScrollProgress } from "@/app/hooks/useScrollProgress";
import { useFramePreloader } from "@/app/hooks/useFramePreloader";
import { FrameCanvas } from "./FrameCanvas";

interface ScrollSceneProps {
    /** Folder path relative to public, e.g. "session 1" */
    folderName: string;
    /** Total number of frames */
    totalFrames: number;
    /** How many viewport-heights the scroll range should span */
    scrollMultiplier?: number;
    /** Scene name for debug */
    sceneName: string;
    /** Overlay content rendered on top of the canvas */
    children?: (progress: number, currentFrame: number) => ReactNode;
    /** Called with progress/frame data for parent debug */
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
    /** Whether this scene should visually overlap the previous scene to remove gap */
    overlapPrevious?: boolean;
}

export function ScrollScene({
    folderName,
    totalFrames,
    scrollMultiplier = 5,
    sceneName,
    children,
    onProgressUpdate,
    overlapPrevious = false,
}: ScrollSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate frame paths
    const framePaths = useMemo(() => {
        return Array.from({ length: totalFrames }, (_, i) => {
            const num = String(i + 1).padStart(3, "0");
            return `/${folderName}/ezgif-frame-${num}.jpg`;
        });
    }, [folderName, totalFrames]);

    // Preload frames
    const { images, loadedCount, isLoaded } = useFramePreloader(framePaths);

    // Track scroll progress
    const { progress, currentFrame, isActive, isSticky } = useScrollProgress(
        containerRef,
        totalFrames
    );

    // Report progress to parent
    useEffect(() => {
        if (isActive && onProgressUpdate) {
            onProgressUpdate(progress, currentFrame, sceneName);
        }
    }, [progress, currentFrame, isActive, sceneName, onProgressUpdate]);

    return (
        <div
            ref={containerRef}
            className="scene-container"
            style={{
                height: `${scrollMultiplier * 100}vh`,
                marginTop: overlapPrevious ? "-100vh" : "0",
            }}
        >
            <div
                className="scene-sticky"
                style={{
                    opacity: overlapPrevious && !isSticky ? 0 : 1
                }}
            >
                {/* Subtle top loading indicator */}
                {!isLoaded && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
                        <div
                            className="h-full bg-indigo-500/50 transition-all duration-300"
                            style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
                        />
                    </div>
                )}

                {/* Canvas */}
                <FrameCanvas
                    images={images}
                    currentFrame={currentFrame}
                />

                {/* Overlay content */}
                {children && (
                    <div className="absolute inset-0 z-10">
                        {children(progress, currentFrame)}
                    </div>
                )}
            </div>
        </div>
    );
}
