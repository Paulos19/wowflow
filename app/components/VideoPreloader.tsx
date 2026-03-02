"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface VideoPreloaderProps {
    videoSrc: string;
    /** 0–1 progress of how many frames are loaded */
    loadProgress: number;
    /** Called when dismissing the preloader */
    onComplete: () => void;
}

export function VideoPreloader({
    videoSrc,
    loadProgress,
    onComplete,
}: VideoPreloaderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [canDismiss, setCanDismiss] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);

    // Auto-dismiss when fully loaded AND video has played at least once
    useEffect(() => {
        if (loadProgress >= 0.95) {
            setCanDismiss(true);
        }
    }, [loadProgress]);

    useEffect(() => {
        if (canDismiss && videoEnded) {
            // Small delay so user sees 100%
            const t = setTimeout(() => {
                setFadeOut(true);
                setTimeout(onComplete, 800);
            }, 400);
            return () => clearTimeout(t);
        }
    }, [canDismiss, videoEnded, onComplete]);

    // If video ends but frames aren't loaded yet, loop
    const handleVideoEnd = useCallback(() => {
        setVideoEnded(true);
        if (!canDismiss && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    }, [canDismiss]);

    // Click to skip if frames loaded
    const handleSkip = useCallback(() => {
        if (canDismiss) {
            setFadeOut(true);
            setTimeout(onComplete, 800);
        }
    }, [canDismiss, onComplete]);

    const pct = Math.round(loadProgress * 100);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: fadeOut ? 0 : 1,
                transition: "opacity 0.8s ease",
                cursor: canDismiss ? "pointer" : "default",
            }}
            onClick={handleSkip}
        >
            {/* Video background */}
            <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                }}
            />

            {/* Overlay dark gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)",
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "32px",
                }}
            >
                {/* Progress bar */}
                <div
                    style={{
                        width: "min(300px, 60vw)",
                        height: 3,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${pct}%`,
                            height: "100%",
                            background:
                                "linear-gradient(90deg, #6366f1, #a78bfa)",
                            borderRadius: 4,
                            transition: "width 0.3s ease",
                        }}
                    />
                </div>

                {/* Status text */}
                <p
                    style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.85rem",
                        fontWeight: 300,
                        letterSpacing: "0.15em",
                        margin: 0,
                    }}
                >
                    {pct < 100
                        ? `CARREGANDO EXPERIÊNCIA · ${pct}%`
                        : "TOQUE PARA INICIAR"}
                </p>
            </div>
        </div>
    );
}
