import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, ...props }) => {
  return (
    <label 
      htmlFor={id} 
      className="flex items-center gap-3 text-[#808080] cursor-pointer group"
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div 
          className={`
            w-5 h-5 rounded border-2 transition-colors duration-200
            ${checked 
              ? 'bg-[#66bb6a] border-[#66bb6a]' 
              : 'bg-[#2a2a2a] border-[#404040] group-hover:border-[#505050]'
            }
          `}
        >
          <Check 
            size={16} 
            className={`
              text-black transition-opacity duration-200
              ${checked ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
};