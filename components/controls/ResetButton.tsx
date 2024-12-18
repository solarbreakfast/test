import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
  hasModifications: boolean;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ 
  onReset, 
  disabled = false,
  hasModifications
}) => {
  return (
    <Button
      variant="primary"
      size="md"
      disabled={disabled || !hasModifications}
      onClick={onReset}
      title={disabled ? 'Load audio to reset' : 'Reset to original state'}
    >
      <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="text-xs font-medium uppercase tracking-wider">Reset</span>
    </Button>
  );
};