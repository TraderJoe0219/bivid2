import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { verifyAuth } from '@/lib/auth-server'


export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request)
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