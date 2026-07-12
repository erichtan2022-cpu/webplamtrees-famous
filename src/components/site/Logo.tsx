import { images } from '@/data/siteContent';

export const Logo = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src={images.logo}
      alt="Palm Trees Montessori School"
      className="h-10 sm:h-11 w-auto object-contain"
    />
  </div>
);
