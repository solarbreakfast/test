import React from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '../common/Button';

interface RandomizeButtonProps {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled?: boolean;
}

export const RandomizeButton: React.FC<RandomizeButtonProps> = ({ 
  isGenerating, 
  onGenerate,
  disabled = false 
}) => {
  return (
    <Button
      variant="primary"
      size="md"
      active={isGenerating}
      disabled={disabled || isGenerating}
      onClick={onGenerate}
      className="w-[120px]"
      title={disabled ? 'Load audio to randomize' : 'Generate random parameters'}
    >
      <Shuffle size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="text-xs font-medium uppercase tracking-wider">
        Random
      </span>
    </Button>
  );
};