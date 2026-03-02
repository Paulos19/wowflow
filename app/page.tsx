"use client";

import { useState, useCallback, useRef } from "react";
import { VideoPreloader } from "./components/VideoPreloader";
import { MasterScrollScene } from "./components/MasterScrollScene";
import { ContentSection } from "./components/ContentSection";
import { Footer } from "./components/Footer";
import { DebugOverlay } from "./components/DebugOverlay";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const loadProgressRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const [debugData, setDebugData] = useState({
    progress: 0,
    currentFrame: 0,
    activeScene: "—",
  });

  const handleProgressUpdate = useCallback(
    (progress: number, frame: number, scene: string) => {
      setDebugData({ progress, currentFrame: frame, activeScene: scene });
    },
    []
  );

  const handleLoadProgress = useCallback((p: number) => {
    loadProgressRef.current = p;
    setLoadProgress(p);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <main className="film-grain">
      {/* Video Preloader — plays MP4 while frames load */}
      {!preloaderDone && (
        <VideoPreloader
          videoSrc="/Whisk_ajnkvmmlvtylvgzj1iymnjytymn3qtlknzm10cm.mp4"
          loadProgress={loadProgress}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Debug overlay */}
      <DebugOverlay
        progress={debugData.progress}
        currentFrame={debugData.currentFrame}
        activeScene={debugData.activeScene}
      />

      {/* Unified Frame-by-Frame Scroll Narrative */}
      <MasterScrollScene
        onProgressUpdate={handleProgressUpdate}
        onLoadProgress={handleLoadProgress}
      />

      {/* Content Section with Cards + Spline 3D */}
      <ContentSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
