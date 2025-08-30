'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'default',
  size = 'md',
  showSubtitle = true,
  className,
  href = '/'
}) => {
  const sizes = {
    sm: { height: 24, width: 60 },
    md: { height: 32, width: 80 },
    lg: { height: 40, width: 100 }
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const subtitleSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  const logoContent = (
    <div className={cn(
      'flex items-center transition-opacity duration-200 hover:opacity-80',
      className
    )}>
      {variant === 'icon-only' ? (
        <Image
          src="/images/bivid-icon.png"
          alt="Bivid"
          width={sizes[size].height}
          height={sizes[size].height}
          className="shrink-0"
          priority
        />
      ) : (
        <>
          <Image
            src="/logo-bivid.svg"
            alt="Bivid"
            width={sizes[size].width}
            height={sizes[size].height}
            className="logo-image shrink-0"
            priority
          />
          {showSubtitle && variant !== 'compact' && (
            <span className={cn(
              'ml-3 font-medium text-elder-text-secondary',
              subtitleSizes[size]
            )}>
              スキルシェア
            </span>
          )}
        </>
      )}
    </div>
  );

  // ロゴ専用スタイルを適用
  return (
    <Link 
      href={href} 
      className={cn(
        'logo-link rounded-elder focus-outline',
        className
      )}
      aria-label="Bivid ホームページに戻る"
    >
      {logoContent}
    </Link>
  );
};

export default Logo;