'use client';

import { Suspense, lazy, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
    scene: string;
    className?: string;
    onLoad?: (app: any) => void;
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
    const [loaded, setLoaded] = useState(false);

    const handleLoad = (app: any) => {
        setLoaded(true);
        onLoad?.(app);
    };

    return (
        <div className="relative w-full h-full">
            {/* Loading spinner */}
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span
                        style={{
                            width: 40,
                            height: 40,
                            border: '3px solid rgba(255, 255, 255, 0.1)',
                            borderTopColor: 'rgba(99, 102, 241, 0.8)',
                            borderRadius: '50%',
                            animation: 'spline-spin 0.8s linear infinite',
                        }}
                    />
                </div>
            )}

            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <span
                            style={{
                                width: 40,
                                height: 40,
                                border: '3px solid rgba(255, 255, 255, 0.1)',
                                borderTopColor: 'rgba(99, 102, 241, 0.8)',
                                borderRadius: '50%',
                                animation: 'spline-spin 0.8s linear infinite',
                            }}
                        />
                    </div>
                }
            >
                <Spline
                    scene={scene}
                    className={className}
                    onLoad={handleLoad}
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.6s ease',
                    }}
                />
            </Suspense>

            <style jsx global>{`
                @keyframes spline-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
