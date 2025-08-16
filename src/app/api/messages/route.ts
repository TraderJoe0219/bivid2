import { NextRequest, NextResponse } from 'next/server'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit,
  doc,
  getDoc,
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

// メッセージ一覧を取得 (GET)
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limitCount = parseInt(searchParams.get('limit') || '50')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    // 会話に参加しているかチェック
    const conversationRef = doc(db, 'conversations', conversationId)
    const conversationDoc = await getDoc(conversationRef)
    
    if (!conversationDoc.exists()) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const conversationData = conversationDoc.data()
    if (!conversationData.participantIds.includes(userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // メッセージを取得
    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const messagesSnapshot = await getDocs(messagesQuery)
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse() // 古い順に並び替え

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Failed to get messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// メッセージを送信 (POST)
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, content, type = 'text' } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      )
    }

    // 会話に参加しているかチェック
    const conversationRef = doc(db, 'conversations', conversationId)
    const conversationDoc = await getDoc(conversationRef)
    
    if (!conversationDoc.exists()) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const conversationData = conversationDoc.data()
    if (!conversationData.participantIds.includes(userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // メッセージを保存
    const messageData = {
      conversationId,
      senderId: userId,
      content,
      type,
      isRead: false,
      createdAt: serverTimestamp(),
    }

    const messageRef = await addDoc(collection(db, 'messages'), messageData)

    return NextResponse.json({ 
      id: messageRef.id,
      ...messageData,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}