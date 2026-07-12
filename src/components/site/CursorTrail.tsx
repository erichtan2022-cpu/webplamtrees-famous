import { useEffect, useRef } from 'react';

export const CursorTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let lastTime = 0;
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 80) return; // throttle
      lastTime = now;
      if (!containerRef.current) return;

      const leaf = document.createElement('div');
      leaf.className = 'pointer-events-none fixed z-[9999]';
      leaf.style.left = `${e.clientX}px`;
      leaf.style.top = `${e.clientY}px`;
      leaf.style.width = '14px';
      leaf.style.height = '14px';
      leaf.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
      leaf.innerHTML = `<svg viewBox="0 0 64 64" width="14" height="14"><path d="M32 4 C48 16, 56 32, 32 60 C8 32, 16 16, 32 4 Z" fill="#7A9A01" opacity="0.7"/></svg>`;
      leaf.style.animation = 'leafFall 1.4s ease-out forwards';
      containerRef.current.appendChild(leaf);
      setTimeout(() => leaf.remove(), 1500);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[9998]" />;
};
