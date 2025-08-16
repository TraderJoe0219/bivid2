import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs } from 'firebase/firestore'
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

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { skillIds } = await request.json()
    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return NextResponse.json({ skills: [] })
    }

    const skillsQuery = query(
      collection(db, 'skills'),
      where('__name__', 'in', skillIds)
    )
    
    const querySnapshot = await getDocs(skillsQuery)
    const skills = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Failed to fetch favorite skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}