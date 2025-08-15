import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// プロフィール型定義
export interface UserProfile {
  uid: string;
  displayName: string;
  age?: number;
  location: string;
  bio: string;
  photoURL?: string;
  skills: string[];
  wantedSkills: string[];
  experience: Experience[];
  reviews: Review[];
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  title: string;
  company?: string;
  period: string;
  description: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// 地域選択肢
export const REGIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// スキルカテゴリ
export const SKILL_CATEGORIES = {
  '料理・食事': [
    '日本料理', '中華料理', '洋食', 'お菓子作り', 'パン作り', 
    '保存食作り', '郷土料理', '健康料理', 'ベジタリアン料理'
  ],
  '手工芸・創作': [
    '編み物', '裁縫', '刺繍', '陶芸', '木工', '園芸', '書道', 
    '絵画', '写真', '俳句・短歌', '折り紙', 'ちぎり絵'
  ],
  '音楽・芸能': [
    'カラオケ', '楽器演奏', '民謡', '踊り', '詩吟', '落語', 
    '朗読', '合唱', '三味線', '琴', '尺八'
  ],
  '運動・健康': [
    'ウォーキング', 'ラジオ体操', '太極拳', 'ヨガ', 'ゲートボール', 
    'グラウンドゴルフ', '卓球', 'マッサージ', '健康管理'
  ],
  '学習・教養': [
    '英会話', 'パソコン', 'スマートフォン', '歴史', '文学', 
    '書道', '計算', '漢字', '読書', '新聞読み'
  ],
  '生活技能': [
    '掃除', '整理整頓', '家計管理', '節約術', '修理', 
    'DIY', '防災', '介護', '子育て相談'
  ]
};

// プロフィール取得
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'profiles', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    throw error;
  }
};

// プロフィール作成・更新
export const saveUserProfile = async (profile: Partial<UserProfile>): Promise<void> => {
  try {
    if (!profile.uid) {
      throw new Error('ユーザーIDが必要です');
    }

    const docRef = doc(db, 'profiles', profile.uid);
    const now = new Date();
    
    const profileData = {
      ...profile,
      updatedAt: now,
    };

    // 新規作成の場合はcreatedAtを追加
    const existingProfile = await getUserProfile(profile.uid);
    if (!existingProfile) {
      profileData.createdAt = now;
    }

    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('プロフィール保存エラー:', error);
    throw error;
  }
};

// プロフィール写真アップロード
export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
  try {
    // ファイルサイズチェック (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('ファイルサイズは5MB以下にしてください');
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      throw new Error('画像ファイルを選択してください');
    }

    // 既存の写真を削除
    const existingProfile = await getUserProfile(uid);
    if (existingProfile?.photoURL) {
      try {
        const oldPhotoRef = ref(storage, `profiles/${uid}/photo`);
        await deleteObject(oldPhotoRef);
      } catch (error) {
        console.log('既存写真の削除をスキップ:', error);
      }
    }

    // 新しい写真をアップロード
    const photoRef = ref(storage, `profiles/${uid}/photo`);
    await uploadBytes(photoRef, file);
    const downloadURL = await getDownloadURL(photoRef);

    // プロフィールのphotoURLを更新
    await updateDoc(doc(db, 'profiles', uid), {
      photoURL: downloadURL,
      updatedAt: new Date()
    });

    return downloadURL;
  } catch (error) {
    console.error('写真アップロードエラー:', error);
    throw error;
  }
};

// スキル検索
export const searchUsersBySkill = async (skill: string): Promise<UserProfile[]> => {
  try {
    const profilesRef = collection(db, 'profiles');
    const q = query(profilesRef, where('skills', 'array-contains', skill));
    const querySnapshot = await getDocs(q);
    
    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      profiles.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile);
    });
    
    return profiles;
  } catch (error) {
    console.error('スキル検索エラー:', error);
    throw error;
  }
};

// 評価計算
export const calculateRating = (reviews: Review[]): { rating: number; totalReviews: number } => {
  if (reviews.length === 0) {
    return { rating: 0, totalReviews: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const rating = Math.round((totalRating / reviews.length) * 10) / 10;
  
  return { rating, totalReviews: reviews.length };
};

// プロフィール入力バリデーション
export const validateProfile = (profile: Partial<UserProfile>): string[] => {
  const errors: string[] = [];

  if (!profile.displayName?.trim()) {
    errors.push('お名前を入力してください');
  }

  if (!profile.location?.trim()) {
    errors.push('居住地域を選択してください');
  }

  if (profile.age && (profile.age < 0 || profile.age > 120)) {
    errors.push('年齢は0歳から120歳の間で入力してください');
  }

  if (profile.bio && profile.bio.length > 500) {
    errors.push('自己紹介は500文字以内で入力してください');
  }

  return errors;
};
