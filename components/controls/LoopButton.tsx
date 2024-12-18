import React from 'react';
import { Repeat } from 'lucide-react';
import { Button } from '../common/Button';

interface LoopButtonProps {
  isLooping: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const LoopButton: React.FC<LoopButtonProps> = ({ 
  isLooping, 
  onToggle,
  disabled = false 
}) => {
  return (
    <Button
      variant="icon"
      size="md"
      active={isLooping}
      disabled={disabled}
      onClick={onToggle}
      title={disabled ? 'Load audio to enable loop' : 'Toggle loop'}
    >
      <Repeat size={20} className="sm:w-6 sm:h-6" />
    </Button>
  );
};