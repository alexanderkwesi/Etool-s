import React from 'react';

const Logo = ({ size = 40, animated = false }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0px 4px 10px rgba(124, 58, 237, 0.15))',
        animation: animated ? 'pulse 2s infinite ease-in-out' : 'none'
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Folded Document Page in Yellow & White */}
      <path 
        d="M25 15C25 12.2386 27.2386 10 30 10H60L75 25V85C75 87.7614 72.7614 90 70 90H30C27.2386 90 25 87.7614 25 85V15Z" 
        fill="#EAB308" 
        stroke="#FFFFFF" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
      
      {/* Page Fold Corner (White) */}
      <path 
        d="M60 10V25H75" 
        fill="#CA8A04"
        stroke="#FFFFFF" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
      
      {/* Document Text Lines (White) */}
      <line x1="38" y1="38" x2="62" y2="38" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="38" y1="48" x2="54" y2="48" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      
      {/* Circular revision arrow (Purple) */}
      <path 
        d="M38 72C31.3726 72 26 66.6274 26 60C26 53.3726 31.3726 48 38 48C44.6274 48 50 53.3726 50 60C50 62.5 49.2 64.8 47.9 66.7" 
        stroke="#7C3AED" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      
      {/* Revision edit pointer (Red) */}
      <path 
        d="M44 68L48 64L52 68" 
        stroke="#EF4444" 
        strokeWidth="4" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M43 64H53" 
        stroke="#EF4444" 
        strokeWidth="4" 
        strokeLinecap="round"
      />

      {/* Decorative Red Sparkle */}
      <path 
        d="M72 68L73.5 71L76.5 71.5L74.2 73.5L75 76.5L72 75L69 76.5L69.8 73.5L67.5 71.5L70.5 71L72 68Z" 
        fill="#EF4444"
      />
    </svg>
  );
};

export default Logo;
