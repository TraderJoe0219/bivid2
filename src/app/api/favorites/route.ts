import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { auth } from '@/lib/firebase'
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

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return NextResponse.json({ favoriteSkillIds: [] })
    }

    const userData = userDoc.data()
    const favoriteSkillIds = userData.favoriteSkillIds || []

    return NextResponse.json({ favoriteSkillIds })
  } catch (error) {
    console.error('Failed to get favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { skillId } = await request.json()
    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      await setDoc(userDocRef, { favoriteSkillIds: [skillId] })
    } else {
      await updateDoc(userDocRef, {
        favoriteSkillIds: arrayUnion(skillId)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to add favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')
    
    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    const userDocRef = doc(db, 'users', userId)
    await updateDoc(userDocRef, {
      favoriteSkillIds: arrayRemove(skillId)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}