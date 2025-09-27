// マイプロフィール機能関連の型定義
import { Timestamp } from 'firebase/firestore'

// 地理的位置情報（既存の GeoPoint を拡張）
export interface Location {
  prefecture?: string
  city?: string
  address?: string
  lat?: number
  lng?: number
}

// 拡張ユーザープロフィール（新機能用）
export interface ExtendedUserProfile {
  uid: string
  displayName: string
  bio?: string
  home: Location | null
  interests: string[]  // ["買い物同行","庭仕事","スマホサポート","おしゃべり"]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// プロフィール更新用フォームデータ
export interface ProfileFormData {
  displayName: string
  bio?: string
  prefecture?: string
  city?: string
  address?: string
  interests: string[]
}

// 興味タグの定義
export const INTEREST_TAGS = [
  '買い物同行',
  '庭仕事',
  'スマホサポート',
  'おしゃべり',
  '料理・お菓子作り',
  '散歩・ウォーキング',
  '健康・体操',
  '手芸・裁縫',
  '読書・勉強',
  '音楽・楽器',
  '映画・テレビ',
  '旅行・お出かけ',
  'ペット',
  '子育て支援',
  '掃除・整理',
  '修理・メンテナンス',
  'その他'
] as const

export type InterestTag = typeof INTEREST_TAGS[number]

// 地域の定数
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
] as const

export type Prefecture = typeof PREFECTURES[number]