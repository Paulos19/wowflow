"use client";

import { useEffect, useState, useRef } from "react";

interface PreloaderResult {
    images: HTMLImageElement[];
    loadedCount: number;
    totalCount: number;
    isLoaded: boolean;
}

export function useFramePreloader(framePaths: string[]): PreloaderResult {
    const [loadedCount, setLoadedCount] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        if (framePaths.length === 0) return;

        const images: HTMLImageElement[] = new Array(framePaths.length);
        let loaded = 0;

        const loadImage = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                img.onerror = () => {
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                img.src = framePaths[index];
                images[index] = img;
            });
        };

        // Load in batches for performance
        const batchSize = 10;
        let currentBatch = 0;

        const loadBatch = async () => {
            const start = currentBatch * batchSize;
            const end = Math.min(start + batchSize, framePaths.length);
            const promises: Promise<void>[] = [];

            for (let i = start; i < end; i++) {
                promises.push(loadImage(i));
            }

            await Promise.all(promises);
            currentBatch++;

            if (currentBatch * batchSize < framePaths.length) {
                // Small delay between batches to not block main thread
                requestAnimationFrame(() => {
                    loadBatch();
                });
            }
        };

        loadBatch();
        imagesRef.current = images;

        return () => {
            // Cleanup
            images.forEach((img) => {
                if (img) img.src = "";
            });
        };
    }, [framePaths]);

    return {
        images: imagesRef.current,
        loadedCount,
        totalCount: framePaths.length,
        isLoaded: loadedCount >= framePaths.length,
    };
}
