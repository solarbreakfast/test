import React, { useEffect, useRef } from 'react';

interface SpectrumVisualizerProps {
  analyserNode: AnalyserNode | null;
  isFullscreen?: boolean;
}

export const SpectrumVisualizer: React.FC<SpectrumVisualizerProps> = ({ 
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

    analyserNode.fftSize = 2048;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      // Clear with fade effect
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

      // Draw frequency bars with enhanced styling
      const barWidth = (canvas.width / bufferLength) * 2.5;
      const barSpacing = isFullscreen ? 2 : 1;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Enhanced color calculation
        const hue = (i / bufferLength) * 120;
        const saturation = 70 + (dataArray[i] / 255) * 30;
        const lightness = 40 + (dataArray[i] / 255) * 20;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Draw bar with enhanced glow
        ctx.shadowBlur = isFullscreen ? 20 : 10;
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - barSpacing, barHeight);
        
        x += barWidth;
      }

      ctx.shadowBlur = 0;
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