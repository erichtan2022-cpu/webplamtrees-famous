// Decorative SVG elements with float animations

export const LeafSVG = ({ className = '', color = '#7A9A01' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 4 C48 16, 56 32, 32 60 C8 32, 16 16, 32 4 Z" fill={color} opacity="0.85" />
    <path d="M32 8 L32 56" stroke="#5d7400" strokeWidth="1.5" />
    <path d="M32 20 L24 26 M32 28 L22 34 M32 36 L24 42 M32 44 L26 48" stroke="#5d7400" strokeWidth="1" opacity="0.6" />
  </svg>
);

export const FloatingLeaf = ({ className = '', delay = 0, color = '#7A9A01' }: { className?: string; delay?: number; color?: string }) => (
  <div className={`absolute pointer-events-none ${className}`} style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${delay}s` }}>
    <LeafSVG className="w-full h-full" color={color} />
  </div>
);

export const WavyDivider = ({ flip = false, fill = '#F5F0E6' }: { flip?: boolean; fill?: string }) => (
  <svg viewBox="0 0 1440 80" className={`w-full ${flip ? 'rotate-180' : ''}`} preserveAspectRatio="none">
    <path d="M0 40 C 240 80, 480 0, 720 40 S 1200 80, 1440 40 L1440 80 L0 80 Z" fill={fill} />
  </svg>
);

export const CrayonSVG = ({ className = '', color = '#7A9A01' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 64 16" className={className}>
    <polygon points="0,8 8,2 8,14" fill="#FFE8B0" />
    <rect x="8" y="2" width="44" height="12" fill={color} rx="2" />
    <rect x="52" y="2" width="10" height="12" fill="#8B5E3C" rx="2" />
  </svg>
);

export const BlockSVG = ({ className = '', color = '#8B5E3C' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <rect x="6" y="6" width="52" height="52" rx="8" fill={color} />
    <rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
  </svg>
);

export const TreeIllustration = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 220" className={className}>
    <rect x="90" y="120" width="20" height="90" rx="6" fill="#8B5E3C" />
    <ellipse cx="100" cy="100" rx="50" ry="80" fill="#7A9A01" transform="rotate(-25 100 100)" opacity="0.85" />
    <ellipse cx="100" cy="100" rx="50" ry="80" fill="#7A9A01" transform="rotate(25 100 100)" opacity="0.85" />
    <ellipse cx="100" cy="80" rx="50" ry="80" fill="#8AB02A" />
    <ellipse cx="100" cy="100" rx="50" ry="80" fill="#7A9A01" transform="rotate(75 100 100)" opacity="0.75" />
    <ellipse cx="100" cy="100" rx="50" ry="80" fill="#7A9A01" transform="rotate(-75 100 100)" opacity="0.75" />
    <circle cx="100" cy="80" r="8" fill="#8B5E3C" />
  </svg>
);
