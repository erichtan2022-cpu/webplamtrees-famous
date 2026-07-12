import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const SectionReveal = ({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}) => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};
