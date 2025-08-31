import { NextRequest } from 'next/server'
import { admin } from './firebaseAdmin'

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  try {
    const adminInstance = await admin()
    const decodedToken = await adminInstance.auth().verifyIdToken(token)
    return decodedToken.uid
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}