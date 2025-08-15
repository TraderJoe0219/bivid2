'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap } from '@/components/maps/GoogleMap';

const DEFAULT_CENTER = {
  lat: 34.7816,
  lng: 135.4689
};

export default function TestMapPage() {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const sampleMarkers = [
    {
      id: '1',
      position: { lat: 34.7816, lng: 135.4689 },
      title: 'パソコン基礎講座',
      info: 'パソコンの基本操作を学びます'
    },
    {
      id: '2',
      position: { lat: 34.7900, lng: 135.4800 },
      title: '庭の手入れお手伝い',
      info: '庭の草むしりや植木の手入れをします'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">地図テスト</h1>
        <div className="mb-4 text-sm text-gray-600">
          <p>マップ状態: {mapLoaded ? '読み込み完了' : '読み込み中...'}</p>
          <p>マーカー数: {sampleMarkers.length}</p>
          <p>座標: {DEFAULT_CENTER.lat}, {DEFAULT_CENTER.lng}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <GoogleMap
            center={DEFAULT_CENTER}
            zoom={13}
            markers={sampleMarkers}
            onMarkerClick={(markerId) => {
              const marker = sampleMarkers.find(m => m.id === markerId);
              if (marker) {
                setSelectedActivity(marker);
                alert(`選択された活動: ${marker.title}`);
              }
            }}
            onMapLoad={(map) => {
              setMapLoaded(true);
            }}
            className="w-full"
            height="500px"
          />
        </div>
        
        {selectedActivity && (
          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold">{selectedActivity.title}</h2>
            <p className="text-gray-600">{selectedActivity.info}</p>
          </div>
        )}
      </div>
    </div>
  );
}
