# Google Maps API統合ガイド

## 概要

BividにGoogle Maps JavaScript APIを統合し、高齢者向けの地図ベース検索機能を実装しました。

## 実装された機能

### 基本機能
- ✅ Google Maps JavaScript API v3の統合
- ✅ Next.js環境での@googlemaps/js-api-loader使用
- ✅ 環境変数でのAPIキー管理
- ✅ 大阪府豊中市中心の初期表示
- ✅ 地図の表示・操作（ズーム、パン）
- ✅ 住所検索機能
- ✅ 現在地取得機能
- ✅ マーカー表示機能

### 高齢者向け配慮
- ✅ 大きな地図表示エリア（500px高さ）
- ✅ 分かりやすいコントロールボタン
- ✅ 地図操作の説明テキスト
- ✅ ローディング表示
- ✅ エラーハンドリングと分かりやすいメッセージ
- ✅ 大きなフォント（16px以上）とボタン（44px以上）

## ファイル構成

```
src/
├── lib/
│   └── maps.ts                    # Google Maps API関連のユーティリティ
├── components/
│   ├── maps/
│   │   ├── GoogleMap.tsx          # 地図表示コンポーネント
│   │   └── MapSearch.tsx          # 地図検索コンポーネント
│   └── layout/
│       └── Navigation.tsx         # ナビゲーション（地図リンク追加）
└── app/
    └── map/
        └── page.tsx               # 地図ページ
```

## 環境変数設定

`.env.local`に以下を追加：

```bash
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 主要コンポーネント

### 1. GoogleMap コンポーネント

**場所**: `src/components/maps/GoogleMap.tsx`

**機能**:
- Google Maps APIの初期化
- 地図の表示とインタラクション
- マーカーの表示と管理
- InfoWindowでの情報表示
- エラーハンドリング

**Props**:
```typescript
interface GoogleMapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title?: string;
    info?: string;
  }>;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (markerId: string) => void;
  className?: string;
  height?: string;
}
```

### 2. MapSearch コンポーネント

**場所**: `src/components/maps/MapSearch.tsx`

**機能**:
- 住所検索
- 現在地取得
- 使い方ガイド表示

**Props**:
```typescript
interface MapSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  onError?: (error: string) => void;
  className?: string;
}
```

### 3. 地図ユーティリティ

**場所**: `src/lib/maps.ts`

**主要関数**:
- `getCurrentLocation()`: 現在地取得
- `geocodeAddress()`: 住所から座標変換
- `reverseGeocode()`: 座標から住所変換
- `calculateDistance()`: 2点間の距離計算

## 使用方法

### 基本的な地図表示

```tsx
import { GoogleMap } from '@/components/maps/GoogleMap';

export default function MyPage() {
  return (
    <GoogleMap
      center={{ lat: 34.7816, lng: 135.4689 }}
      zoom={13}
      height="400px"
    />
  );
}
```

### 検索機能付き地図

```tsx
import { GoogleMap } from '@/components/maps/GoogleMap';
import { MapSearch } from '@/components/maps/MapSearch';

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 34.7816, lng: 135.4689 });
  const [markers, setMarkers] = useState([]);

  const handleLocationSelect = (location) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setMarkers([{
      id: 'selected',
      position: { lat: location.lat, lng: location.lng },
      title: '選択した場所',
      info: location.address
    }]);
  };

  return (
    <div>
      <MapSearch onLocationSelect={handleLocationSelect} />
      <GoogleMap
        center={center}
        markers={markers}
        height="500px"
      />
    </div>
  );
}
```

## 高齢者向けUI/UX配慮

### 1. アクセシビリティ
- 最小44pxのタッチターゲット
- 高コントラストカラー使用
- 明確な日本語メッセージ
- キーボードナビゲーション対応

### 2. 使いやすさ
- 大きなボタンとフォント
- 分かりやすいアイコン使用
- ステップバイステップの説明
- エラー時の親切なメッセージ

### 3. 操作性
- 誤操作防止（cooperative gesture handling）
- ローディング状態の明確な表示
- 再試行ボタンの提供

## API制限と注意事項

### 1. Google Maps API制限
- 1日あたりのリクエスト制限
- 同時接続数制限
- 商用利用時の料金体系

### 2. パフォーマンス
- 地図の遅延読み込み
- マーカーの効率的な管理
- メモリリークの防止

### 3. セキュリティ
- APIキーの適切な管理
- ドメイン制限の設定
- リファラー制限の設定

## トラブルシューティング

### よくある問題

1. **地図が表示されない**
   - APIキーの確認
   - ドメイン制限の確認
   - コンソールエラーの確認

2. **現在地が取得できない**
   - HTTPS環境での実行確認
   - ブラウザの位置情報許可確認
   - プライバシー設定の確認

3. **住所検索が機能しない**
   - Geocoding APIの有効化確認
   - 検索クエリの形式確認
   - API制限の確認

## 今後の拡張予定

### フェーズ2
- [ ] スキル提供者の地図上表示
- [ ] 距離ベースの検索フィルター
- [ ] ルート案内機能
- [ ] お気に入り場所の保存

### フェーズ3
- [ ] リアルタイム位置共有
- [ ] 地図上でのメッセージング
- [ ] イベント場所の可視化
- [ ] 交通情報の統合

## 参考リンク

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [@googlemaps/js-api-loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)
- [Next.js環境変数](https://nextjs.org/docs/basic-features/environment-variables)
- [高齢者向けWebデザインガイドライン](https://www.w3.org/WAI/older-users/)
