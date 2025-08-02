import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore'

// Firebase設定（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

console.log('🔧 Firebase設定:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? '設定済み' : '未設定',
})

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFirestore() {
  try {
    console.log('🧪 Firestoreテストを開始します...')

    // 最小限のテストデータ
    const testData = {
      name: 'テストカテゴリ',
      description: 'これはテストです',
      createdAt: Timestamp.now(),
    }

    console.log('📝 テストデータ:', testData)

    // テストドキュメントを作成
    await setDoc(doc(db, 'test', 'test-doc'), testData)
    
    console.log('✅ テストドキュメントの作成に成功しました！')
    console.log('🎉 Firestoreの接続は正常です')

  } catch (error) {
    console.error('❌ Firestoreテスト中にエラーが発生しました:', error)
    
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('エラースタック:', error.stack)
    }
  }
}

// スクリプト実行
if (require.main === module) {
  testFirestore()
    .then(() => {
      console.log('✨ テストスクリプトが完了しました')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 テストスクリプト実行中にエラーが発生しました:', error)
      process.exit(1)
    })
}

export { testFirestore }
