"use client";

import { useEffect, useState, useRef, useCallback, type RefObject } from "react";

interface ScrollProgressResult {
    progress: number;
    currentFrame: number;
    isActive: boolean;
    isSticky: boolean;
}

export function useScrollProgress(
    containerRef: RefObject<HTMLElement | null>,
    totalFrames: number,
    options?: { ease?: boolean }
): ScrollProgressResult {
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const rafRef = useRef<number>(0);
    const smoothProgress = useRef(0);
    const targetProgress = useRef(0);

    const lerp = useCallback((start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how far through the scroll range we are
            // The scroll range starts when the top of the container hits the top of the viewport
            // and ends when the bottom of the container minus one viewport height reaches the top
            const scrollableHeight = container.offsetHeight - windowHeight;
            const scrolled = -rect.top;
            const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

            targetProgress.current = rawProgress;

            // Check if this scene is currently visible
            const visible = rect.top < windowHeight && rect.bottom > 0;
            setIsActive(visible);
        };

        const animate = () => {
            if (options?.ease !== false) {
                smoothProgress.current = lerp(smoothProgress.current, targetProgress.current, 0.15);
                // Snap when very close
                if (Math.abs(smoothProgress.current - targetProgress.current) < 0.001) {
                    smoothProgress.current = targetProgress.current;
                }
            } else {
                smoothProgress.current = targetProgress.current;
            }

            setProgress(smoothProgress.current);
            rafRef.current = requestAnimationFrame(animate);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [containerRef, lerp, options?.ease]);

    const currentFrame = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(progress * (totalFrames - 1)))
    );

    return { progress, currentFrame, isActive, isSticky };
}
