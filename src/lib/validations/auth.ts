import { z } from 'zod'

// パスワード強度チェック関数
export const validatePasswordStrength = (password: string) => {
  const issues: string[] = []
  let score = 0

  // 長さチェック
  if (password.length >= 8) {
    score += 1
  } else {
    issues.push('8文字以上で入力してください')
  }

  // 大文字チェック
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    issues.push('大文字を含めてください')
  }

  // 小文字チェック
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    issues.push('小文字を含めてください')
  }

  // 数字チェック
  if (/\d/.test(password)) {
    score += 1
  } else {
    issues.push('数字を含めてください')
  }

  // 特殊文字チェック
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    issues.push('特殊文字を含めてください')
  }

  const strength = score < 2 ? 'weak' : score < 3 ? 'fair' : score < 4 ? 'good' : 'strong'
  const isValid = score >= 3 && password.length >= 8

  return {
    isValid,
    strength: strength as 'weak' | 'fair' | 'good' | 'strong',
    issues,
    score
  }
}

// 日本の電話番号バリデーション
const phoneNumberRegex = /^(0[5-9]\d{8}|0[1-4]\d{9})$/

// 郵便番号バリデーション
const postalCodeRegex = /^\d{3}-\d{4}$/

// メールアドレススキーマ
export const emailSchema = z
  .string()
  .email('正しいメールアドレスを入力してください')
  .max(100, 'メールアドレスは100文字以内で入力してください')

// パスワードスキーマ
export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(128, 'パスワードは128文字以内で入力してください')
  .refine((password) => {
    const validation = validatePasswordStrength(password)
    return validation.isValid
  }, {
    message: 'パスワードは大文字、小文字、数字を含む8文字以上で入力してください'
  })

// 電話番号スキーマ
export const phoneNumberSchema = z
  .string()
  .regex(phoneNumberRegex, '正しい電話番号を入力してください（例: 09012345678）')

// ユーザー登録スキーマ
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: z
    .string()
    .min(1, '表示名を入力してください')
    .max(50, '表示名は50文字以内で入力してください')
    .regex(/^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u002B\u002A\u0021\u003F\u005F\u002D\u0020]+$/, '表示名に使用できない文字が含まれています'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, '利用規約に同意してください')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
})

// ログインスキーマ
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
  rememberMe: z.boolean().optional()
})

// パスワードリセットスキーマ
export const passwordResetSchema = z.object({
  email: emailSchema
})

// 電話番号認証スキーマ
export const phoneVerificationSchema = z.object({
  phoneNumber: phoneNumberSchema,
  verificationCode: z
    .string()
    .length(6, '認証コードは6桁で入力してください')
    .regex(/^\d{6}$/, '認証コードは数字のみで入力してください')
    .optional()
})

// プロフィール設定スキーマ
export const profileSetupSchema = z.object({
  firstName: z
    .string()
    .min(1, '名前を入力してください')
    .max(20, '名前は20文字以内で入力してください')
    .regex(/^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/, '名前はひらがな、カタカナ、漢字で入力してください'),
  lastName: z
    .string()
    .min(1, '苗字を入力してください')
    .max(20, '苗字は20文字以内で入力してください')
    .regex(/^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/, '苗字はひらがな、カタカナ、漢字で入力してください'),
  dateOfBirth: z
    .string()
    .min(1, '生年月日を選択してください')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18 && age <= 120
    }, '18歳以上120歳以下で入力してください'),
  gender: z
    .enum(['male', 'female', 'other', ''], {
      errorMap: () => ({ message: '性別を選択してください' })
    }),
  prefecture: z
    .string()
    .min(1, '都道府県を選択してください'),
  city: z
    .string()
    .min(1, '市区町村を入力してください')
    .max(50, '市区町村は50文字以内で入力してください'),
  area: z
    .string()
    .max(100, '町名・番地は100文字以内で入力してください'),
  postalCode: z
    .string()
    .regex(postalCodeRegex, '郵便番号は「123-4567」の形式で入力してください'),
  bio: z
    .string()
    .max(500, '自己紹介は500文字以内で入力してください')
})

// 身分証明書アップロードスキーマ
export const documentUploadSchema = z.object({
  documentType: z
    .enum(['license', 'passport', 'residence_card', 'other'], {
      errorMap: () => ({ message: '書類の種類を選択してください' })
    }),
  documentFile: z
    .instanceof(File, { message: 'ファイルを選択してください' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'ファイルサイズは10MB以下にしてください')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
      'JPEG、PNG、PDFファイルのみアップロード可能です'
    )
})

// 緊急連絡先スキーマ
export const emergencyContactSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(50, '名前は50文字以内で入力してください'),
  relationship: z
    .string()
    .min(1, '続柄を選択してください'),
  phoneNumber: phoneNumberSchema,
  email: emailSchema.optional().or(z.literal('')),
  priority: z
    .number()
    .min(1, '優先順位を選択してください')
    .max(5, '優先順位は1-5で選択してください')
})

// プロフィール写真アップロードスキーマ
export const profilePhotoSchema = z.object({
  profilePhoto: z
    .instanceof(File, { message: 'ファイルを選択してください' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'ファイルサイズは5MB以下にしてください')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'JPEG、PNGファイルのみアップロード可能です'
    )
    .optional()
})

// 都道府県リスト
export const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

// 続柄リスト
export const relationships = [
  '配偶者', '子', '親', '兄弟姉妹', '祖父母', '孫',
  '親戚', '友人', '知人', 'その他'
]

// 身分証明書の種類
export const documentTypes = [
  { value: 'license', label: '運転免許証' },
  { value: 'passport', label: 'パスポート' },
  { value: 'residence_card', label: '在留カード' },
  { value: 'other', label: 'その他' }
]

// 型エクスポート
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>
export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>
export type ProfilePhotoFormData = z.infer<typeof profilePhotoSchema>