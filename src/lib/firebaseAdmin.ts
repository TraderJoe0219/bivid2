import * as admin from 'firebase-admin'

let app: admin.app.App | undefined

export function getAdminApp(): admin.app.App | undefined {
  if (app) return app
  try {
    if (admin.apps.length) {
      app = admin.app()
      return app
    }
    // Initialize using default credentials if available (e.g., Google Application Default Credentials)
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
    return app
  } catch (e) {
    // Credentials not configured; gracefully degrade
    return undefined
  }
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken | null> {
  const a = getAdminApp()
  if (!a) return null
  try {
    const decoded = await a.auth().verifyIdToken(idToken)
    return decoded
  } catch (e) {
    return null
  }
}
