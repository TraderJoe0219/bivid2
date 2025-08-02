import { config } from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore'

// 環境変数を読み込み
config({ path: '.env.local' })

// Firebase設定（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// カテゴリマスターデータ
const categories = [
  {
    id: 'cooking',
    name: '料理・お菓子作り',
    description: '家庭料理から本格的なお菓子作りまで',
    icon: 'chef-hat',
    color: '#f97316',
    parentId: null,
    level: 0,
    sortOrder: 1,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'gardening',
    name: '園芸・ガーデニング',
    description: '植物の育て方、庭づくりのコツ',
    icon: 'flower',
    color: '#22c55e',
    parentId: null,
    level: 0,
    sortOrder: 2,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'handicraft',
    name: '手芸・裁縫',
    description: '編み物、刺繍、洋裁など',
    icon: 'scissors',
    color: '#ec4899',
    parentId: null,
    level: 0,
    sortOrder: 3,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'music',
    name: '楽器演奏',
    description: 'ピアノ、ギター、歌など',
    icon: 'music',
    color: '#8b5cf6',
    parentId: null,
    level: 0,
    sortOrder: 4,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'technology',
    name: 'パソコン・スマホ',
    description: 'デジタル機器の使い方',
    icon: 'smartphone',
    color: '#3b82f6',
    parentId: null,
    level: 0,
    sortOrder: 5,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'language',
    name: '語学',
    description: '英語、中国語、韓国語など',
    icon: 'globe',
    color: '#06b6d4',
    parentId: null,
    level: 0,
    sortOrder: 6,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'art',
    name: '書道・絵画',
    description: '書道、水彩画、油絵など',
    icon: 'palette',
    color: '#f59e0b',
    parentId: null,
    level: 0,
    sortOrder: 7,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
  {
    id: 'health',
    name: '健康・体操',
    description: 'ヨガ、太極拳、ストレッチなど',
    icon: 'heart',
    color: '#ef4444',
    parentId: null,
    level: 0,
    sortOrder: 8,
    isActive: true,
    isPopular: true,
    skillCount: 0,
  },
]

// サンプルスキルデータ
const sampleSkills = [
  {
    id: 'skill-001',
    title: '初心者向け家庭料理教室',
    description: '基本的な家庭料理を一から丁寧にお教えします。包丁の使い方から始めて、煮物、炒め物、汁物の基本をマスターしましょう。',
    shortDescription: '基本的な家庭料理を一から丁寧にお教えします',
    category: 'cooking',
    subCategory: '家庭料理',
    tags: ['初心者歓迎', '基本料理', '和食'],
    teacherId: 'teacher-001',
    teacherName: '田中花子',
    teacherPhotoURL: null,
    teacherLocation: '東京都世田谷区',
    duration: 120,
    price: {
      amount: 3000,
      currency: 'JPY',
      unit: 'per_lesson',
    },
    location: {
      type: 'offline',
      address: '東京都世田谷区三軒茶屋',
      prefecture: '東京都',
      city: '世田谷区',
      area: '三軒茶屋',
    },
    maxStudents: 4,
    currentBookings: 0,
    availableSlots: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '10:00', endTime: '16:00', isAvailable: true },
    ],
    images: [],
    videoURL: null,
    rating: {
      average: 4.8,
      count: 12,
      distribution: { 5: 10, 4: 2, 3: 0, 2: 0, 1: 0 },
    },
    difficulty: 'beginner',
    targetAudience: ['料理初心者', '主婦・主夫', 'シニア'],
    requirements: ['エプロン', '筆記用具'],
    isActive: true,
    isApproved: true,
    viewCount: 156,
    favoriteCount: 23,
  },
  {
    id: 'skill-002',
    title: 'ベランダでできる野菜作り',
    description: 'マンションのベランダでも楽しめる野菜作りをお教えします。プランターの選び方から収穫まで、都市部での園芸のコツをお伝えします。',
    shortDescription: 'ベランダでも楽しめる野菜作りを教えます',
    category: 'gardening',
    subCategory: '野菜作り',
    tags: ['ベランダ菜園', '初心者OK', '都市園芸'],
    teacherId: 'teacher-002',
    teacherName: '佐藤緑',
    teacherPhotoURL: null,
    teacherLocation: '神奈川県横浜市',
    duration: 90,
    price: {
      amount: 2500,
      currency: 'JPY',
      unit: 'per_lesson',
    },
    location: {
      type: 'both',
      address: '神奈川県横浜市港北区',
      prefecture: '神奈川県',
      city: '横浜市',
      area: '港北区',
    },
    maxStudents: 3,
    currentBookings: 0,
    availableSlots: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isAvailable: true },
    ],
    images: [],
    videoURL: null,
    rating: {
      average: 4.9,
      count: 8,
      distribution: { 5: 7, 4: 1, 3: 0, 2: 0, 1: 0 },
    },
    difficulty: 'beginner',
    targetAudience: ['園芸初心者', 'マンション住まい', '自然好き'],
    requirements: ['汚れても良い服装', '軍手'],
    isActive: true,
    isApproved: true,
    viewCount: 89,
    favoriteCount: 15,
  },
]

async function seedFirestore() {
  try {
    console.log('🌱 Firestoreデータベースの初期化を開始します...')

    // カテゴリデータの投入
    console.log('📂 カテゴリデータを投入中...')
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log(`✅ カテゴリ「${category.name}」を作成しました`)
    }

    // サンプルスキルデータの投入
    console.log('🎯 サンプルスキルデータを投入中...')
    for (const skill of sampleSkills) {
      await setDoc(doc(db, 'skills', skill.id), {
        ...skill,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log(`✅ スキル「${skill.title}」を作成しました`)
    }

    console.log('🎉 Firestoreデータベースの初期化が完了しました！')
    console.log(`📊 作成されたデータ:`)
    console.log(`   - カテゴリ: ${categories.length}件`)
    console.log(`   - スキル: ${sampleSkills.length}件`)

  } catch (error) {
    console.error('❌ データベース初期化中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// スクリプト実行
if (require.main === module) {
  seedFirestore()
    .then(() => {
      console.log('✨ 初期化スクリプトが正常に完了しました')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 スクリプト実行中にエラーが発生しました:', error)
      process.exit(1)
    })
}

export { seedFirestore }
