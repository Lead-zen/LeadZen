import React from 'react';
import { Wand2 } from 'lucide-react';

const LogoWithText = () => {
  return (
    <div className="flex items-center gap-2">
      <Wand2 
        size={28} 
        strokeWidth={2} 
        color="#6B21A8" 
        className="flex-shrink-0"
        style={{ transform: 'scaleX(-1)' }}
      />
      <span 
        className="font-bold text-neutral-800 text-lg leading-none"
        style={{ fontFamily: 'sans-serif' }}
      >
        AI Lead Gen
      </span>
    </div>
  );
};

export default LogoWithText;
