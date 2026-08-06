import { images } from '@/data/siteContent';
import { useSiteImages } from '@/hooks/useSiteContent';

export const Logo = ({ className = '' }: { className?: string }) => {
  const { getImage } = useSiteImages();
  const logoUrl = getImage('global', 'logo') || images.logo;
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoUrl}
        alt="Palm Trees Montessori School"
        className="h-10 sm:h-11 w-auto object-contain"
      />
    </div>
  );
};
