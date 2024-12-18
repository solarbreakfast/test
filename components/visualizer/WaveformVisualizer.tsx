import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isFullscreen?: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  analyserNode,
  isFullscreen = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas size based on fullscreen state
    const updateCanvasSize = () => {
      if (isFullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = 800;
        canvas.height = 160;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    analyserNode.fftSize = 4096;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let prevDataArray = new Uint8Array(bufferLength).fill(128);
    const smoothingFactor = 0.8;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserNode.getByteTimeDomainData(dataArray);

      // CRT-style phosphor glow effect
      ctx.fillStyle = 'rgba(18, 18, 18, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines with adjusted spacing for fullscreen
      const gridSpacing = isFullscreen ? 40 : 20;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#272727';
      ctx.beginPath();
      
      for (let i = 0; i < canvas.height; i += gridSpacing) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
      }
      for (let i = 0; i < canvas.width; i += gridSpacing) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
      }
      ctx.stroke();

      // Draw waveform with enhanced styling
      ctx.lineWidth = isFullscreen ? 3 : 2;
      ctx.strokeStyle = '#66bb6a';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const smoothedValue = smoothingFactor * (dataArray[i] / 128.0) + 
                            (1 - smoothingFactor) * (prevDataArray[i] / 128.0);
        const y = (smoothedValue * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = x - sliceWidth;
          const prevY = (prevDataArray[i - 1] / 128.0) * (canvas.height / 2);
          const cpX = (x + prevX) / 2;
          ctx.quadraticCurveTo(cpX, prevY, x, y);
        }

        x += sliceWidth;
      }

      // Enhanced glow effect
      ctx.shadowBlur = isFullscreen ? 25 : 15;
      ctx.shadowColor = '#4CAF50';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Store current data for next frame
      prevDataArray.set(dataArray);
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserNode, isFullscreen]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};