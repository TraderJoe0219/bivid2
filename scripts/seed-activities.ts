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

// サンプル活動データ
const activities = [
  {
    title: '地域清掃ボランティア',
    category: 'ボランティア',
    tags: ['交流', '地域貢献', '健康'],
    start: '2025-10-05T10:00:00+09:00',
    end: '2025-10-05T11:30:00+09:00',
    location: {
      lat: 34.7804,
      lng: 135.4686,
      address: '大阪府豊中市中桜塚3丁目 桜塚公園',
      city: '豊中市',
      prefecture: '大阪府',
      name: '桜塚公園'
    },
    org: '豊中市ボランティア協会',
    cost: 0,
    description: '地域の公園や道路の清掃活動を行います。軍手とゴミ袋は用意しますので、汚れても良い服装でお越しください。',
    maxParticipants: 20,
    currentParticipants: 8,
    rating: 4.5
  },
  {
    title: 'スマホ教室：基本操作編',
    category: '学び',
    tags: ['スマホサポート', '学習', 'IT'],
    start: '2025-10-06T13:30:00+09:00',
    end: '2025-10-06T15:00:00+09:00',
    location: {
      lat: 34.7736,
      lng: 135.4690,
      address: '大阪府豊中市南桜塚1丁目 豊中市立中央公民館',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立中央公民館'
    },
    org: 'シニアIT支援の会',
    cost: 500,
    description: 'スマートフォンの基本的な使い方を学びます。電話のかけ方、メールの送受信、アプリの使い方などを丁寧に説明します。',
    maxParticipants: 15,
    currentParticipants: 12,
    rating: 4.8
  },
  {
    title: '買い物同行サポート',
    category: '生活支援',
    tags: ['買い物同行', '生活支援', '交流'],
    start: '2025-10-07T09:30:00+09:00',
    end: '2025-10-07T11:00:00+09:00',
    location: {
      lat: 34.7820,
      lng: 135.4620,
      address: '大阪府豊中市岡町北1丁目 阪急オアシス岡町店',
      city: '豊中市',
      prefecture: '大阪府',
      name: '阪急オアシス岡町店'
    },
    org: '豊中生活支援センター',
    cost: 0,
    description: '重い荷物の買い物や、商品選びをお手伝いします。一緒に楽しくお買い物しましょう。',
    maxParticipants: 5,
    currentParticipants: 3,
    rating: 4.2
  },
  {
    title: '朝のラジオ体操',
    category: '健康・運動',
    tags: ['健康', '体操', 'ウォーキング'],
    start: '2025-10-08T06:30:00+09:00',
    end: '2025-10-08T07:00:00+09:00',
    location: {
      lat: 34.7850,
      lng: 135.4650,
      address: '大阪府豊中市本町1丁目 豊中市立文化芸術センター前広場',
      city: '豊中市',
      prefecture: '大阪府',
      name: '文化芸術センター前広場'
    },
    org: '豊中健康づくりの会',
    cost: 0,
    description: '毎朝のラジオ体操で健康的な一日をスタートしましょう。初心者の方も大歓迎です。',
    maxParticipants: 30,
    currentParticipants: 18,
    rating: 4.0
  },
  {
    title: '手芸サークル：秋の小物作り',
    category: '文化・趣味',
    tags: ['手芸', '裁縫', '創作活動'],
    start: '2025-10-09T14:00:00+09:00',
    end: '2025-10-09T16:00:00+09:00',
    location: {
      lat: 34.7789,
      lng: 135.4723,
      address: '大阪府豊中市南桜塚2丁目 豊中市立老人福祉センター',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立老人福祉センター'
    },
    org: '豊中手芸サークル',
    cost: 300,
    description: '秋らしい小物を手作りします。材料費込みの参加費です。裁縫道具はお貸しします。',
    maxParticipants: 12,
    currentParticipants: 9,
    rating: 4.6
  },
  {
    title: 'お茶会と昔話',
    category: '交流・イベント',
    tags: ['おしゃべり', '交流', '文化'],
    start: '2025-10-10T15:00:00+09:00',
    end: '2025-10-10T16:30:00+09:00',
    location: {
      lat: 34.7760,
      lng: 135.4710,
      address: '大阪府豊中市中桜塚2丁目 さくら茶屋',
      city: '豊中市',
      prefecture: '大阪府',
      name: 'さくら茶屋'
    },
    org: '豊中おしゃべりの会',
    cost: 200,
    description: '美味しいお茶とお菓子を楽しみながら、昔の思い出話や近況報告をしませんか。',
    maxParticipants: 10,
    currentParticipants: 7,
    rating: 4.3
  },
  {
    title: '園芸教室：冬野菜の植え付け',
    category: '文化・趣味',
    tags: ['庭仕事', 'ガーデニング', '学習'],
    start: '2025-10-11T10:00:00+09:00',
    end: '2025-10-11T12:00:00+09:00',
    location: {
      lat: 34.7830,
      lng: 135.4580,
      address: '大阪府豊中市西泉丘1丁目 豊中市立農業公園',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立農業公園'
    },
    org: '豊中園芸愛好会',
    cost: 800,
    description: '冬野菜の種まきと植え付けを学びます。持ち帰り用の苗もプレゼント。道具は全て用意します。',
    maxParticipants: 16,
    currentParticipants: 11,
    rating: 4.7
  },
  {
    title: '読書会：今月の一冊',
    category: '学び',
    tags: ['読書', '勉強', '交流'],
    start: '2025-10-12T13:00:00+09:00',
    end: '2025-10-12T15:00:00+09:00',
    location: {
      lat: 34.7770,
      lng: 135.4695,
      address: '大阪府豊中市中桜塚3丁目 豊中市立中央図書館',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立中央図書館'
    },
    org: '豊中読書クラブ',
    cost: 0,
    description: '今月の課題図書について語り合います。本を読むのが好きな方、新しい本に出会いたい方歓迎。',
    maxParticipants: 8,
    currentParticipants: 6,
    rating: 4.4
  },
  {
    title: '認知症予防体操',
    category: '健康・運動',
    tags: ['健康', '体操', '認知症予防'],
    start: '2025-10-13T11:00:00+09:00',
    end: '2025-10-13T12:00:00+09:00',
    location: {
      lat: 34.7800,
      lng: 135.4700,
      address: '大阪府豊中市南桜塚3丁目 豊中市立体育館',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立体育館'
    },
    org: '豊中健康推進協議会',
    cost: 0,
    description: '楽しく体を動かしながら、脳の活性化を図る体操です。音楽に合わせて無理なく行います。',
    maxParticipants: 25,
    currentParticipants: 20,
    rating: 4.5
  },
  {
    title: 'デジタル写真整理講座',
    category: '学び',
    tags: ['スマホサポート', 'IT', '写真'],
    start: '2025-10-14T14:30:00+09:00',
    end: '2025-10-14T16:30:00+09:00',
    location: {
      lat: 34.7736,
      lng: 135.4690,
      address: '大阪府豊中市南桜塚1丁目 豊中市立中央公民館',
      city: '豊中市',
      prefecture: '大阪府',
      name: '豊中市立中央公民館'
    },
    org: 'シニアIT支援の会',
    cost: 700,
    description: 'スマホやデジカメで撮った写真の整理方法を学びます。アルバム作りのコツもお教えします。',
    maxParticipants: 12,
    currentParticipants: 8,
    rating: 4.6
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