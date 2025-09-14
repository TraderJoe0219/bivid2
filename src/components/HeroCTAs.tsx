'use client';

import Link from 'next/link';
import { ROUTES, CTA_LABELS } from '@/lib/constants';
import { trackCTAClick } from '@/lib/analytics';

export type Audience = 'general' | 'helper' | 'seeker';

export interface HeroCTAsProps {
  audience?: Audience;
  segmented?: boolean;
  location?: string;
  className?: string;
}

export function HeroCTAs({
  audience = 'general',
  segmented = false,
  location = 'hero',
  className = '',
}: HeroCTAsProps) {
  const handleClick = (
    label: string,
    ctaType: 'primary' | 'secondary' | 'segment_helper' | 'segment_seeker',
    href: string
  ) => {
    trackCTAClick({
      label,
      ctaType,
      location,
      audience,
      href,
    });
  };

  const primaryButtonClass = `
    bg-[#0071bc] text-white rounded-2xl h-16 px-8 font-bold text-xl shadow-xl
    hover:bg-[#005a94] hover:shadow-2xl hover:scale-105
    focus-visible:ring-2 focus-visible:ring-[#0071bc] focus-visible:ring-offset-2
    transition-all duration-300 inline-flex items-center justify-center gap-3
    transform active:scale-95
  `.trim();

  const secondaryButtonClass = `
    border-2 border-[#0071bc] text-[#0071bc] bg-white rounded-2xl h-16 px-8 font-bold text-xl shadow-lg
    hover:bg-[#0071bc] hover:text-white hover:shadow-xl hover:scale-105
    focus-visible:ring-2 focus-visible:ring-[#0071bc] focus-visible:ring-offset-2
    transition-all duration-300 inline-flex items-center justify-center gap-3
    transform active:scale-95
  `.trim();

  const textLinkClass = `
    text-[#0071bc] underline underline-offset-4 hover:text-[#005a94] font-semibold text-lg
    focus-visible:ring-2 focus-visible:ring-[#0071bc] focus-visible:ring-offset-2 rounded-lg px-4 py-3
    transition-all duration-200 hover:bg-blue-50
    transform hover:scale-105
  `.trim();

  if (segmented) {
    return (
      <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
        {/* プライマリ: 支援者として登録 */}
        <Link
          href={ROUTES.SIGNUP_HELPER}
          className={primaryButtonClass}
          onClick={() =>
            handleClick(CTA_LABELS.SEGMENT_HELPER, 'segment_helper', ROUTES.SIGNUP_HELPER)
          }
          aria-label="支援者として登録する"
        >
          {CTA_LABELS.SEGMENT_HELPER}
        </Link>

        {/* セカンダリ: 手助けを依頼する */}
        <Link
          href={ROUTES.REQUEST}
          className={`${secondaryButtonClass} hidden md:inline-flex`}
          onClick={() =>
            handleClick(CTA_LABELS.SEGMENT_SEEKER, 'segment_seeker', ROUTES.REQUEST)
          }
          aria-label="手助けを依頼する"
        >
          {CTA_LABELS.SEGMENT_SEEKER}
        </Link>

        {/* モバイル用テキストリンク */}
        <Link
          href={ROUTES.REQUEST}
          className={`${textLinkClass} md:hidden text-center`}
          onClick={() =>
            handleClick(CTA_LABELS.SEGMENT_SEEKER, 'segment_seeker', ROUTES.REQUEST)
          }
          aria-label="手助けを依頼する"
        >
          {CTA_LABELS.SEGMENT_SEEKER}
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
      {/* プライマリ: 登録してみる */}
      <Link
        href={ROUTES.SIGNUP}
        className={primaryButtonClass}
        onClick={() =>
          handleClick(CTA_LABELS.PRIMARY_DEFAULT, 'primary', ROUTES.SIGNUP)
        }
        aria-label="新規登録を始める"
      >
        {CTA_LABELS.PRIMARY_DEFAULT}
      </Link>

      {/* セカンダリ: Bividとは？ */}
      <Link
        href={ROUTES.ABOUT}
        className={`${secondaryButtonClass} hidden md:inline-flex`}
        onClick={() =>
          handleClick(CTA_LABELS.SECONDARY_DEFAULT, 'secondary', ROUTES.ABOUT)
        }
        aria-label="Bividについて詳しく知る"
      >
        {CTA_LABELS.SECONDARY_DEFAULT}
      </Link>

      {/* モバイル用テキストリンク */}
      <Link
        href={ROUTES.ABOUT}
        className={`${textLinkClass} md:hidden text-center`}
        onClick={() =>
          handleClick(CTA_LABELS.SECONDARY_DEFAULT, 'secondary', ROUTES.ABOUT)
        }
        aria-label="Bividについて詳しく知る"
      >
        {CTA_LABELS.SECONDARY_DEFAULT}
      </Link>
    </div>
  );
}