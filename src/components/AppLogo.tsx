import React from 'react';

interface AppLogoProps {
  className?: string; // Additional classes
  size?: number | string; // Size in pixels
  showShadow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  className = '', 
  size = 48,
  showShadow = true
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient shadow glow */}
      {showShadow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00478d] to-[#006a62] rounded-full opacity-20 blur-[8px] animate-pulse pointer-events-none"></div>
      )}
      
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-sm relative z-10"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SHIELD - LEFT HALF (Shadow / Deep tone) */}
        <path 
          d="M 50,15 L 22,23 C 22,23 22,54 22,54 C 22,69 50,86 50,86 Z" 
          fill="url(#shieldLeftGrad)" 
        />
        
        {/* SHIELD - RIGHT HALF (Highlight / Light tone) */}
        <path 
          d="M 50,15 L 78,23 C 78,23 78,54 78,54 C 78,69 50,86 50,86 Z" 
          fill="url(#shieldRightGrad)" 
        />

        {/* SHIELD INNER DETAILED SHADING BORDER LINE (Left) */}
        <path 
          d="M 50,19 L 26,26 C 26,26 26,52 26,52 C 26,65 50,80 50,80" 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />

        {/* SHIELD INNER DETAILED SHADING BORDER LINE (Right) */}
        <path 
          d="M 50,19 L 74,26 C 74,26 74,52 74,52 C 74,65 50,80 50,80" 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />

        {/* ERLENMEYER FLASK / BEAKER INNER CONTENT */}
        <g id="beaker-group">
          {/* Liquid content shadow gradient */}
          <path 
            d="M 37,68 C 43,66 45,71 52,67 C 58,63 59,69 63,68 C 64.5,69 64,72 61.5,72 L 38.5,72 C 36,72 35.5,69 37,68 Z" 
            fill="#79f4e5" 
            className="animate-pulse"
            opacity="0.85"
          />

          {/* Liquid small bubbles */}
          <circle cx="49" cy="62" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="54" cy="65" r="1" fill="#ffffff" opacity="0.5" />
          <circle cx="43" cy="66" r="1" fill="#ffffff" opacity="0.4" />

          {/* Beaker physical body outline */}
          <path 
            d="M 45,38 L 55,38 L 55,47 L 67.5,67.5 C 69.5,71 67.5,74.5 63.5,74.5 L 36.5,74.5 C 32.5,74.5 30.5,71 32.5,67.5 L 45,47 Z" 
            stroke="#ffffff" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Beaker lip ridge */}
          <path 
            d="M 43,38 L 57,38" 
            stroke="#ffffff" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </g>

        {/* GREEN CHECK MARK PROTECTIVE BORDER MASK */}
        {/* Ensures the check mark sits independently on top with a clean white cut-out gap */}
        <path 
          d="M 39,22 L 48,31 L 67,12" 
          stroke="#ffffff" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* GREEN CHECK MARK */}
        <path 
          d="M 39,22 L 48,31 L 67,12" 
          stroke="#10B981" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* GRADIENT DEFINITIONS */}
        <defs>
          {/* Deep executive blue core gradient */}
          <linearGradient id="shieldLeftGrad" x1="22" y1="15" x2="50" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#004182" />
            <stop offset="100%" stopColor="#002d5c" />
          </linearGradient>
          
          {/* Radiant highlighting blue gradient */}
          <linearGradient id="shieldRightGrad" x1="50" y1="15" x2="78" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#006eb8" />
            <stop offset="100%" stopColor="#00478d" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
