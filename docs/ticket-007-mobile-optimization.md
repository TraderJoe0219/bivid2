# チケット #007: モバイル最適化・PWA対応

**優先度**: 高  
**担当者**: 未定  
**予想工数**: 8-10日  
**依存関係**: #001-#006 (基本機能完成後)

## 📋 概要
高齢者のスマートフォン利用を考慮したモバイル最適化とPWA（Progressive Web App）対応。オフライン機能、プッシュ通知、ホーム画面追加など、ネイティブアプリに近い体験を提供。

## 🎯 受け入れ条件

### PWA機能
- [ ] Service Worker実装
- [ ] オフライン対応
- [ ] ホーム画面への追加
- [ ] アプリアイコン設定
- [ ] スプラッシュスクリーン
- [ ] インストール促進機能

### モバイルUI最適化
- [ ] タッチフレンドリーなデザイン
- [ ] 大きなボタン・リンク（最小44px）
- [ ] スワイプ操作対応
- [ ] 片手操作への配慮
- [ ] 縦画面・横画面対応

### パフォーマンス最適化
- [ ] 初回読み込み時間最適化
- [ ] 画像の遅延読み込み
- [ ] バンドルサイズ最適化
- [ ] キャッシュ戦略実装
- [ ] ネットワーク状況への対応

### 高齢者向け配慮
- [ ] 大きなフォントサイズ
- [ ] 高コントラスト表示
- [ ] 音声読み上げ対応
- [ ] 振動フィードバック
- [ ] 操作ガイダンス

## 📝 詳細仕様

### PWA設定
```json
// manifest.json
{
  "name": "Bivid - 高齢者向けスキルシェア",
  "short_name": "Bivid",
  "description": "高齢者同士でスキルを教え合うプラットフォーム",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker機能
- **キャッシング戦略**:
  - 静的ファイル: Cache First
  - API データ: Network First with Cache Fallback
  - 画像: Cache First with Network Fallback
- **オフライン対応**:
  - 閲覧履歴の保存
  - お気に入り一覧の表示
  - 基本的なプロフィール情報
  - オフライン時の適切なメッセージ表示

### モバイル固有機能
```typescript
interface MobileFeatures {
  // デバイス機能
  geolocation: boolean      // 位置情報取得
  camera: boolean          // カメラアクセス
  vibration: boolean       // 振動機能
  orientation: boolean     // 画面回転検知
  
  // 通知機能
  pushNotifications: boolean
  badgeAPI: boolean
  
  // タッチ操作
  touchGestures: boolean
  swipeNavigation: boolean
}
```

## 🛠 技術仕様

### 使用技術
- **PWA**: Next.js PWA plugin
- **Service Worker**: Workbox
- **プッシュ通知**: Firebase Cloud Messaging
- **タッチ操作**: React Touch Events
- **アイコン生成**: PWA Asset Generator

### パフォーマンス目標
- **First Contentful Paint**: < 1.5秒
- **Largest Contentful Paint**: < 2.5秒
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3秒

### オフライン機能仕様
```typescript
interface OfflineCapabilities {
  // 読み取り専用データ
  viewProfile: boolean           // プロフィール表示
  viewFavorites: boolean         // お気に入り一覧
  viewRecentlyViewed: boolean    // 閲覧履歴
  viewCachedSkills: boolean      // キャッシュされたスキル
  
  // 制限された機能
  queueBookingRequests: boolean  // 予約リクエストのキュー
  draftMessages: boolean         // メッセージ下書き
  offlineSearch: boolean         // キャッシュ内検索
}
```

## 🎨 モバイルUI設計

### ナビゲーション
- [ ] ボトムナビゲーション（主要機能）
- [ ] ハンバーガーメニュー（詳細機能）
- [ ] パンくずナビゲーション
- [ ] 「戻る」ボタンの明確な配置

### タッチ操作
- [ ] スワイプでカード表示切り替え
- [ ] 長押しメニュー
- [ ] プルリフレッシュ
- [ ] 無限スクロール
- [ ] ダブルタップでズーム

### フォーム最適化
- [ ] 大きな入力フィールド
- [ ] 適切なキーボードタイプ
- [ ] 入力補完・候補表示
- [ ] エラー状態の明確な表示
- [ ] 送信前の確認画面

## 📱 デバイス対応

### 画面サイズ対応
```css
/* モバイル (320px - 768px) */
@media (max-width: 767px) {
  .container {
    padding: 16px;
  }
  .text-base {
    font-size: 18px; /* 高齢者向け大きめ */
  }
}

/* タブレット (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 24px;
  }
}

/* デスクトップ (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### iOS/Android対応
- [ ] Safari対応（iOS）
- [ ] Chrome対応（Android）
- [ ] Samsung Internet対応
- [ ] デバイス固有の制約への対応

## 🔔 プッシュ通知

### 通知タイプ
```typescript
enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_REMINDER = 'booking_reminder',
  NEW_MESSAGE = 'new_message',
  REVIEW_REQUEST = 'review_request',
  SKILL_RECOMMENDATION = 'skill_recommendation',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

interface PushNotification {
  title: string
  body: string
  icon: string
  badge?: number
  tag?: string
  data?: {
    url: string
    action: string
  }
  requireInteraction?: boolean
}
```

### 通知設定
- [ ] 通知タイプ別ON/OFF設定
- [ ] 通知時間帯設定
- [ ] サウンド・振動設定
- [ ] 優先度設定

## 🧪 テスト項目

### PWAテスト
- [ ] Lighthouse PWAスコア90+
- [ ] Service Worker機能
- [ ] オフライン動作
- [ ] インストール機能

### モバイルテスト
- [ ] タッチ操作全般
- [ ] 各画面サイズでの表示
- [ ] 縦横画面切り替え
- [ ] キーボード表示時のレイアウト

### パフォーマンステスト
- [ ] ページ読み込み速度
- [ ] 画像最適化効果
- [ ] バンドルサイズ
- [ ] メモリ使用量

### デバイステスト
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 低スペック端末での動作
- [ ] 通信環境（3G/4G/WiFi）

## 📂 ファイル構成
```
src/
├── app/
│   ├── manifest.json
│   └── sw.js              # Service Worker
├── components/mobile/
│   ├── BottomNavigation.tsx
│   ├── MobileHeader.tsx
│   ├── SwipeableCard.tsx
│   └── TouchFriendlyButton.tsx
├── hooks/mobile/
│   ├── useDeviceType.ts
│   ├── usePWAInstall.ts
│   ├── useOfflineStatus.ts
│   └── usePushNotifications.ts
├── lib/mobile/
│   ├── serviceWorker.ts
│   ├── pushNotifications.ts
│   └── deviceDetection.ts
└── styles/
    ├── mobile.css
    └── responsive.css
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] PWA設定実装
- [ ] Service Worker実装
- [ ] モバイルUI改善
- [ ] タッチ操作実装
- [ ] プッシュ通知実装
- [ ] オフライン機能実装
- [ ] パフォーマンス最適化
- [ ] デバイステスト
- [ ] ストア審査対応（将来）

## 📊 分析・改善

### 利用状況分析
- [ ] デバイス種別の利用統計
- [ ] 画面サイズ別の利用状況
- [ ] PWA インストール率
- [ ] オフライン利用状況

### UX改善指標
- [ ] タッチ操作の成功率
- [ ] ページ離脱率（モバイル）
- [ ] 操作完了率
- [ ] エラー発生率

## 📝 備考
- 高齢者のスマートフォン習熟度にばらつきがあることを考慮
- PWAインストール方法の分かりやすいガイド作成が必要
- iOS SafariでのPWA制限事項への対応
- 通信環境が不安定な場所での利用を想定
- 将来的なネイティブアプリ化も視野に入れた設計
- アクセシビリティ機能との連携