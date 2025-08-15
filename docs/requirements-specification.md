# Bivid 要件定義書
## 高齢者向け生きがい支援C2Cプラットフォーム

**作成日**: 2025年8月15日  
**バージョン**: 1.0  
**参考サイト**: [世田谷G-Ber](https://setagaya.gber.jp/event-view.php)

---

## 📋 目次
1. [プロジェクト概要](#1-プロジェクト概要)
2. [ターゲットユーザー](#2-ターゲットユーザー)
3. [サービス概要](#3-サービス概要)
4. [機能要件](#4-機能要件)
5. [ビジネスモデル](#5-ビジネスモデル)
6. [非機能要件](#6-非機能要件)
7. [技術要件](#7-技術要件)
8. [セキュリティ・安全要件](#8-セキュリティ安全要件)
9. [運用要件](#9-運用要件)
10. [今後の拡張予定](#10-今後の拡張予定)

---

## 1. プロジェクト概要

### 1.1 プロジェクト名
**Bivid（ビビッド）** - 高齢者向け生きがい支援C2Cプラットフォーム

### 1.2 目的・ビジョン
- **目的**: 60-70代の高齢者の生きがい創出と社会参画促進
- **ビジョン**: 豊富な人生経験を活かし、新しいつながりと学びの機会を提供
- **ミッション**: デジタルツールを通じて地域コミュニティの活性化を支援

### 1.3 プロジェクトの背景
- 高齢者の孤立問題と生きがい不足
- 市町村の高齢者施策への課題
- 介護・デイサービス事業者の人手不足
- デジタル活用による地域活性化の需要

---

## 2. ターゲットユーザー

### 2.1 主要ターゲット
- **年齢層**: 60代〜70代
- **デジタルリテラシー**: スマートフォン使用経験者
- **地域性**: 地域密着からスタート（将来的に全国展開）

### 2.2 ユーザーペルソナ

#### 2.2.1 アクティブシニア（教える側）
- **年齢**: 60-70代
- **特徴**: 豊富な人生経験、特技・スキルを持つ
- **動機**: 社会貢献、新しいつながり、収入補助
- **課題**: 活動機会の発見、若い世代との接点不足

#### 2.2.2 学習意欲のあるシニア（学ぶ側）
- **年齢**: 60-75代
- **特徴**: 新しいことに興味、健康で活動的
- **動機**: スキル習得、社交、充実した時間
- **課題**: 適切な学習機会の発見、同世代との交流

### 2.3 B2Bターゲット
- **市町村**: 高齢者施策担当部署
- **介護事業者**: デイサービス、有料老人ホーム
- **地域包括支援センター**
- **社会福祉協議会**

---

## 3. サービス概要

### 3.1 サービスカテゴリ

#### 3.1.1 スキルシェア
- 料理・お菓子作り
- 園芸・ガーデニング
- 手芸・裁縫
- 楽器演奏
- パソコン・スマホ
- 語学
- 書道・絵画
- 健康・体操

#### 3.1.2 社会活動
- **仕事・軽作業**: 短期雇用、パート業務
- **ボランティア活動**: 地域貢献、社会奉仕
- **趣味・サークル活動**: 同好会、クラブ活動
- **地域イベント参加**: お祭り、文化イベント
- **講演会・セミナー**: 教育、啓発活動
- **集会**: 住民説明会、相談会

### 3.2 主要機能
- **地図ベース検索**: 近隣の活動・スキル検索
- **カテゴリ別検索**: 興味分野での絞り込み
- **プロフィール管理**: 個人情報、スキル、評価
- **予約・決済システム**: 活動申込み、料金決済
- **コミュニケーション機能**: メッセージ、評価・レビュー
- **安全・サポート機能**: 身元確認、保険、相談窓口

---

## 4. 機能要件

### 4.1 ユーザー管理機能

#### 4.1.1 会員登録・認証
- **基本情報登録**
  - 氏名、生年月日、性別
  - 住所（都道府県、市区町村、最寄り駅）
  - 電話番号、メールアドレス
- **身元確認**
  - 電話番号認証（SMS認証）
  - 身分証明書アップロード（運転免許証、保険証等）
  - 顔写真登録
- **緊急連絡先登録**
  - 家族・知人の連絡先（必須）
  - 関係性、優先順位

#### 4.1.2 プロフィール管理
- **基本プロフィール**
  - 自己紹介文、趣味・特技
  - 教えられるスキル、学びたいスキル
  - 活動可能時間、移動可能範囲
- **活動設定**
  - オンライン対応可否
  - 希望料金設定（教える場合）
  - プライバシー設定

### 4.2 検索・発見機能

#### 4.2.1 地図ベース検索
- **Google Maps統合**
  - 現在地周辺の活動表示
  - カテゴリ別色分けマーカー
  - クラスター表示（複数活動の集約）
- **フィルタリング**
  - カテゴリ、距離、価格帯
  - 開催日時、難易度レベル
  - オンライン/オフライン

#### 4.2.2 一覧・詳細表示
- **活動一覧**
  - カード形式での表示
  - 写真、タイトル、料金、評価
  - お気に入り機能
- **詳細ページ**
  - 活動内容、講師情報
  - スケジュール、場所、料金
  - 参加者レビュー、Q&A

### 4.3 予約・決済機能

#### 4.3.1 予約システム
- **予約申込み**
  - カレンダー表示での日時選択
  - 参加人数、特記事項入力
  - 確認・承認フロー
- **予約管理**
  - 予約一覧（参加者・主催者）
  - ステータス管理（申込み→確定→完了）
  - キャンセル・変更機能

#### 4.3.2 決済システム
- **支払い方法**
  - クレジットカード（Stripe統合）
  - 銀行振込（手動確認）
  - 現地決済（現金）
- **料金管理**
  - 手数料計算、税金処理
  - 返金・キャンセル料処理
  - 売上管理（主催者向け）

### 4.4 コミュニケーション機能

#### 4.4.1 メッセージ機能
- **チャット機能**
  - 1対1メッセージ
  - テキスト、画像送信
  - 既読・未読管理
- **通知機能**
  - アプリ内通知、メール通知
  - 予約確認、リマインダー
  - 重要な連絡事項

#### 4.4.2 外部連携
- **電話連絡**
  - 電話番号交換の許可制
  - 緊急時連絡フロー
- **ビデオ通話**
  - 外部サービス（Zoom等）への誘導
  - オンライン活動のサポート

### 4.5 評価・レビュー機能

#### 4.5.1 評価システム（提案）
- **総合評価**: 5段階評価
- **詳細評価項目**:
  - **教える側**:
    - 教え方の分かりやすさ
    - コミュニケーション
    - 時間の正確性
    - 準備の充実度
    - 安全への配慮
  - **学ぶ側**:
    - 学習意欲・態度
    - 時間の正確性
    - コミュニケーション
    - マナー・礼儀

#### 4.5.2 レビュー機能
- **コメント投稿**
  - 自由記述形式
  - 写真添付可能
  - 匿名・実名選択
- **レビュー管理**
  - 不適切コメントの報告・削除
  - 運営による内容確認
  - 返信機能

### 4.6 安全・サポート機能

#### 4.6.1 安全管理
- **身元確認システム**
  - 多段階認証
  - 定期的な情報更新確認
  - 怪しい活動の検知・報告
- **保険システム**
  - 基本的な活動保険（会社負担）
  - 個人向け追加保険商品の紹介
  - 事故時の対応フロー

#### 4.6.2 サポート体制
- **相談窓口**
  - 市町村窓口（B2B契約時）
  - 自社サポートセンター
  - FAQ、ヘルプページ
- **トラブル対応**
  - 報告・相談フォーム
  - 調停・仲裁機能
  - 利用停止・退会処理

---

## 5. ビジネスモデル

### 5.1 収益構造

#### 5.1.1 B2B売上（主要収益）
- **市町村向け**
  - 買い切りライセンス: 60万円
  - 保守・サポート: 年額12万円
  - カスタマイズ費用: 別途見積
- **介護事業者向け**
  - 月額サブスクリプション: 15,000円
  - 初期導入費用: 10万円
  - 研修・サポート: 別途

#### 5.1.2 C2C収益（将来的）
- **プレミアム機能**
  - 月額500円: 優先表示、詳細分析
  - 年額5,000円: 割引プラン
- **広告収入**
  - 介護事業者広告: 月額3-10万円
  - 地域企業広告: 月額1-5万円

### 5.2 無料提供範囲
- **基本機能**: 全て無料
- **活動参加・主催**: 無料
- **基本サポート**: 無料
- **基本的な安全保障**: 無料

### 5.3 価格戦略
- **フリーミアムモデル**: C2Cユーザーは基本無料
- **B2Bフォーカス**: 安定収益確保
- **段階的機能追加**: ユーザー増加に応じた機能拡張

---

## 6. 非機能要件

### 6.1 パフォーマンス要件
- **レスポンス時間**: 3秒以内
- **同時接続数**: 1,000ユーザー
- **可用性**: 99.5%以上
- **データベース**: 100,000件のスキル・活動情報

### 6.2 ユーザビリティ要件
- **高齢者向けUI/UX**
  - 大きなフォント（最小18px）
  - 高コントラスト色設計
  - タッチフレンドリー（最小44px）
  - シンプルなナビゲーション
- **アクセシビリティ**
  - WCAG 2.1 AA準拠
  - 音声読み上げ対応
  - 拡大表示対応

### 6.3 対応デバイス・ブラウザ
- **スマートフォン**: iOS 14+, Android 10+
- **タブレット**: iPad, Android タブレット
- **PC**: Chrome, Safari, Edge（最新2バージョン）

### 6.4 多言語対応
- **第1段階**: 日本語のみ
- **将来対応**: 英語、中国語、韓国語

---

## 7. 技術要件

### 7.1 システム構成
- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes + Firebase Functions
- **データベース**: Firebase Firestore
- **認証**: Firebase Auth
- **ストレージ**: Firebase Storage
- **決済**: Stripe
- **地図**: Google Maps API
- **インフラ**: Vercel (フロント), Firebase (バック)

### 7.2 外部API連携
- **Google Maps API**: 地図機能、ジオコーディング
- **Stripe API**: 決済処理
- **SendGrid**: メール送信
- **Firebase Cloud Messaging**: プッシュ通知
- **Twilio**: SMS認証

### 7.3 データ管理
- **データ暗号化**: 個人情報の暗号化保存
- **バックアップ**: 日次自動バックアップ
- **ログ管理**: アクセスログ、エラーログ
- **監視**: リアルタイム監視、アラート

---

## 8. セキュリティ・安全要件

### 8.1 データセキュリティ
- **個人情報保護**: GDPR, 個人情報保護法準拠
- **データ暗号化**: AES-256暗号化
- **アクセス制御**: 多要素認証、権限管理
- **API セキュリティ**: レート制限、CORS設定

### 8.2 ユーザー安全対策
- **身元確認**: 電話番号 + 身分証明書
- **活動安全**: 基本保険加入、緊急連絡先
- **不正防止**: 怪しい活動の検知、報告機能
- **プライバシー**: 個人情報の段階的開示

### 8.3 コンテンツ管理
- **コンテンツモデレーション**: 自動検知 + 人的確認
- **報告システム**: 不適切コンテンツの報告・対応
- **利用規約**: 明確なガイドライン策定

---

## 9. 運用要件

### 9.1 サポート体制

#### 9.1.1 ユーザーサポート
- **営業時間**: 平日9:00-17:00
- **対応手段**: 電話、メール、チャット
- **FAQ**: よくある質問の整備
- **操作マニュアル**: 高齢者向け分かりやすい説明

#### 9.1.2 技術サポート
- **システム監視**: 24時間監視
- **障害対応**: 1時間以内の初期対応
- **メンテナンス**: 月1回の定期メンテナンス

### 9.2 コンテンツ管理
- **活動承認**: 新規活動の事前審査
- **ユーザー管理**: 不適切ユーザーの対応
- **品質管理**: 定期的なコンテンツ監査

### 9.3 レポート・分析
- **利用統計**: ユーザー数、活動数、取引額
- **B2B レポート**: 自治体・事業者向けレポート
- **改善提案**: データに基づく機能改善

---

## 10. 今後の拡張予定

### 10.1 短期計画（6ヶ月以内）
- **MVP リリース**: 基本機能の実装・公開
- **パイロット導入**: 特定地域での試験運用
- **ユーザーフィードバック**: 改善点の洗い出し
- **B2B営業**: 市町村・介護事業者への営業開始

### 10.2 中期計画（1年以内）
- **機能拡張**: プレミアム機能、高度な検索
- **地域拡大**: 複数地域での展開
- **パートナー連携**: 地域企業との連携
- **保険商品**: 専用保険商品の開発

### 10.3 長期計画（2-3年）
- **全国展開**: 全都道府県での利用可能
- **多言語対応**: 在日外国人シニア向け
- **AI機能**: マッチング最適化、チャットボット
- **ヘルスケア連携**: 健康管理機能の追加

---

## 11. Next.js 開発ベストプラクティス

### 11.1 プロジェクト構造とアーキテクチャ

#### 11.1.1 App Router の活用
```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Route Groups - 認証関連
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Route Groups - ダッシュボード
│   │   ├── profile/
│   │   └── bookings/
│   ├── api/               # API Routes
│   │   ├── auth/
│   │   ├── skills/
│   │   └── bookings/
│   ├── globals.css
│   ├── layout.tsx         # Root Layout
│   ├── loading.tsx        # Global Loading UI
│   ├── error.tsx          # Global Error UI
│   └── not-found.tsx      # 404 Page
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── forms/            # フォームコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   └── providers/        # Context Providers
├── lib/                  # ユーティリティ・設定
├── hooks/               # カスタムフック
├── store/               # 状態管理
└── types/               # TypeScript型定義
```

#### 11.1.2 コンポーネント設計原則
```typescript
// ✅ 良い例: Server Component (デフォルト)
export default async function SkillList() {
  const skills = await getSkills()
  return (
    <div>
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}

// ✅ 良い例: Client Component (必要な場合のみ)
'use client'
export default function InteractiveMap() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  // インタラクティブな機能のみクライアント側で実行
}
```

### 11.2 パフォーマンス最適化

#### 11.2.1 画像最適化
```typescript
import Image from 'next/image'

// ✅ Next.js Image コンポーネントの活用
<Image
  src="/skill-image.jpg"
  alt="スキル画像"
  width={400}
  height={300}
  priority={isAboveTheFold} // LCP改善
  placeholder="blur"
  blurDataURL="data:image/..." // プレースホルダー
/>
```

#### 11.2.2 フォント最適化
```typescript
// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap', // FOUT対策
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

#### 11.2.3 データフェッチング戦略
```typescript
// ✅ Server Components での並列データ取得
async function SkillPage({ params }: { params: { id: string } }) {
  // 並列実行でパフォーマンス向上
  const [skill, reviews, relatedSkills] = await Promise.all([
    getSkill(params.id),
    getSkillReviews(params.id),
    getRelatedSkills(params.id),
  ])

  return (
    <div>
      <SkillDetail skill={skill} />
      <ReviewList reviews={reviews} />
      <RelatedSkills skills={relatedSkills} />
    </div>
  )
}

// ✅ Suspense を活用した段階的読み込み
<Suspense fallback={<SkillDetailSkeleton />}>
  <SkillDetail skillId={params.id} />
</Suspense>
```

### 11.3 SEO・アクセシビリティ

#### 11.3.1 メタデータ生成
```typescript
// app/skills/[id]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const skill = await getSkill(params.id)
  
  return {
    title: `${skill.title} | Bivid`,
    description: skill.shortDescription,
    openGraph: {
      title: skill.title,
      description: skill.shortDescription,
      images: skill.images,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
```

#### 11.3.2 構造化データ
```typescript
export default function SkillPage({ skill }: { skill: Skill }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: skill.title,
    description: skill.description,
    provider: {
      '@type': 'Person',
      name: skill.teacherName,
    },
    offers: {
      '@type': 'Offer',
      price: skill.price.amount,
      priceCurrency: 'JPY',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkillDetail skill={skill} />
    </>
  )
}
```

### 11.4 状態管理とデータ管理

#### 11.4.1 Zustand の効果的な使用
```typescript
// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      login: (user) => set({ user, isLoading: false }),
      logout: () => set({ user: null }),
      updateProfile: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // 永続化する部分のみ
    }
  )
)
```

#### 11.4.2 React Query / TanStack Query の活用
```typescript
// hooks/useSkills.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useSkills(filters: SearchFilters) {
  return useQuery({
    queryKey: ['skills', filters],
    queryFn: () => getSkills(filters),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000,   // 10分間メモリ保持
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      // 関連するクエリを無効化
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}
```

### 11.5 型安全性とコード品質

#### 11.5.1 厳密な TypeScript 設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true
  }
}
```

#### 11.5.2 Zod による型バリデーション
```typescript
// lib/validations/skill.ts
import { z } from 'zod'

export const skillFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  description: z.string().min(10, '説明は10文字以上入力してください'),
  category: z.enum(['cooking', 'gardening', 'handicraft']),
  price: z.object({
    amount: z.number().min(0),
    currency: z.literal('JPY'),
    unit: z.enum(['per_lesson', 'per_hour'])
  }),
  duration: z.number().min(30).max(480),
})

export type SkillFormData = z.infer<typeof skillFormSchema>
```

### 11.6 エラーハンドリングと監視

#### 11.6.1 エラーバウンダリ
```typescript
// app/error.tsx
'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーログ送信
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
        <button onClick={reset} className="btn-primary">
          再試行
        </button>
      </div>
    </div>
  )
}
```

#### 11.6.2 ローディング状態の統一管理
```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
    </div>
  )
}

// components/ui/LoadingSkeleton.tsx
export function SkillCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}
```

### 11.7 セキュリティベストプラクティス

#### 11.7.1 API Route の保護
```typescript
// app/api/skills/route.ts
import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 認証確認
    const user = await verifyAuth(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 入力値検証
    const body = await request.json()
    const validatedData = skillFormSchema.parse(body)

    // ビジネスロジック実行
    const skill = await createSkill(user.id, validatedData)
    
    return Response.json({ skill })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 11.7.2 CSRF対策とサニタイゼーション
```typescript
// lib/security.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  })
}

// CSP ヘッダー設定
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
]
```

### 11.8 テスト戦略

#### 11.8.1 単体テスト（Jest + Testing Library）
```typescript
// __tests__/components/SkillCard.test.tsx
import { render, screen } from '@testing-library/react'
import { SkillCard } from '@/components/SkillCard'

const mockSkill = {
  id: '1',
  title: 'テストスキル',
  price: { amount: 1000, currency: 'JPY', unit: 'per_lesson' }
}

describe('SkillCard', () => {
  it('スキル情報が正しく表示される', () => {
    render(<SkillCard skill={mockSkill} />)
    
    expect(screen.getByText('テストスキル')).toBeInTheDocument()
    expect(screen.getByText('¥1,000')).toBeInTheDocument()
  })
})
```

#### 11.8.2 E2Eテスト（Playwright）
```typescript
// e2e/skill-booking.spec.ts
import { test, expect } from '@playwright/test'

test('スキル予約フロー', async ({ page }) => {
  await page.goto('/skills/1')
  
  // スキル詳細の確認
  await expect(page.locator('h1')).toContainText('料理教室')
  
  // 予約ボタンをクリック
  await page.click('button:has-text("予約する")')
  
  // 予約フォームの入力
  await page.fill('input[name="date"]', '2024-12-01')
  await page.click('button:has-text("予約確定")')
  
  // 成功メッセージの確認
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### 11.9 パフォーマンス監視

#### 11.9.1 Core Web Vitals の監視
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

#### 11.9.2 Bundle Analyzer の活用
```bash
# package.json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build"
  }
}

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
```

---

## 📊 付録

### A. 評価システム詳細（提案）

#### A.1 評価項目定義
```
総合評価: ★★★★★ (5段階)

【教える側の評価項目】
1. 教え方 (1-5): 分かりやすさ、丁寧さ
2. コミュニケーション (1-5): 話しやすさ、聞き上手
3. 時間管理 (1-5): 時間通りの開始・終了
4. 準備 (1-5): 教材・道具の準備状況
5. 安全配慮 (1-5): 安全への気遣い

【学ぶ側の評価項目】
1. 学習態度 (1-5): 意欲的、積極的
2. 時間管理 (1-5): 時間通りの参加
3. コミュニケーション (1-5): 話しやすさ、質問力
4. マナー (1-5): 礼儀、協調性
```

#### A.2 レビューガイドライン（提案）
```
【投稿できるレビュー】
✅ 活動内容に関する具体的な感想
✅ 講師・参加者の良かった点
✅ 改善提案（建設的なもの）
✅ 他の人への推薦理由

【投稿禁止内容】
❌ 個人情報の暴露
❌ 誹謗中傷、人格攻撃
❌ 政治・宗教・商業的宣伝
❌ 虚偽の情報
❌ 関係のない内容
```

### B. 利用規約・ガイドライン骨子

#### B.1 利用規約重要項目
- 年齢制限（60歳以上推奨）
- 身元確認の義務
- 活動時の安全責任
- 金銭トラブルの対応
- プライバシーの保護
- 禁止行為の明確化

#### B.2 安全ガイドライン
- 初回面談時の公共場所推奨
- 高額商品・金銭の貸借禁止
- 活動中の事故・体調不良時の対応
- 緊急連絡先の活用方法
- 詐欺・悪質商法への注意喚起

---

## 📋 Todo管理方法

このプロジェクトでは、各機能のチケットファイル内でTodoを管理します。

### Todo記法
- **未完了**: `- [ ] タスク内容`
- **完了**: `- [x] タスク内容`

### 進捗管理
1. 作業開始時に該当チケットの該当項目を確認
2. 作業完了時に `[ ]` を `[x]` に変更
3. 定期的に進捗状況セクションを更新

### チケット一覧
- [#001: ユーザー認証・登録機能](./ticket-001-user-authentication.md)
- [#002: スキル検索・発見機能](./ticket-002-skill-search-discovery.md)
- [#003: 予約・決済機能](./ticket-003-booking-payment.md)
- [#004: コミュニケーション・メッセージング機能](./ticket-004-communication-messaging.md)
- [#005: 評価・レビューシステム](./ticket-005-review-rating.md)
- [#006: 管理者・運営機能](./ticket-006-admin-management.md)
- [#007: モバイル最適化・PWA対応](./ticket-007-mobile-optimization.md)
- [#008: セキュリティ・安全対策](./ticket-008-security-safety.md)
- [#009: B2B統合・カスタマイズ機能](./ticket-009-b2b-integration.md)
- [#010: 分析・最適化機能](./ticket-010-analytics-optimization.md)

### 優先順位
1. **最高優先度**: #008 (セキュリティ)
2. **高優先度**: #001 (認証), #002 (検索), #003 (予約), #007 (モバイル)
3. **中優先度**: #004 (メッセージ), #005 (評価), #006 (管理), #009 (B2B)
4. **低優先度**: #010 (分析)

---

**文書管理**
- 作成者: システム開発チーム
- 承認者: プロダクトオーナー
- 更新履歴: 
  - v1.0 (2025/08/15) - 初版作成
  - v1.1 (2025/08/15) - Todo管理方法追加、機能別チケット作成
- 次回レビュー予定: 2025/09/15