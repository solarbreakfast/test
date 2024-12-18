import React from 'react';
import { cn } from '../../utils/classNames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  active = false,
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'transition-colors duration-200 flex items-center justify-center gap-2 relative';
  
  const variantStyles = {
    primary: `
      rounded-full
      ${active
        ? 'bg-[#2a2a2a] text-[#66bb6a] animate-pulse-active'
        : disabled
          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          : 'bg-zinc-700 hover:bg-zinc-600 text-[#a0a0a0]'
      }
    `,
    secondary: `
      rounded-full border
      ${active
        ? 'bg-[#2a2a2a] border-[#66bb6a] text-[#66bb6a] animate-pulse-active'
        : disabled
          ? 'bg-zinc-800 border-zinc-700 text-zinc-600 cursor-not-allowed'
          : 'bg-[#1a1a1a] border-[#333] text-[#808080] hover:bg-[#222]'
      }
    `,
    icon: `
      rounded-full
      ${active
        ? 'bg-[#2a2a2a] text-[#66bb6a] animate-pulse-active'
        : disabled
          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          : 'bg-zinc-700 hover:bg-zinc-600 text-[#a0a0a0]'
      }
    `
  };

  const sizeStyles = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 sm:p-3 text-sm',
    lg: 'p-3 sm:p-4 text-sm'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {active && (
        <div 
          className="absolute inset-0 rounded-full bg-[#66bb6a] opacity-[0.03] animate-glow"
          style={{ animationDuration: '2s' }}
        />
      )}
      {children}
    </button>
  );
};