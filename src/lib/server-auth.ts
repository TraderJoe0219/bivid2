import { headers } from 'next/headers'
import { verifyIdToken } from './firebaseAdmin'

export interface ServerUser {
  uid: string
  admin?: boolean
  email?: string
}

export async function getCurrentUser(): Promise<ServerUser | null> {
  try {
    const h = headers()
    const auth = h.get('authorization') || h.get('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) return null
    const token = auth.slice('Bearer '.length).trim()
    const decoded = await verifyIdToken(token)
    if (!decoded) return null
    return {
      uid: decoded.uid,
      admin: Boolean((decoded as any).admin),
      email: decoded.email,
    }
  } catch {
    return null
  }
}
