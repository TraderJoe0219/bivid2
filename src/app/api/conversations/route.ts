import { NextRequest, NextResponse } from 'next/server'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getAuth().verifyIdToken(token)
    return decodedToken.uid
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// 会話一覧を取得 (GET)
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザーが参加している会話を取得
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', userId)
    )

    const conversationsSnapshot = await getDocs(conversationsQuery)
    const conversations = conversationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Failed to get conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 新しい会話を開始 (POST)
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { participantId, skillId, initialMessage } = await request.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    if (participantId === userId) {
      return NextResponse.json(
        { error: 'Cannot start conversation with yourself' },
        { status: 400 }
      )
    }

    // 既存の会話を確認
    const existingConversationQuery = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', userId)
    )

    const existingSnapshot = await getDocs(existingConversationQuery)
    const existingConversation = existingSnapshot.docs.find(doc => {
      const data = doc.data()
      return data.participantIds.includes(participantId) && 
             data.participantIds.length === 2 &&
             (!skillId || data.skillId === skillId)
    })

    if (existingConversation) {
      return NextResponse.json({
        id: existingConversation.id,
        ...existingConversation.data()
      })
    }

    // 相手のユーザー情報を取得
    const participantDoc = await getDoc(doc(db, 'users', participantId))
    if (!participantDoc.exists()) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // 自分のユーザー情報を取得
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    const participantData = participantDoc.data()

    // 新しい会話を作成
    const conversationData = {
      participantIds: [userId, participantId],
      participantNames: [userData.displayName || 'Unknown', participantData.displayName || 'Unknown'],
      skillId: skillId || null,
      lastMessageAt: serverTimestamp(),
      lastMessage: initialMessage || '',
      isActive: true,
      createdAt: serverTimestamp(),
    }

    const conversationRef = await addDoc(collection(db, 'conversations'), conversationData)

    // 初期メッセージがある場合は送信
    if (initialMessage) {
      await addDoc(collection(db, 'messages'), {
        conversationId: conversationRef.id,
        senderId: userId,
        content: initialMessage,
        type: 'text',
        isRead: false,
        createdAt: serverTimestamp(),
      })
    }

    return NextResponse.json({
      id: conversationRef.id,
      ...conversationData,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to create conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}