import React from 'react';

// Floating decorative elements
export const FloatingCircle: React.FC<{
  color: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ color, size, className = '', style }) => (
  <div
    className={`memphis-circle absolute ${className}`}
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      ...style
    }}
  />
);

export const FloatingTriangle: React.FC<{
  color: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ color, size, className = '', style }) => (
  <div
    className={`absolute ${className}`}
    style={{
      width: 0,
      height: 0,
      borderLeft: `${size / 2}px solid transparent`,
      borderRight: `${size / 2}px solid transparent`,
      borderBottom: `${size}px solid ${color}`,
      filter: 'drop-shadow(3px 3px 0px rgba(0, 0, 0, 1))',
      ...style
    }}
  />
);

export const SquigglyLine: React.FC<{
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ color = '#000', className = '', style }) => (
  <svg
    className={`absolute ${className}`}
    width="120"
    height="40"
    viewBox="0 0 120 40"
    style={style}
  >
    <path
      d="M0 20 Q 15 0, 30 20 T 60 20 T 90 20 T 120 20"
      stroke={color}
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const ZigzagLine: React.FC<{
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ color = '#000', className = '', style }) => (
  <svg
    className={`absolute ${className}`}
    width="100"
    height="30"
    viewBox="0 0 100 30"
    style={style}
  >
    <path
      d="M0 15 L12.5 0 L25 15 L37.5 0 L50 15 L62.5 0 L75 15 L87.5 0 L100 15"
      stroke={color}
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DottedGrid: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = '', style }) => (
  <div
    className={`absolute ${className}`}
    style={{
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle, #000 3px, transparent 3px)',
      backgroundSize: '25px 25px',
      opacity: 0.3,
      ...style
    }}
  />
);

export const MemphisBlob: React.FC<{
  color: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 1 | 2 | 3;
}> = ({ color, className = '', style, variant = 1 }) => {
  const borderRadiuses = {
    1: '60% 40% 30% 70% / 60% 30% 70% 40%',
    2: '30% 70% 70% 30% / 30% 30% 70% 70%',
    3: '50% 50% 20% 80% / 25% 80% 20% 75%'
  };

  return (
    <div
      className={`absolute border-4 border-black ${className}`}
      style={{
        backgroundColor: color,
        borderRadius: borderRadiuses[variant],
        ...style
      }}
    />
  );
};

// Background Pattern Component
export const MemphisBackground: React.FC<{
  pattern?: 'squiggly' | 'dots' | 'triangles' | 'grid' | 'zigzag';
  color?: string;
  className?: string;
}> = ({ pattern = 'dots', color = '#000', className = '' }) => {
  const patterns = {
    squiggly: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 30 Q 20 10, 30 30 T 50 30' stroke='${encodeURIComponent(color)}' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
    dots: `radial-gradient(circle, ${color} 2px, transparent 2px)`,
    triangles: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='20,5 35,35 5,35' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1.5'/%3E%3C/svg%3E")`,
    grid: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
    zigzag: `url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L10 0 L20 10 L30 0 L40 10' stroke='${encodeURIComponent(color)}' stroke-width='2' fill='none'/%3E%3C/svg%3E")`
  };

  const sizes = {
    squiggly: '60px 60px',
    dots: '25px 25px',
    triangles: '40px 40px',
    grid: '40px 40px',
    zigzag: '40px 20px'
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: patterns[pattern],
        backgroundSize: sizes[pattern],
        opacity: 0.15
      }}
    />
  );
};

// Decorative Corner Elements
export const CornerDecoration: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  colors?: string[];
}> = ({ position, colors = ['#FF006E', '#FFBE0B', '#8338EC', '#06FFA5'] }) => {
  const positions = {
    'top-left': { top: 0, left: 0 },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 }
  };

  return (
    <div className="absolute pointer-events-none" style={positions[position]}>
      <FloatingCircle
        color={colors[0]}
        size={60}
        className="animate-float"
        style={{ transform: position.includes('right') ? 'translate(30%, -30%)' : 'translate(-30%, -30%)' }}
      />
      <FloatingCircle
        color={colors[1]}
        size={40}
        className="animate-float-delayed"
        style={{ transform: position.includes('right') ? 'translate(80%, 20%)' : 'translate(-80%, 20%)' }}
      />
    </div>
  );
};
