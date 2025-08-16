// 認証関連の型定義
import { User as FirebaseUser } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

// ユーザープロフィール
export interface UserProfile {
  id: string
  email: string
  displayName: string
  phoneNumber?: string
  isPhoneVerified: boolean
  isDocumentVerified: boolean
  profilePhotoURL?: string
  documentURL?: string
  photoURL?: string
  
  // 基本情報
  profile: {
    firstName: string
    lastName: string
    dateOfBirth: Date | null
    gender: 'male' | 'female' | 'other' | ''
    address: {
      prefecture: string
      city: string
      area: string
      postalCode: string
    }
    bio: string
  }
  
  // スキル・興味
  teachingSkills: string[]
  learningInterests: string[]
  
  // 活動範囲・時間
  preferences: {
    isOnlineAvailable: boolean
    maxTravelDistance: number // km
    preferredTimeSlots: string[]
    notifications: {
      email: boolean
      push: boolean
    }
  }
  
  // 評価・レビュー
  rating: {
    average: number
    count: number
    asTeacher: number
    asStudent: number
  }
  
  // 緊急連絡先
  emergencyContacts: EmergencyContact[]
  
  // システム情報
  isActive: boolean
  lastLoginAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 緊急連絡先
export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  priority: number // 1が最優先
  isVerified: boolean
  createdAt: Timestamp
}

// 認証状態
export interface AuthState {
  user: FirebaseUser | null
  userProfile: UserProfile | null
  isLoading: boolean
  isInitialized: boolean
}

// 認証エラー
export interface AuthError {
  code: string
  message: string
}

// 登録フォームデータ
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
  agreeToTerms: boolean
}

// ログインフォームデータ
export interface SignInFormData {
  email: string
  password: string
  rememberMe?: boolean
}

// パスワードリセットフォームデータ
export interface PasswordResetFormData {
  email: string
}

// 電話番号認証フォームデータ
export interface PhoneVerificationFormData {
  phoneNumber: string
  verificationCode?: string
}

// プロフィール設定フォームデータ
export interface ProfileSetupFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | ''
  prefecture: string
  city: string
  area: string
  postalCode: string
  bio: string
  profilePhoto?: File
}

// 身分証明書アップロードフォームデータ
export interface DocumentUploadFormData {
  documentType: 'license' | 'passport' | 'residence_card' | 'other'
  documentFile: File
}

// 緊急連絡先フォームデータ
export interface EmergencyContactFormData {
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  priority: number
}

// 認証フロー状態
export type AuthFlowStep = 
  | 'email_signup'
  | 'profile_setup'
  | 'phone_verification'
  | 'document_upload'
  | 'emergency_contacts'
  | 'completed'

export interface AuthFlowState {
  currentStep: AuthFlowStep
  completedSteps: AuthFlowStep[]
  userData: Partial<UserProfile>
}

// Firebaseユーザー拡張型
export interface ExtendedUser extends FirebaseUser {
  profile?: UserProfile
}

// 認証アクション結果
export interface AuthResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

// 認証プロバイダー
export type AuthProvider = 'email' | 'google' | 'phone'

// セキュリティ設定
export interface SecuritySettings {
  twoFactorEnabled: boolean
  backupCodes: string[]
  trustedDevices: TrustedDevice[]
  loginNotifications: boolean
}

export interface TrustedDevice {
  id: string
  name: string
  lastUsed: Date
  addedAt: Date
  isActive: boolean
}

// パスワード強度
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordValidation {
  isValid: boolean
  strength: PasswordStrength
  issues: string[]
  score: number
}