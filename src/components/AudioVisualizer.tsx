import React, { useEffect, useRef } from 'react';
import { globalAudioEngine } from '../audioEngine';

interface AudioVisualizerProps {
  mode: 'Cyberpunk' | 'Espacial' | 'Minimalista' | 'Abstracto';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; size: number; speed: number; angle: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize container observer
    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 300;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialise responsive background particles
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    // Allocate data array for audio statistics
    const dataSize = 128;
    const dataArray = new Uint8Array(dataSize);

    const renderLoop = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with elegant translucent dark mask to produce glowing tails
      ctx.fillStyle = 'rgba(10, 10, 16, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Fetch audio data
      const analyser = globalAudioEngine.getAnalyser();
      let averageVolume = 0;

      if (analyser && globalAudioEngine.isPlaying()) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataSize; i++) {
          sum += dataArray[i];
        }
        averageVolume = sum / dataSize;
      } else {
        // Mock subtle default movement when paused
        for (let i = 0; i < dataSize; i++) {
          dataArray[i] = 20 + Math.sin(Date.now() * 0.003 + i * 0.1) * 15;
        }
        averageVolume = 30 + Math.sin(Date.now() * 0.001) * 10;
      }

      const normalizedVol = averageVolume / 255; // 0 to 1

      // 1. DYNAMIC COLOR SCHEMES depending on the mode
      let primaryColor = '#a855f7'; // purple
      let secondaryColor = '#06b6d4'; // cyan
      let glowColor = 'rgba(168, 85, 247, 0.4)';

      if (mode === 'Cyberpunk') {
        primaryColor = '#ff007f'; // deep pink
        secondaryColor = '#00f0ff'; // sharp neon cyan
        glowColor = 'rgba(255, 0, 127, 0.35)';
      } else if (mode === 'Espacial') {
        primaryColor = '#3b82f6'; // celestial blue
        secondaryColor = '#818cf8'; // deep violet
        glowColor = 'rgba(59, 130, 246, 0.3)';
      } else if (mode === 'Minimalista') {
        primaryColor = '#ffffff'; // clean white
        secondaryColor = '#94a3b8'; // slate silver
        glowColor = 'rgba(255, 255, 255, 0.15)';
      } else if (mode === 'Abstracto') {
        primaryColor = '#f59e0b'; // amber gold
        secondaryColor = '#ec4899'; // bubblegum pink
        glowColor = 'rgba(245, 158, 11, 0.35)';
      }

      // 2. BACKGROUND PARTICLES MOVEMENT (reacting to volume)
      ctx.fillStyle = secondaryColor;
      particlesRef.current.forEach((p) => {
        // Speed boosts up based on audio energy
        const speedMultiplier = 1.0 + normalizedVol * 6.0;
        p.x += Math.cos(p.angle) * p.speed * speedMultiplier;
        p.y += Math.sin(p.angle) * p.speed * speedMultiplier;

        // Warp bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1.0 + normalizedVol), 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. MAIN SHAPE DESIGN PER MODE
      if (mode === 'Cyberpunk') {
        // Draw cyberpunk matrix grid moving backwards
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridStep = 40;
        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw frequency spectrum at bottom
        const barWidth = (width / dataSize) * 1.5;
        let x = 0;
        for (let i = 0; i < dataSize / 1.5; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.72;
          
          ctx.shadowBlur = 10;
          ctx.shadowColor = primaryColor;
          
          // Double color gradient bar
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, secondaryColor);
          ctx.fillStyle = gradient;

          ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
        // Reset path shadow
        ctx.shadowBlur = 0;

      } else if (mode === 'Espacial') {
        // Concentric circular galaxy stars expanding with bass beats
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.28;
        const zoomRadius = baseRadius + (normalizedVol * 60);

        ctx.shadowBlur = 15;
        ctx.shadowColor = primaryColor;

        // Outer neon stellar ring
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3 + normalizedVol * 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, zoomRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Nebula spectrum bands inside circle
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < dataSize; i++) {
          const angle = (i / dataSize) * Math.PI * 2;
          const offset = (dataArray[i] / 255) * 35;
          const r = zoomRadius - 15 - offset;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (mode === 'Minimalista') {
        // Single wave line cutting through middle
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const sliceWidth = width / dataSize;
        let x = 0;

        for (let i = 0; i < dataSize; i++) {
          const value = dataArray[i] / 255;
          const y = (height / 2) + (value - 0.5) * height * 0.65;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

      } else if (mode === 'Abstracto') {
        // Rotating colorful audio lotus
        const centerX = width / 2;
        const centerY = height / 2;
        const petals = 28;
        const baseRadius = 50 + (normalizedVol * 30);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(Date.now() * 0.0003);

        ctx.shadowBlur = 12;
        ctx.shadowColor = glowColor;

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          const audioVal = dataArray[i % 30] || 40;
          const petalLength = baseRadius + (audioVal / 255) * 90;

          ctx.strokeStyle = i % 2 === 0 ? primaryColor : secondaryColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            Math.cos(angle + 0.1) * (petalLength * 0.5),
            Math.sin(angle + 0.1) * (petalLength * 0.5),
            Math.cos(angle) * petalLength,
            Math.sin(angle) * petalLength
          );
          ctx.quadraticCurveTo(
            Math.cos(angle - 0.1) * (petalLength * 0.5),
            Math.sin(angle - 0.1) * (petalLength * 0.5),
            0,
            0
          );
          ctx.stroke();
        }
        ctx.restore();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    // Begin looping
    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode]);

  return (
    <div className="relative w-full h-full bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/40" id="visualizer-container">
      <canvas ref={canvasRef} className="block w-full h-full" id="canvas-visualizer" />
      
      {/* Decorative neon corner marks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/60 rounded-tl pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-pink-500/60 rounded-tr pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/60 rounded-bl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-yellow-500/60 rounded-br pointer-events-none" />

      {/* Visualizer overlay tag */}
      <div className="absolute top-3 left-4 flex items-center space-x-2 bg-slate-900/90 py-1 px-2.5 rounded-full border border-slate-800/80 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="font-mono text-[10px] uppercase text-cyan-400 tracking-wider">LIVE FEED: {mode}</span>
      </div>
    </div>
  );
};
