"use client";

import { useState, useCallback } from "react";
import { MasterScrollScene } from "./components/MasterScrollScene";
import { ContentSection } from "./components/ContentSection";
import { Footer } from "./components/Footer";
import { DebugOverlay } from "./components/DebugOverlay";

export default function Home() {
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

  return (
    <main className="film-grain">
      {/* Debug overlay */}
      <DebugOverlay
        progress={debugData.progress}
        currentFrame={debugData.currentFrame}
        activeScene={debugData.activeScene}
      />

      {/* Unified Frame-by-Frame Scroll Narrative */}
      <MasterScrollScene onProgressUpdate={handleProgressUpdate} />

      {/* Clean Content Section */}
      <ContentSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
