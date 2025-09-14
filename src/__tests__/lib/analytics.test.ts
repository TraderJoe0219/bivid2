import { safePush, trackCTAClick } from '@/lib/analytics';

// Mock console.warn to avoid noise in tests
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('analytics', () => {
  let mockDataLayer: any[];

  beforeEach(() => {
    // Reset dataLayer mock
    mockDataLayer = [];
    Object.defineProperty(window, 'dataLayer', {
      value: mockDataLayer,
      writable: true,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('safePush', () => {
    it('pushes data to dataLayer when available', () => {
      const testData = { event: 'test_event', label: 'test' };

      safePush(testData);

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual(testData);
    });

    it('handles missing dataLayer gracefully', () => {
      // Remove dataLayer
      delete (window as any).dataLayer;

      const testData = { event: 'test_event', label: 'test' };

      expect(() => safePush(testData)).not.toThrow();
    });

    it('handles dataLayer push errors gracefully', () => {
      // Mock dataLayer.push to throw an error
      Object.defineProperty(window, 'dataLayer', {
        value: {
          push: () => {
            throw new Error('Test error');
          },
        },
        writable: true,
      });

      const testData = { event: 'test_event', label: 'test' };

      expect(() => safePush(testData)).not.toThrow();
    });

    it('logs errors in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Mock dataLayer.push to throw an error
      Object.defineProperty(window, 'dataLayer', {
        value: {
          push: () => {
            throw new Error('Test error');
          },
        },
        writable: true,
      });

      const testData = { event: 'test_event', label: 'test' };

      safePush(testData);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Failed to push to dataLayer:',
        expect.any(Error)
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('trackCTAClick', () => {
    it('tracks CTA click with all parameters', () => {
      trackCTAClick({
        label: 'Test Button',
        ctaType: 'primary',
        location: 'test-location',
        audience: 'test-audience',
        href: '/test',
      });

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual({
        event: 'cta_click',
        label: 'Test Button',
        cta_type: 'primary',
        location: 'test-location',
        audience: 'test-audience',
        href: '/test',
      });
    });

    it('uses default values for optional parameters', () => {
      trackCTAClick({
        label: 'Test Button',
        ctaType: 'secondary',
        href: '/test',
      });

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0]).toEqual({
        event: 'cta_click',
        label: 'Test Button',
        cta_type: 'secondary',
        location: 'hero',
        audience: 'general',
        href: '/test',
      });
    });

    it('works with all CTA types', () => {
      const ctaTypes = ['primary', 'secondary', 'segment_helper', 'segment_seeker'] as const;

      ctaTypes.forEach((ctaType, index) => {
        trackCTAClick({
          label: `Button ${index}`,
          ctaType,
          href: `/test-${index}`,
        });
      });

      expect(mockDataLayer).toHaveLength(4);
      ctaTypes.forEach((ctaType, index) => {
        expect(mockDataLayer[index].cta_type).toBe(ctaType);
      });
    });
  });
});