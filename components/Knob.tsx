import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createClickSound } from '../utils/audio/effects/clickSound';

interface KnobProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  formatValue?: (value: number) => string;
  size?: number;
  color?: string;
  grooves?: number;
}

export const Knob: React.FC<KnobProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  label,
  formatValue = (v) => v.toString(),
  size = 60,
  color = '#66bb6a',
  grooves = 28
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const clickSoundRef = useRef<{ play: () => void } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [lastValue, setLastValue] = useState(value);
  const stepThreshold = (max - min) / 100;

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    clickSoundRef.current = createClickSound(audioContext);
    return () => {
      audioContext.close();
    };
  }, []);

  const valueToAngle = useCallback((val: number) => {
    const range = max - min;
    const percentage = (val - min) / range;
    return -135 + (percentage * 270);
  }, [max, min]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const sensitivity = 2;
    const deltaY = (startY - e.clientY) * sensitivity;
    const range = max - min;
    const deltaValue = (deltaY / 200) * range;
    const newValue = Math.min(max, Math.max(min, startValue + deltaValue));
    const steppedValue = Math.round(newValue / step) * step;
    
    if (Math.abs(steppedValue - lastValue) >= stepThreshold) {
      clickSoundRef.current?.play();
      setLastValue(steppedValue);
    }
    
    onChange(steppedValue);
  }, [isDragging, startY, startValue, max, min, step, onChange, lastValue, stepThreshold]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rotation = valueToAngle(value);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        ref={knobRef}
        className="relative select-none group"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Knob base with metallic texture */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#333] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]">
          {/* Grooves with dynamic lighting */}
          {Array.from({ length: grooves }).map((_, i) => {
            const angle = (i * (360 / grooves));
            const isActive = Math.abs(angle - (rotation + 135)) < 45;
            return (
              <div
                key={i}
                className="absolute w-0.5 origin-bottom transition-all duration-100"
                style={{
                  left: '50%',
                  bottom: '50%',
                  height: size * 0.2,
                  transform: `rotate(${angle}deg) translateX(-50%)`,
                  background: `linear-gradient(to bottom, ${isActive ? '#404040' : '#2a2a2a'}, ${isActive ? '#333' : '#222'})`,
                  opacity: isActive ? 1 : 0.3,
                  boxShadow: isActive ? 'inset 0 1px 2px rgba(0,0,0,0.3)' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Indicator line with glow effect */}
        <div
          className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom transition-transform duration-100"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div 
            className="w-1 h-4 rounded-full transition-all duration-200"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 5px ${color}, 0 0 10px ${color}40`
            }}
          />
        </div>

        {/* Value display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-mono text-[#a0a0a0]">
            {formatValue(value)}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
      </div>

      {/* Label */}
      <div className="text-xs uppercase tracking-wider text-[#808080] font-medium">
        {label}
      </div>
    </div>
  );
};