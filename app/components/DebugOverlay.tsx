"use client";

import { useState, useEffect } from "react";

interface DebugOverlayProps {
    progress: number;
    currentFrame: number;
    activeScene: string;
}

export function DebugOverlay({ progress, currentFrame, activeScene }: DebugOverlayProps) {
    const [visible, setVisible] = useState(false);
    const [fps, setFps] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "d" || e.key === "D") {
                setVisible((v) => !v);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // FPS counter
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId: number;

        const tick = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = now;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafId);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white/80 space-y-1 shadow-2xl">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Debug</div>
            <div className="flex items-center gap-2">
                <span className="text-white/40">Scene:</span>
                <span className="text-indigo-400 font-semibold">{activeScene}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-white/40">Progress:</span>
                <span className="text-emerald-400">{(progress * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-white/40">Frame:</span>
                <span className="text-amber-400">{currentFrame}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-white/40">FPS:</span>
                <span className={fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-red-400"}>
                    {fps}
                </span>
            </div>
            <div className="mt-2 text-white/20 text-[9px]">Press D to hide</div>
        </div>
    );
}
