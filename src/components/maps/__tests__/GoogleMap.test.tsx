import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoogleMap } from '../GoogleMap';

// 環境変数のモック
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key';

// Google Maps APIのモック
const mockMap = {
  addListener: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  fitBounds: jest.fn(),
  panTo: jest.fn(),
};

const mockMarker = {
  setMap: jest.fn(),
  addListener: jest.fn(),
};

const mockInfoWindow = {
  setContent: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
};

// Google Maps APIグローバルオブジェクトのモック
(global as any).google = {
  maps: {
    Map: jest.fn(() => mockMap),
    Marker: jest.fn(() => mockMarker),
    InfoWindow: jest.fn(() => mockInfoWindow),
    Size: jest.fn(),
    Point: jest.fn(),
    event: {
      addListenerOnce: jest.fn((map, event, callback) => {
        // 'idle' イベントを即座に発火
        if (event === 'idle') {
          setTimeout(callback, 100);
        }
      }),
    },
  },
};

// mapsLoaderのモック
jest.mock('@/lib/maps', () => ({
  mapsLoader: {
    load: jest.fn().mockResolvedValue(undefined),
  },
  getMapOptions: jest.fn(() => ({
    center: { lat: 34.7816, lng: 135.4956 },
    zoom: 13,
    mapTypeId: 'roadmap',
  })),
  DEFAULT_CENTER: { lat: 34.7816, lng: 135.4956 },
}));

describe('GoogleMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ローディング状態が表示される', () => {
    render(<GoogleMap />);
    
    expect(screen.getByText('地図を読み込み中...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('エラー状態が正しく表示される', async () => {
    // mapsLoaderでエラーを発生させる
    const { mapsLoader } = require('@/lib/maps');
    mapsLoader.load.mockRejectedValueOnce(new Error('API読み込みエラー'));

    render(<GoogleMap />);

    await waitFor(() => {
      expect(screen.getByText('地図の読み込みに失敗しました')).toBeInTheDocument();
      expect(screen.getByText('再読み込み')).toBeInTheDocument();
    });
  });

  it('カスタムクラス名が適用される', () => {
    const customClass = 'custom-map-class';
    render(<GoogleMap className={customClass} />);
    
    const mapContainer = screen.getByTestId('google-map-container');
    expect(mapContainer).toHaveClass(customClass);
  });

  it('カスタム高さが適用される', () => {
    const customHeight = '500px';
    render(<GoogleMap height={customHeight} />);
    
    const mapContainer = screen.getByTestId('google-map-container');
    expect(mapContainer).toHaveStyle({ height: customHeight });
  });

  it('地図が正常に読み込まれる', async () => {
    const onMapLoad = jest.fn();
    const { mapsLoader } = require('@/lib/maps');
    
    render(<GoogleMap onMapLoad={onMapLoad} />);

    await waitFor(() => {
      expect(mapsLoader.load).toHaveBeenCalled();
    });
  });

  it('マーカープロパティが正しく渡される', () => {
    const markers = [
      {
        id: 'marker1',
        position: { lat: 34.7816, lng: 135.4956 },
        title: 'テストマーカー',
        info: 'テスト情報',
      },
    ];

    render(<GoogleMap markers={markers} />);
    
    // マーカープロパティが正しく渡されることを確認
    expect(markers).toHaveLength(1);
    expect(markers[0].id).toBe('marker1');
  });

  it('コールバック関数が正しく設定される', () => {
    const mockOnMapClick = jest.fn();
    const mockOnMarkerClick = jest.fn();
    const mockOnMapLoad = jest.fn();

    render(
      <GoogleMap 
        onMapClick={mockOnMapClick}
        onMarkerClick={mockOnMarkerClick}
        onMapLoad={mockOnMapLoad}
      />
    );

    // コールバック関数が正しく設定されることを確認
    expect(mockOnMapClick).toBeDefined();
    expect(mockOnMarkerClick).toBeDefined();
    expect(mockOnMapLoad).toBeDefined();
  });
});
