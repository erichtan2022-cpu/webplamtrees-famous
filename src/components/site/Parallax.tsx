import { useEffect, useRef, useState, ReactNode } from 'react';

interface ParallaxProps {
  image: string;
  speed?: number;
  height?: string;
  children?: ReactNode;
  overlayClass?: string;
}

export const Parallax = ({
  image,
  speed = 0.4,
  height = 'min-h-[480px]',
  children,
  overlayClass = 'bg-[#3a2e22]/55',
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > winH) return;
      // movement based on element center to viewport center
      const elCenter = rect.top + rect.height / 2;
      const viewCenter = winH / 2;
      const diff = viewCenter - elCenter;
      setOffset(diff * speed);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <section ref={ref} className={`relative ${height} overflow-hidden`}>
      <div
        className="absolute inset-0 -top-20 -bottom-20 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${image})`,
          transform: `translateY(${offset}px) scale(1.15)`,
        }}
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
};
