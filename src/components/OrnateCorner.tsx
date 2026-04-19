import React from 'react';

export const OrnateCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const rotations = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    bl: 'rotate-270',
    br: 'rotate-180'
  };
  const positions = {
    tl: 'top-4 left-4',
    tr: 'top-4 right-4',
    bl: 'bottom-4 left-4',
    br: 'bottom-4 right-4'
  };

  return (
    <div className={`absolute ${positions[position]} ${rotations[position]} w-16 h-16 md:w-24 md:h-24 pointer-events-none opacity-50`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-700/40">
        <path d="M10 10H45M10 10V45M10 10L35 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 15C25 15 20 25 30 25C40 25 35 15 35 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 25C15 25 25 20 25 30C25 40 15 35 15 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="3" fill="currentColor"/>
        <circle cx="50" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="50" r="1.5" fill="currentColor"/>
        <path d="M60 10C60 10 65 5 70 10M10 60C10 60 5 65 10 70" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
};
