"use client";

import { useRef, useEffect, useCallback, memo } from "react";

interface FrameCanvasProps {
    images: HTMLImageElement[];
    currentFrame: number;
    className?: string;
}

function FrameCanvasInner({ images, currentFrame, className = "" }: FrameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastDrawnFrame = useRef(-1);

    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const img = images[frameIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Only redraw if frame changed
        if (lastDrawnFrame.current === frameIndex) return;
        lastDrawnFrame.current = frameIndex;

        // Set canvas size to match viewport
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
            ctx.scale(dpr, dpr);
        }

        // Draw image covering entire canvas (cover behavior)
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = displayWidth / displayHeight;

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

        if (imgRatio > canvasRatio) {
            drawHeight = displayHeight;
            drawWidth = displayHeight * imgRatio;
            offsetX = (displayWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = displayWidth;
            drawHeight = displayWidth / imgRatio;
            offsetX = 0;
            offsetY = (displayHeight - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, displayWidth, displayHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }, [images]);

    useEffect(() => {
        drawFrame(currentFrame);
    }, [currentFrame, drawFrame]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            lastDrawnFrame.current = -1; // Force redraw
            drawFrame(currentFrame);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [currentFrame, drawFrame]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{ display: "block" }}
        />
    );
}

export const FrameCanvas = memo(FrameCanvasInner);
