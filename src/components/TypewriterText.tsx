import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { TextSegment } from '../types';

interface TypewriterTextProps {
  segments: TextSegment[];
  onComplete?: () => void;
}

export const TypewriterText = ({ segments, onComplete }: TypewriterTextProps) => {
  const totalChars = useMemo(() => segments.reduce((acc, s) => acc + s.text.length, 0), [segments]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete?.();
    }, totalChars * 50 + 1000);
    return () => clearTimeout(timeout);
  }, [totalChars, onComplete]);

  let runningCharIndex = 0;

  return (
    <span className="inline">
      {segments.map((seg, i) => {
        const isChar = seg.className?.includes('text-amber-600');
        const isLoc = seg.className?.includes('text-emerald-500');
        const isDialogue = seg.isDialogue;
        
        const charsInSeg = Array.from(seg.text);

        return (
          <span 
            key={i} 
            className={`${seg.className || ''} inline relative`}
          >
            {charsInSeg.map((char, j) => {
              const delay = runningCharIndex * 0.05;
              runningCharIndex++;
              
              return (
                <motion.span
                  key={j}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 6 }} 
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 1.2, 
                    delay: delay,
                    ease: [0.2, 0, 0.2, 1]
                  }}
                  className={`inline whitespace-pre-wrap ${
                    isDialogue ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]' : ''
                  } ${
                    (isChar || isLoc) ? (isChar ? 'animate-[glow-pulse_3s_infinite]' : 'animate-[glow-pulse_4s_infinite]') : ''
                  }`}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};
