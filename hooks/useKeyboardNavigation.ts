import { useCallback } from 'react';

interface UseKeyboardNavigationProps {
  onClose: () => void;
  initialFocusRef: React.RefObject<HTMLElement>;
}

export function useKeyboardNavigation({ onClose, initialFocusRef }: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;

      case 'Tab':
        // Handle tab navigation within the dialog
        const dialog = e.currentTarget;
        const focusableElements = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        break;
    }
  }, [onClose]);

  return { handleKeyDown };
}