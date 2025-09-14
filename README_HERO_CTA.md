# HeroCTA コンポーネント

## 概要
トップページのヒーロー領域で使用するCTAボタンコンポーネント。デフォルトCTAとセグメント別CTAの出し分け、モバイル/デスクトップでの表示制御、アナリティクス追跡機能を提供します。

## 機能

### CTAの種類
- **デフォルト**: 「登録してみる」「Bividとは？」
- **セグメント**: 「支援者として登録」「手助けを依頼する」

### レスポンシブ対応
- **デスクトップ**: 2ボタン横並び
- **モバイル**: プライマリボタン + セカンダリはテキストリンク

### アナリティクス
- 全クリックでdataLayer.pushイベント発火
- CTAタイプ、場所、対象者等を自動追跡

## 使用方法

### 基本的な使用
```tsx
import { HeroCTAs } from '@/components/HeroCTAs';

// デフォルトCTA
<HeroCTAs />

// セグメントCTA
<HeroCTAs segmented={true} />

// カスタム設定
<HeroCTAs
  audience="helper"
  location="custom-section"
  className="justify-center"
/>
```

### 環境変数でのA/Bテスト
```tsx
<HeroCTAs
  segmented={process.env.NEXT_PUBLIC_EXPERIMENT_HERO_CTA_V1 === "segmented"}
/>
```

## Props

```typescript
interface HeroCTAsProps {
  audience?: 'general' | 'helper' | 'seeker';  // 対象者 (default: 'general')
  segmented?: boolean;                          // セグメント表示 (default: false)
  location?: string;                           // アナリティクス用場所 (default: 'hero')
  className?: string;                          // 追加CSSクラス
}
```

## ファイル構成

```
src/
├── components/
│   └── HeroCTAs.tsx          # メインコンポーネント
├── lib/
│   ├── analytics.ts          # アナリティクス追跡
│   └── constants.ts          # ルート定数・文言
└── __tests__/
    ├── components/
    │   └── HeroCTAs.test.tsx # コンポーネントテスト
    └── lib/
        └── analytics.test.ts  # アナリティクステスト
```

## アクセシビリティ

- 適切なaria-label設定
- キーボードナビゲーション対応
- フォーカスリング表示
- カラーコントラストAA準拠

## 開発・テスト

### テスト実行
```bash
npm test HeroCTAs
npm test analytics
```

### 型チェック
```bash
npm run type-check
```

### Storybook（オプション）
```bash
npm run storybook
```

## 設計思想

1. **型安全性**: TypeScriptで厳密な型定義
2. **堅牢性**: dataLayer未定義時もエラー回避
3. **拡張性**: 将来のi18n対応を考慮した構造
4. **テスタビリティ**: モックしやすい設計
5. **パフォーマンス**: 不要な再レンダリング回避

## トラブルシューティング

### dataLayerが動作しない
- ブラウザのコンソールでdataLayer存在確認
- アナリティクススクリプトの読み込み順序確認

### ボタンが正しく表示されない
- Tailwind CSSの設定確認
- ブラウザのレスポンシブモード切り替え確認

### テストが失敗する
- Next.js Linkコンポーネントのモック確認
- Jest設定でTailwind CSSクラス処理確認