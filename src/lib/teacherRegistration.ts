import { db, storage } from '@/lib/firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export interface TeacherRegistrationData {
  // Step 1: スキル登録
  title: string
  description: string
  category: string

  // Step 2: プロフィール入力
  name: string
  photo?: File
  experienceYears: string
  coverageArea: string

  // Step 3: 初回枠登録
  sessionDate: string
  sessionTime: string
  sessionLocation: string
}

export interface TeacherProfile {
  // 基本情報
  name: string
  photoUrl?: string
  experienceYears: string
  coverageArea: string

  // メタデータ
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  status: 'pending' | 'approved' | 'rejected'
}

export interface SkillListing {
  // スキル情報
  title: string
  description: string
  category: string

  // 講師情報
  teacherId: string
  teacherName: string
  teacherPhotoUrl?: string

  // 初回セッション情報
  initialSession: {
    date: string
    time: string
    location: string
  }

  // メタデータ
  createdAt: Timestamp
  updatedAt: Timestamp
  status: 'active' | 'inactive' | 'pending'
  views: number
  bookings: number
}

export class TeacherRegistrationService {
  /**
   * プロフィール写真をアップロード
   */
  static async uploadProfilePhoto(file: File, userId: string): Promise<string> {
    const fileName = `profile-photos/${userId}/${Date.now()}-${file.name}`
    const storageRef = ref(storage, fileName)

    try {
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('プロフィール写真のアップロードに失敗しました:', error)
      throw new Error('プロフィール写真のアップロードに失敗しました')
    }
  }

  /**
   * 講師プロフィールを保存
   */
  static async saveTeacherProfile(
    userId: string,
    data: TeacherRegistrationData,
    photoUrl?: string
  ): Promise<void> {
    const teacherProfile: TeacherProfile = {
      name: data.name,
      photoUrl,
      experienceYears: data.experienceYears,
      coverageArea: data.coverageArea,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending'
    }

    try {
      await setDoc(doc(db, 'teachers', userId), teacherProfile)
    } catch (error) {
      console.error('講師プロフィールの保存に失敗しました:', error)
      throw new Error('講師プロフィールの保存に失敗しました')
    }
  }

  /**
   * スキル情報を保存
   */
  static async saveSkillListing(
    userId: string,
    data: TeacherRegistrationData,
    photoUrl?: string
  ): Promise<string> {
    const skillId = doc(collection(db, 'skills')).id

    const skillListing: SkillListing = {
      title: data.title,
      description: data.description,
      category: data.category,
      teacherId: userId,
      teacherName: data.name,
      teacherPhotoUrl: photoUrl,
      initialSession: {
        date: data.sessionDate,
        time: data.sessionTime,
        location: data.sessionLocation
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending',
      views: 0,
      bookings: 0
    }

    try {
      await setDoc(doc(db, 'skills', skillId), skillListing)
      return skillId
    } catch (error) {
      console.error('スキル情報の保存に失敗しました:', error)
      throw new Error('スキル情報の保存に失敗しました')
    }
  }

  /**
   * 講師登録の全体処理
   */
  static async registerTeacher(
    userId: string,
    data: TeacherRegistrationData
  ): Promise<{ teacherId: string; skillId: string }> {
    try {
      let photoUrl: string | undefined

      // プロフィール写真をアップロード（存在する場合）
      if (data.photo) {
        photoUrl = await this.uploadProfilePhoto(data.photo, userId)
      }

      // 講師プロフィールを保存
      await this.saveTeacherProfile(userId, data, photoUrl)

      // スキル情報を保存
      const skillId = await this.saveSkillListing(userId, data, photoUrl)

      return {
        teacherId: userId,
        skillId
      }
    } catch (error) {
      console.error('講師登録に失敗しました:', error)
      throw error
    }
  }
}