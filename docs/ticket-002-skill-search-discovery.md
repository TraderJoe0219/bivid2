# チケット #002: スキル検索・発見機能

**優先度**: 高  
**担当者**: 未定  
**予想工数**: 10-12日  
**依存関係**: #001 (ユーザー認証)

## 📋 概要
地図ベースの検索機能と一覧表示による、スキル・社会活動の発見機能を実装する。高齢者にとって使いやすい直感的な検索体験を提供。

## 🎯 受け入れ条件

### 地図ベース検索
- [ ] Google Maps統合
- [ ] 現在地周辺の活動表示
- [ ] カテゴリ別色分けマーカー
- [ ] マーカークラスター機能
- [ ] 地図上での活動詳細ポップアップ

### フィルタリング機能
- [ ] カテゴリフィルター（スキル・社会活動）
- [ ] 距離フィルター（1km, 3km, 5km, 10km）
- [ ] 価格帯フィルター
- [ ] 開催日時フィルター
- [ ] 難易度レベルフィルター
- [ ] オンライン/オフラインフィルター

### 一覧表示機能
- [ ] カード形式での活動一覧
- [ ] 並び替え機能（距離、評価、価格、新着順）
- [ ] 無限スクロール
- [ ] お気に入り機能
- [ ] 共有機能

### 詳細表示機能
- [ ] 活動詳細ページ
- [ ] 講師プロフィール表示
- [ ] 参加者レビュー表示
- [ ] 関連活動の推薦
- [ ] Q&A機能

## 📝 詳細仕様

### 検索機能仕様
- **地図範囲**: 現在地から半径20km以内
- **表示件数**: 最大100件（パフォーマンス考慮）
- **更新頻度**: リアルタイム更新
- **キャッシュ**: 5分間のクライアントサイドキャッシュ

### カテゴリ構成
```typescript
enum SkillCategory {
  COOKING = 'cooking',           // 料理・お菓子作り
  GARDENING = 'gardening',       // 園芸・ガーデニング
  HANDICRAFT = 'handicraft',     // 手芸・裁縫
  MUSIC = 'music',               // 楽器演奏
  TECHNOLOGY = 'technology',     // パソコン・スマホ
  LANGUAGE = 'language',         // 語学
  ART = 'art',                   // 書道・絵画
  HEALTH = 'health'              // 健康・体操
}

enum SocialActivityCategory {
  WORK = 'work',                 // 仕事・軽作業
  VOLUNTEER = 'volunteer',       // ボランティア
  HOBBY = 'hobby',               // 趣味・サークル
  EVENT = 'event',               // 地域イベント
  SEMINAR = 'seminar',           // 講演会・セミナー
  MEETING = 'meeting'            // 集会
}
```

## 🛠 技術仕様

### 使用技術
- **地図**: Google Maps JavaScript API
- **検索**: Firestore の geo-queries
- **状態管理**: Zustand + React Query
- **UI**: Tailwind CSS + Headless UI

### API エンドポイント
- `GET /api/skills/search` - スキル検索
- `GET /api/skills/nearby` - 近隣スキル取得
- `GET /api/skills/[id]` - スキル詳細取得
- `POST /api/skills/favorite` - お気に入り追加/削除
- `GET /api/activities/search` - 社会活動検索

### 検索パラメータ
```typescript
interface SearchParams {
  category?: string[]
  location?: {
    lat: number
    lng: number
    radius: number // km
  }
  priceRange?: {
    min: number
    max: number
  }
  dateRange?: {
    start: Date
    end: Date
  }
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isOnline?: boolean
  sortBy?: 'distance' | 'rating' | 'price' | 'created_at'
  page?: number
  limit?: number
}
```

## 🎨 UI/UX要件

### レスポンシブデザイン
- [ ] デスクトップ表示（1200px以上）
- [ ] タブレット表示（768px-1199px）
- [ ] モバイル表示（767px以下）

### アクセシビリティ
- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応
- [ ] 高コントラストモード対応
- [ ] フォントサイズ拡大対応

### 高齢者向け配慮
- [ ] 大きなタッチターゲット（最小44px）
- [ ] 明確な視覚的フィードバック
- [ ] シンプルなナビゲーション
- [ ] エラー時の分かりやすい案内

## 🧪 テスト項目

### 単体テスト
- [ ] 検索フィルター機能
- [ ] 地図マーカー表示
- [ ] ソート機能

### 統合テスト
- [ ] Google Maps API連携
- [ ] Firestore geo-query
- [ ] 無限スクロール

### E2Eテスト
- [ ] 地図検索フロー
- [ ] フィルター操作
- [ ] 詳細ページ遷移
- [ ] お気に入り機能

## 📂 ファイル構成
```
src/
├── app/
│   ├── skills/
│   │   ├── search/page.tsx
│   │   └── [id]/page.tsx
│   ├── map/page.tsx
│   └── api/skills/
├── components/
│   ├── maps/
│   │   ├── GoogleMap.tsx
│   │   ├── SkillMarkers.tsx
│   │   └── MapFilters.tsx
│   ├── skills/
│   │   ├── SkillCard.tsx
│   │   ├── SkillList.tsx
│   │   └── SkillDetail.tsx
│   └── search/
│       ├── SearchBar.tsx
│       └── FilterPanel.tsx
├── hooks/
│   ├── useSkillSearch.ts
│   └── useMapFilters.ts
└── lib/
    └── maps.ts
```

## 🔄 進捗状況
- [ ] 要件分析完了
- [ ] Google Maps API設定
- [ ] 地図コンポーネント実装
- [ ] 検索機能実装
- [ ] フィルター機能実装
- [ ] 一覧表示実装
- [ ] 詳細ページ実装
- [ ] レスポンシブ対応
- [ ] テスト実装
- [ ] パフォーマンス最適化

## 📝 備考
- Google Maps APIの使用料金に注意（月額制限設定）
- 地図の初期表示位置は現在地取得が前提
- 位置情報取得できない場合のフォールバック実装必要
- 検索結果0件時の代替案表示（おすすめ活動等）