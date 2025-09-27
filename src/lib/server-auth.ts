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

// New auth interface for consistency with API routes
export interface ServerAuthResult {
  user: { uid: string; email?: string; displayName?: string } | null
  error: string | null
}

/**
 * Get server auth state with standardized error handling
 */
export async function getServerAuth(): Promise<ServerAuthResult> {
  try {
    const serverUser = await getServerUser()

    if (!serverUser) {
      return {
        user: null,
        error: '認証が必要です'
      }
    }

    return {
      user: {
        uid: serverUser.uid,
        email: serverUser.email,
        displayName: serverUser.email?.split('@')[0] // Use email prefix as display name
      },
      error: null
    }
  } catch (error) {
    console.error('Server auth error:', error)
    return {
      user: null,
      error: error instanceof Error ? error.message : '認証エラーが発生しました'
    }
  }
}
