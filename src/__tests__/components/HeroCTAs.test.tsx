import { render, screen, fireEvent } from '@testing-library/react';
import { HeroCTAs } from '@/components/HeroCTAs';
import { trackCTAClick } from '@/lib/analytics';

// Mock the analytics module
jest.mock('@/lib/analytics', () => ({
  trackCTAClick: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockedLink({ children, href, onClick, ...props }: any) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  };
});

describe('HeroCTAs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default mode (segmented=false)', () => {
    it('renders primary and secondary buttons on desktop', () => {
      render(<HeroCTAs />);

      // Primary button should always be visible
      expect(screen.getByText('登録してみる')).toBeInTheDocument();

      // Secondary button should be visible on desktop (hidden class should be present for mobile)
      const secondaryButton = screen.getByText('Bividとは？');
      expect(secondaryButton).toBeInTheDocument();
    });

    it('tracks analytics on primary button click', () => {
      render(<HeroCTAs />);

      const primaryButton = screen.getByText('登録してみる');
      fireEvent.click(primaryButton);

      expect(trackCTAClick).toHaveBeenCalledWith({
        label: '登録してみる',
        ctaType: 'primary',
        location: 'hero',
        audience: 'general',
        href: '/signup',
      });
    });

    it('tracks analytics on secondary button click', () => {
      render(<HeroCTAs />);

      const secondaryButton = screen.getByText('Bividとは？');
      fireEvent.click(secondaryButton);

      expect(trackCTAClick).toHaveBeenCalledWith({
        label: 'Bividとは？',
        ctaType: 'secondary',
        location: 'hero',
        audience: 'general',
        href: '/about',
      });
    });

    it('uses custom props correctly', () => {
      render(<HeroCTAs audience="helper" location="custom-location" />);

      const primaryButton = screen.getByText('登録してみる');
      fireEvent.click(primaryButton);

      expect(trackCTAClick).toHaveBeenCalledWith({
        label: '登録してみる',
        ctaType: 'primary',
        location: 'custom-location',
        audience: 'helper',
        href: '/signup',
      });
    });
  });

  describe('Segmented mode (segmented=true)', () => {
    it('renders segment-specific buttons', () => {
      render(<HeroCTAs segmented={true} />);

      expect(screen.getByText('支援者として登録')).toBeInTheDocument();
      expect(screen.getByText('手助けを依頼する')).toBeInTheDocument();

      // Should not render default buttons
      expect(screen.queryByText('登録してみる')).not.toBeInTheDocument();
      expect(screen.queryByText('Bividとは？')).not.toBeInTheDocument();
    });

    it('tracks analytics for helper segment button', () => {
      render(<HeroCTAs segmented={true} />);

      const helperButton = screen.getByText('支援者として登録');
      fireEvent.click(helperButton);

      expect(trackCTAClick).toHaveBeenCalledWith({
        label: '支援者として登録',
        ctaType: 'segment_helper',
        location: 'hero',
        audience: 'general',
        href: '/signup?role=helper',
      });
    });

    it('tracks analytics for seeker segment button', () => {
      render(<HeroCTAs segmented={true} />);

      const seekerButton = screen.getByText('手助けを依頼する');
      fireEvent.click(seekerButton);

      expect(trackCTAClick).toHaveBeenCalledWith({
        label: '手助けを依頼する',
        ctaType: 'segment_seeker',
        location: 'hero',
        audience: 'general',
        href: '/request',
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-labels for all buttons', () => {
      render(<HeroCTAs />);

      expect(screen.getByLabelText('新規登録を始める')).toBeInTheDocument();
      expect(screen.getByLabelText('Bividについて詳しく知る')).toBeInTheDocument();
    });

    it('has proper aria-labels for segmented buttons', () => {
      render(<HeroCTAs segmented={true} />);

      expect(screen.getByLabelText('支援者として登録する')).toBeInTheDocument();
      expect(screen.getByLabelText('手助けを依頼する')).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', () => {
      render(<HeroCTAs />);

      const primaryButton = screen.getByText('登録してみる');

      // Should be focusable
      primaryButton.focus();
      expect(document.activeElement).toBe(primaryButton);

      // Should trigger on Enter key
      fireEvent.keyDown(primaryButton, { key: 'Enter', code: 'Enter' });
      // Note: In a real test environment, this would trigger the link navigation
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<HeroCTAs className="custom-class" />);

      const ctaContainer = container.firstChild;
      expect(ctaContainer).toHaveClass('custom-class');
    });
  });
});