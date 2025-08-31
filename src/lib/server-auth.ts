import { headers } from 'next/headers'
import { admin, verifyIdToken } from './firebaseAdmin'

export interface ServerUser {
  uid: string
  admin?: boolean
  email?: string
  emailVerified?: boolean
}

export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const headersList = headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization?.startsWith('Bearer ')) {
      return null
    }

    const token = authorization.substring(7)
    const decodedToken = await verifyIdToken(token)
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false
    }
  } catch (error) {
    console.error('Failed to get server user:', error)
    return null
  }
}

// Alias for backwards compatibility
export const getCurrentUser = getServerUser
