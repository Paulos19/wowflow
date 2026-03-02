"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";

/* ── Scene definitions ─────────────────────────────────────────── */
const SCENES = [
    { folder: "session 1", frames: 120, scrollMultiplier: 6, name: "Hero — Crowd to Eye" },
    { folder: "session 2", frames: 120, scrollMultiplier: 6, name: "Cyberpunk City" },
    { folder: "session 3", frames: 120, scrollMultiplier: 5, name: "Impact — Car Rush" },
    { folder: "session 4", frames: 79, scrollMultiplier: 3, name: "White Transition" },
];

const SCENE_OFFSETS = SCENES.reduce<number[]>((acc, s, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].frames);
    return acc;
}, []);

const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0); // 439
const TOTAL_SCROLL_MULT = SCENES.reduce((a, s) => a + s.scrollMultiplier, 0);
const SCROLL_VH = TOTAL_SCROLL_MULT * 100;

/* ── Types ─────────────────────────────────────────────────────── */
interface MasterScrollSceneProps {
    onProgressUpdate?: (progress: number, frame: number, scene: string) => void;
    onLoadProgress?: (progress: number) => void;
}

interface SceneState {
    index: number;
    localProgress: number;
    globalProgress: number;
}

/* ── Helper: draw image with "cover" + HD quality ──────────────── */
function drawCoverHD(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    alpha: number = 1
) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;

    // Resize canvas to full native resolution
    const targetW = w * dpr;
    const targetH = h * dpr;
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }

    // Max quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Compute "cover" dimensions
    const imgR = img.naturalWidth / img.naturalHeight;
    const canR = w / h;
    let dw: number, dh: number, ox: number, oy: number;

    if (imgR > canR) {
        dh = h;
        dw = h * imgR;
        ox = (w - dw) / 2;
        oy = 0;
    } else {
        dw = w;
        dh = w / imgR;
        ox = 0;
        oy = (h - dh) / 2;
    }

    if (alpha < 1) {
        ctx.globalAlpha = alpha;
    }
    ctx.drawImage(img, ox, oy, dw, dh);
    if (alpha < 1) {
        ctx.globalAlpha = 1;
    }
}

/* ── Find which scene a global frame belongs to ────────────────── */
function getSceneForFrame(globalFrame: number): { index: number; localFrame: number; localProgress: number } {
    for (let i = SCENES.length - 1; i >= 0; i--) {
        if (globalFrame >= SCENE_OFFSETS[i]) {
            const localFrame = globalFrame - SCENE_OFFSETS[i];
            const localProgress = Math.min(1, localFrame / Math.max(1, SCENES[i].frames - 1));
            return { index: i, localFrame, localProgress };
        }
    }
    return { index: 0, localFrame: 0, localProgress: 0 };
}

/* ── Component ─────────────────────────────────────────────────── */
export function MasterScrollScene({ onProgressUpdate, onLoadProgress }: MasterScrollSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const lastExactProgress = useRef(-1);

    const [scene, setScene] = useState<SceneState>({
        index: 0,
        localProgress: 0,
        globalProgress: 0,
    });

    const [isVisible, setIsVisible] = useState(false);

    /* ── Build all frame paths ───────────────────────────────────── */
    const framePaths = useMemo(() => {
        const paths: string[] = [];
        for (const s of SCENES) {
            for (let i = 1; i <= s.frames; i++) {
                paths.push(`/${s.folder}/ezgif-frame-${String(i).padStart(3, "0")}.jpg`);
            }
        }
        return paths;
    }, []);

    /* ── Draw with frame blending for 15fps → 60fps smoothness ─── */
    const drawBlended = useCallback((exactProgress: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // Avoid redrawing the exact same position
        if (Math.abs(exactProgress - lastExactProgress.current) < 0.00001) return;
        lastExactProgress.current = exactProgress;

        const imgs = imagesRef.current;
        const maxIdx = TOTAL_FRAMES - 1;

        // Continuous frame position (e.g., 42.7 means 70% between frame 42 and 43)
        const exactFrame = exactProgress * maxIdx;
        const frameA = Math.min(maxIdx, Math.max(0, Math.floor(exactFrame)));
        const frameB = Math.min(maxIdx, frameA + 1);
        const blend = exactFrame - frameA; // 0–1 interpolation factor

        const imgA = imgs[frameA];
        const imgB = imgs[frameB];

        const aReady = imgA?.complete && imgA.naturalWidth > 0;
        const bReady = imgB?.complete && imgB.naturalWidth > 0;

        if (aReady && bReady && frameA !== frameB && blend > 0.01) {
            // ── Cross-fade blend between two frames ──
            // Draw frame A at full opacity
            drawCoverHD(ctx, canvas, imgA, 1);
            // Draw frame B on top with partial opacity
            drawCoverHD(ctx, canvas, imgB, blend);
        } else if (aReady) {
            drawCoverHD(ctx, canvas, imgA, 1);
        } else {
            // Fallback: nearest loaded frame
            for (let off = 1; off < 30; off++) {
                const fb = imgs[Math.max(0, frameA - off)];
                if (fb?.complete && fb.naturalWidth > 0) {
                    drawCoverHD(ctx, canvas, fb, 1);
                    return;
                }
            }
        }
    }, []);

    /* ── Preload all images with progress reporting ───────────── */
    useEffect(() => {
        const total = framePaths.length;
        const imgs: HTMLImageElement[] = new Array(total);
        let loadedCount = 0;

        framePaths.forEach((src, i) => {
            const img = new Image();
            // Full quality: don't let browser downscale
            img.decoding = "async";
            img.onload = () => {
                loadedCount++;
                if (i === 0 && lastExactProgress.current === -1) {
                    drawBlended(0);
                }
                // Report loading progress
                onLoadProgress?.(loadedCount / total);
            };
            img.onerror = () => {
                loadedCount++;
                onLoadProgress?.(loadedCount / total);
            };
            img.src = src;
            imgs[i] = img;
        });

        imagesRef.current = imgs;

        return () => {
            imgs.forEach((img) => {
                if (img) img.src = "";
            });
        };
    }, [framePaths, drawBlended, onLoadProgress]);

    /* ── Scroll handler — with sub-frame precision ───────────────── */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ticking = false;

        const update = () => {
            ticking = false;
            const rect = container.getBoundingClientRect();
            const wh = window.innerHeight;
            const scrollable = container.offsetHeight - wh;
            if (scrollable <= 0) return;

            const visible = rect.top < wh && rect.bottom > 0;
            setIsVisible(visible);

            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollable));

            // Draw with sub-frame blending (not snapping to integer frame)
            drawBlended(progress);

            const frame = Math.min(
                TOTAL_FRAMES - 1,
                Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
            );

            const { index: sceneIdx, localProgress: localProg } = getSceneForFrame(frame);
            setScene({ index: sceneIdx, localProgress: localProg, globalProgress: progress });
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        const onResize = () => {
            lastExactProgress.current = -1;
            update();
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        requestAnimationFrame(() => requestAnimationFrame(update));

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [drawBlended]);

    /* ── Report to parent ────────────────────────────────────────── */
    useEffect(() => {
        if (onProgressUpdate) {
            const frame = Math.floor(scene.globalProgress * (TOTAL_FRAMES - 1));
            onProgressUpdate(scene.globalProgress, frame, SCENES[scene.index].name);
        }
    }, [scene, onProgressUpdate]);

    /* ── Render ──────────────────────────────────────────────────── */
    const { index: si, localProgress: lp } = scene;

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    position: "relative",
                    height: `${SCROLL_VH}vh`,
                }}
            />

            {isVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        zIndex: 5,
                        pointerEvents: "none",
                        background: "#000",
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            imageRendering: "auto",
                        }}
                    />

                    {si === 0 && <HeroOverlay progress={lp} />}
                    {si === 1 && <CityOverlay progress={lp} />}
                    {si === 2 && <ImpactOverlay progress={lp} />}
                    {si === 3 && <WhiteOverlay progress={lp} />}
                </div>
            )}
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════
   OVERLAY COMPONENTS
   ══════════════════════════════════════════════════════════════════ */

function HeroOverlay({ progress }: { progress: number }) {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            <div
                className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
                style={{
                    opacity: progress < 0.4 ? Math.max(0, 1 - progress * 2.5) : 0,
                    transform: `translateY(${progress * 60}px)`,
                }}
            >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white text-glow">
                    wowflow
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-lg font-light tracking-wide">
                    Automações inteligentes. Dashboards criativos.
                    <br />
                    <span className="text-white/80 font-medium">
                        Revolucionando o mundo.
                    </span>
                </p>
                <div className="flex items-center gap-2 text-white/30 text-sm mt-8 animate-pulse">
                    <span>Scroll para explorar</span>
                    <span>↓</span>
                </div>
            </div>

            {progress > 0.3 && progress < 0.8 && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                        opacity:
                            Math.min(1, (progress - 0.3) * 4) *
                            Math.min(1, (0.8 - progress) * 4),
                        transform: `scale(${0.9 + progress * 0.15})`,
                    }}
                >
                    <p className="text-2xl md:text-4xl font-light text-white/70 tracking-wide text-glow">
                        Olhe além do comum
                    </p>
                </div>
            )}

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
                    opacity: Math.min(1, progress * 1.5),
                }}
            />
        </div>
    );
}

function CityOverlay({ progress }: { progress: number }) {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at 50% 60%, rgba(99,102,241,${(0.05 + progress * 0.1).toFixed(3)}) 0%, transparent 70%)`,
                }}
            />

            {progress > 0.15 && progress < 0.5 && (
                <div
                    className="absolute top-1/4 left-8 md:left-16 z-10 max-w-xs"
                    style={{
                        opacity:
                            Math.min(1, (progress - 0.15) * 5) *
                            Math.min(1, (0.5 - progress) * 4),
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
                        opacity:
                            Math.min(1, (progress - 0.4) * 5) *
                            Math.min(1, (0.75 - progress) * 4),
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

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
    );
}

function ImpactOverlay({ progress }: { progress: number }) {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div
                className="absolute inset-0 light-bloom"
                style={{
                    opacity: progress > 0.5 ? (progress - 0.5) * 2 : 0,
                }}
            />

            <div
                className="absolute inset-0 bg-white"
                style={{
                    opacity: progress > 0.85 ? (progress - 0.85) * 6.67 : 0,
                }}
            />

            {progress > 0.1 && progress < 0.45 && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                        opacity:
                            Math.min(1, (progress - 0.1) * 5) *
                            Math.min(1, (0.45 - progress) * 5),
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

            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${(progress * 0.3).toFixed(3)}) 0%, transparent 60%)`,
                }}
            />
        </div>
    );
}

function WhiteOverlay({ progress }: { progress: number }) {
    const whiteFade = progress > 0.5 ? Math.min(1, (progress - 0.5) * 2.5) : 0;
    const darkFade = progress > 0.8 ? Math.min(1, (progress - 0.8) * 5) : 0;

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div
                className="absolute inset-0"
                style={{
                    background: "white",
                    opacity: whiteFade * (1 - darkFade),
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: "#09090b",
                    opacity: darkFade,
                }}
            />
        </div>
    );
}
