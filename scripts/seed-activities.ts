// 活動データのシードスクリプト
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

// 環境変数の読み込み
dotenv.config({ path: '.env.local' })

// Firebase Admin の初期化
const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
})

const db = getFirestore(app)

// サンプル活動データ (SocialActivity型に準拠)
const activities = [
  {
    title: '地域清掃ボランティア',
    description: '地域の公園や道路の清掃活動を行います。軍手とゴミ袋は用意しますので、汚れても良い服装でお越しください。',
    shortDescription: '地域の公園や道路の清掃活動',
    category: 'volunteer',
    subCategory: '環境保全',
    tags: ['交流', '地域貢献', '健康'],
    teacherId: 'volunteer-org-001',
    teacherName: '豊中市ボランティア協会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 90,
    price: {
      amount: 0,
      currency: 'JPY',
      unit: 'volunteer'
    },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市中桜塚3丁目 桜塚公園',
      prefecture: '大阪府',
      city: '豊中市',
      area: '中桜塚',
      coordinates: {
        lat: 34.7804,
        lng: 135.4686
      }
    },
    maxStudents: 20,
    currentBookings: 8,
    availableSlots: [
      { dayOfWeek: 6, startTime: '10:00', endTime: '11:30', isAvailable: true }
    ],
    images: [],
    videoURL: null,
    rating: {
      average: 4.5,
      count: 15,
      distribution: { 5: 10, 4: 3, 3: 2, 2: 0, 1: 0 }
    },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', '初心者歓迎', '地域住民'],
    requirements: ['動きやすい服装', '飲み物持参'],
    isActive: true,
    isApproved: true,
    viewCount: 120,
    favoriteCount: 15
  },
  {
    title: 'スマホ教室：基本操作編',
    description: 'スマートフォンの基本的な使い方を学びます。電話のかけ方、メールの送受信、アプリの使い方などを丁寧に説明します。',
    shortDescription: 'スマホの基本操作を学ぶ教室',
    category: 'seminar',
    subCategory: 'IT・デジタル',
    tags: ['スマホサポート', '学習', 'IT'],
    teacherId: 'senior-it-001',
    teacherName: 'シニアIT支援の会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 90,
    price: {
      amount: 500,
      currency: 'JPY',
      unit: 'per_session'
    },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市南桜塚1丁目 豊中市立中央公民館',
      prefecture: '大阪府',
      city: '豊中市',
      area: '南桜塚',
      coordinates: {
        lat: 34.7736,
        lng: 135.4690
      }
    },
    maxStudents: 15,
    currentBookings: 12,
    availableSlots: [
      { dayOfWeek: 0, startTime: '13:30', endTime: '15:00', isAvailable: true }
    ],
    images: [],
    videoURL: null,
    rating: {
      average: 4.8,
      count: 25,
      distribution: { 5: 20, 4: 3, 3: 2, 2: 0, 1: 0 }
    },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', 'スマホ初心者', 'IT学習希望者'],
    requirements: ['スマートフォン持参'],
    isActive: true,
    isApproved: true,
    viewCount: 250,
    favoriteCount: 30
  },
  {
    title: '買い物同行サポート',
    description: '重い荷物の買い物や、商品選びをお手伝いします。一緒に楽しくお買い物しましょう。',
    shortDescription: '買い物のお手伝いサービス',
    category: 'help',
    subCategory: '生活支援',
    tags: ['買い物同行', '生活支援', '交流'],
    teacherId: 'support-center-001',
    teacherName: '豊中生活支援センター',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 90,
    price: { amount: 0, currency: 'JPY', unit: 'volunteer' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市岡町北1丁目 阪急オアシス岡町店',
      prefecture: '大阪府',
      city: '豊中市',
      area: '岡町北',
      coordinates: { lat: 34.7820, lng: 135.4620 }
    },
    maxStudents: 5,
    currentBookings: 3,
    availableSlots: [{ dayOfWeek: 1, startTime: '09:30', endTime: '11:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.2, count: 10, distribution: { 5: 5, 4: 3, 3: 2, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', '買い物支援が必要な方'],
    requirements: [],
    isActive: true,
    isApproved: true,
    viewCount: 80,
    favoriteCount: 10
  },
  {
    title: '朝のラジオ体操',
    description: '毎朝のラジオ体操で健康的な一日をスタートしましょう。初心者の方も大歓迎です。',
    shortDescription: '毎朝の健康ラジオ体操',
    category: 'event',
    subCategory: '健康・運動',
    tags: ['健康', '体操', 'ウォーキング'],
    teacherId: 'health-group-001',
    teacherName: '豊中健康づくりの会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 30,
    price: { amount: 0, currency: 'JPY', unit: 'free' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市本町1丁目 豊中市立文化芸術センター前広場',
      prefecture: '大阪府',
      city: '豊中市',
      area: '本町',
      coordinates: { lat: 34.7850, lng: 135.4650 }
    },
    maxStudents: 30,
    currentBookings: 18,
    availableSlots: [{ dayOfWeek: 2, startTime: '06:30', endTime: '07:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.0, count: 50, distribution: { 5: 15, 4: 20, 3: 10, 2: 3, 1: 2 } },
    difficulty: 'beginner' as const,
    targetAudience: ['全年齢', 'シニア', '健康維持希望者'],
    requirements: ['運動しやすい服装'],
    isActive: true,
    isApproved: true,
    viewCount: 300,
    favoriteCount: 45
  },
  {
    title: '手芸サークル：秋の小物作り',
    description: '秋らしい小物を手作りします。材料費込みの参加費です。裁縫道具はお貸しします。',
    shortDescription: '秋の小物を手作り',
    category: 'event',
    subCategory: '文化・趣味',
    tags: ['手芸', '裁縫', '創作活動'],
    teacherId: 'craft-circle-001',
    teacherName: '豊中手芸サークル',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 120,
    price: { amount: 300, currency: 'JPY', unit: 'per_session' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市南桜塚2丁目 豊中市立老人福祉センター',
      prefecture: '大阪府',
      city: '豊中市',
      area: '南桜塚',
      coordinates: { lat: 34.7789, lng: 135.4723 }
    },
    maxStudents: 12,
    currentBookings: 9,
    availableSlots: [{ dayOfWeek: 3, startTime: '14:00', endTime: '16:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.6, count: 20, distribution: { 5: 14, 4: 4, 3: 2, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', '手芸好き', '初心者歓迎'],
    requirements: [],
    isActive: true,
    isApproved: true,
    viewCount: 150,
    favoriteCount: 25
  },
  {
    title: 'お茶会と昔話',
    description: '美味しいお茶とお菓子を楽しみながら、昔の思い出話や近況報告をしませんか。',
    shortDescription: 'お茶を楽しむ交流会',
    category: 'event',
    subCategory: '交流',
    tags: ['おしゃべり', '交流', '文化'],
    teacherId: 'chat-group-001',
    teacherName: '豊中おしゃべりの会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 90,
    price: { amount: 200, currency: 'JPY', unit: 'per_session' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市中桜塚2丁目 さくら茶屋',
      prefecture: '大阪府',
      city: '豊中市',
      area: '中桜塚',
      coordinates: { lat: 34.7760, lng: 135.4710 }
    },
    maxStudents: 10,
    currentBookings: 7,
    availableSlots: [{ dayOfWeek: 4, startTime: '15:00', endTime: '16:30', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.3, count: 18, distribution: { 5: 8, 4: 7, 3: 3, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', '交流希望者'],
    requirements: [],
    isActive: true,
    isApproved: true,
    viewCount: 100,
    favoriteCount: 18
  },
  {
    title: '園芸教室：冬野菜の植え付け',
    description: '冬野菜の種まきと植え付けを学びます。持ち帰り用の苗もプレゼント。道具は全て用意します。',
    shortDescription: '冬野菜の植え付けを学ぶ',
    category: 'seminar',
    subCategory: '園芸・ガーデニング',
    tags: ['庭仕事', 'ガーデニング', '学習'],
    teacherId: 'garden-club-001',
    teacherName: '豊中園芸愛好会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 120,
    price: { amount: 800, currency: 'JPY', unit: 'per_session' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市西泉丘1丁目 豊中市立農業公園',
      prefecture: '大阪府',
      city: '豊中市',
      area: '西泉丘',
      coordinates: { lat: 34.7830, lng: 135.4580 }
    },
    maxStudents: 16,
    currentBookings: 11,
    availableSlots: [{ dayOfWeek: 5, startTime: '10:00', endTime: '12:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.7, count: 22, distribution: { 5: 16, 4: 5, 3: 1, 2: 0, 1: 0 } },
    difficulty: 'intermediate' as const,
    targetAudience: ['園芸好き', '野菜栽培に興味がある方'],
    requirements: ['汚れても良い服装', '帽子', '手袋'],
    isActive: true,
    isApproved: true,
    viewCount: 180,
    favoriteCount: 28
  },
  {
    title: '読書会：今月の一冊',
    description: '今月の課題図書について語り合います。本を読むのが好きな方、新しい本に出会いたい方歓迎。',
    shortDescription: '課題図書について語り合う',
    category: 'seminar',
    subCategory: '読書・文学',
    tags: ['読書', '勉強', '交流'],
    teacherId: 'book-club-001',
    teacherName: '豊中読書クラブ',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 120,
    price: { amount: 0, currency: 'JPY', unit: 'free' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市中桜塚3丁目 豊中市立中央図書館',
      prefecture: '大阪府',
      city: '豊中市',
      area: '中桜塚',
      coordinates: { lat: 34.7770, lng: 135.4695 }
    },
    maxStudents: 8,
    currentBookings: 6,
    availableSlots: [{ dayOfWeek: 6, startTime: '13:00', endTime: '15:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.4, count: 15, distribution: { 5: 8, 4: 5, 3: 2, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['読書好き', '新しい本との出会いを求める方'],
    requirements: ['課題図書を事前に読んでくること'],
    isActive: true,
    isApproved: true,
    viewCount: 95,
    favoriteCount: 20
  },
  {
    title: '認知症予防体操',
    description: '楽しく体を動かしながら、脳の活性化を図る体操です。音楽に合わせて無理なく行います。',
    shortDescription: '脳を活性化する体操',
    category: 'event',
    subCategory: '健康・運動',
    tags: ['健康', '体操', '認知症予防'],
    teacherId: 'health-council-001',
    teacherName: '豊中健康推進協議会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 60,
    price: { amount: 0, currency: 'JPY', unit: 'free' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市南桜塚3丁目 豊中市立体育館',
      prefecture: '大阪府',
      city: '豊中市',
      area: '南桜塚',
      coordinates: { lat: 34.7800, lng: 135.4700 }
    },
    maxStudents: 25,
    currentBookings: 20,
    availableSlots: [{ dayOfWeek: 0, startTime: '11:00', endTime: '12:00', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.5, count: 35, distribution: { 5: 18, 4: 12, 3: 5, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['シニア', '認知症予防に関心がある方'],
    requirements: ['運動しやすい服装', '飲み物'],
    isActive: true,
    isApproved: true,
    viewCount: 220,
    favoriteCount: 38
  },
  {
    title: 'デジタル写真整理講座',
    description: 'スマホやデジカメで撮った写真の整理方法を学びます。アルバム作りのコツもお教えします。',
    shortDescription: 'デジタル写真の整理方法',
    category: 'seminar',
    subCategory: 'IT・デジタル',
    tags: ['スマホサポート', 'IT', '写真'],
    teacherId: 'senior-it-001',
    teacherName: 'シニアIT支援の会',
    teacherPhotoURL: null,
    teacherLocation: '豊中市',
    duration: 120,
    price: { amount: 700, currency: 'JPY', unit: 'per_session' },
    location: {
      type: 'offline' as const,
      address: '大阪府豊中市南桜塚1丁目 豊中市立中央公民館',
      prefecture: '大阪府',
      city: '豊中市',
      area: '南桜塚',
      coordinates: { lat: 34.7736, lng: 135.4690 }
    },
    maxStudents: 12,
    currentBookings: 8,
    availableSlots: [{ dayOfWeek: 1, startTime: '14:30', endTime: '16:30', isAvailable: true }],
    images: [],
    videoURL: null,
    rating: { average: 4.6, count: 18, distribution: { 5: 12, 4: 4, 3: 2, 2: 0, 1: 0 } },
    difficulty: 'beginner' as const,
    targetAudience: ['写真整理に困っている方', 'デジタル初心者'],
    requirements: ['スマートフォンまたはデジカメ持参'],
    isActive: true,
    isApproved: true,
    viewCount: 140,
    favoriteCount: 22
  }
]

async function seedActivities() {
  try {
    console.log('🌱 活動データのシードを開始します...')

    const batch = db.batch()
    let count = 0

    for (const activity of activities) {
      const docRef = db.collection('activities').doc()

      const activityData = {
        ...activity,
        id: docRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      batch.set(docRef, activityData)
      count++
    }

    await batch.commit()

    console.log(`✅ ${count}件の活動データを正常に追加しました`)
    console.log(`
📋 追加された活動:
${activities.map((a, i) => `${i + 1}. ${a.title} (${a.category})`).join('\n')}
    `)

  } catch (error) {
    console.error('❌ シードに失敗しました:', error)
    process.exit(1)
  }
}

// メイン実行
async function main() {
  console.log('🔥 Firebase接続を確認中...')

  try {
    // Firestore接続テスト
    await db.collection('_test').doc('connection').set({ test: true })
    await db.collection('_test').doc('connection').delete()
    console.log('✅ Firestore接続成功')

    await seedActivities()

    console.log('🎉 シード処理が完了しました!')
    process.exit(0)

  } catch (error) {
    console.error('❌ 初期化エラー:', error)
    process.exit(1)
  }
}

// 実行
if (require.main === module) {
  main()
}