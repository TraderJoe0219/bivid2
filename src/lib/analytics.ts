type DataLayerEvent = {
  event: string;
  label?: string;
  cta_type?: string;
  location?: string;
  audience?: string;
  href?: string;
  [key: string]: any;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Safely pushes data to dataLayer with type safety and error handling
 */
export function safePush(data: DataLayerEvent): void {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
    }
  } catch (error) {
    // Silent fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to push to dataLayer:', error);
    }
  }
}

/**
 * Helper function to track CTA clicks
 */
export function trackCTAClick({
  label,
  ctaType,
  location = 'hero',
  audience = 'general',
  href,
}: {
  label: string;
  ctaType: 'primary' | 'secondary' | 'segment_helper' | 'segment_seeker';
  location?: string;
  audience?: string;
  href: string;
}): void {
  safePush({
    event: 'cta_click',
    label,
    cta_type: ctaType,
    location,
    audience,
    href,
  });
}