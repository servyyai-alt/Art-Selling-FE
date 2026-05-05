import React from 'react';

export default function ARTTLogo({ size = 'md', light = false }) {
  const color = light ? '#F8F3ED' : '#000000';
  const goldColor = '#C9A34E';
  const scale = size === 'lg' ? 1.4 : size === 'sm' ? 0.7 : 1;

  return (
    <svg
      width={160 * scale}
      height={44 * scale}
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Women silhouette - left */}
      <path
        d="M10 38 Q12 30 11 24 Q10 18 13 14 Q15 10 18 12 Q21 14 20 18 Q19 22 18 24 Q17 28 16 32 Q15 36 16 38"
        stroke={goldColor}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Head */}
      <circle cx="15.5" cy="10" r="2.5" fill={goldColor} opacity="0.9" />
      {/* Leaf element */}
      <path
        d="M22 6 Q26 4 28 8 Q26 12 22 10 Q22 8 22 6Z"
        fill={goldColor}
        opacity="0.7"
      />
      {/* Second silhouette */}
      <path
        d="M26 38 Q28 32 27 26 Q26 20 28 16 Q30 12 33 13 Q36 15 35 20 Q34 25 32 30 Q30 34 30 38"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* ARTT text */}
      <text
        x="40"
        y="30"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="26"
        fontWeight="300"
        letterSpacing="8"
        fill={color}
      >
        ARTT
      </text>
      {/* Tagline */}
      <text
        x="40"
        y="40"
        fontFamily="'DM Sans', sans-serif"
        fontSize="7"
        fontWeight="400"
        letterSpacing="3.5"
        fill={goldColor}
        opacity="0.9"
      >
        ALANGUDI SUBRAMANIAM
      </text>
    </svg>
  );
}