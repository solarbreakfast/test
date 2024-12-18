import React, { useEffect, useRef } from 'react';

interface WaveformCanvasProps {
  audioBuffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  audioBuffer,
  currentTime,
  duration
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      const width = canvas.width;
      const height = canvas.height;
      const data = audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / width);
      const amp = height / 2;

      // Clear canvas
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#404040';

      let x = 0;
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        let sum = 0;
        let count = 0;

        // Calculate min, max, and average for this segment
        for (let j = 0; j < step; j++) {
          const idx = (i * step) + j;
          if (idx < data.length) {
            const value = data[idx];
            min = Math.min(min, value);
            max = Math.max(max, value);
            sum += Math.abs(value);
            count++;
          }
        }

        const avg = count > 0 ? sum / count : 0;
        const y1 = (1 + min) * amp;
        const y2 = (1 + max) * amp;
        const avgY = (1 + avg) * amp;

        // Draw min-max range with gradient
        const gradient = ctx.createLinearGradient(x, y1, x, y2);
        gradient.addColorStop(0, '#303030');
        gradient.addColorStop(1, '#404040');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y1, 1, y2 - y1);

        // Draw average line
        if (i > 0) {
          ctx.lineTo(x, avgY);
        } else {
          ctx.moveTo(x, avgY);
        }

        x++;
      }

      ctx.stroke();
    };

    // Handle canvas resize
    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        drawWaveform();
      }
    };

    // Set up resize observer
    resizeObserverRef.current = new ResizeObserver(updateCanvasSize);
    resizeObserverRef.current.observe(canvas);

    // Initial draw
    updateCanvasSize();

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [audioBuffer]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};