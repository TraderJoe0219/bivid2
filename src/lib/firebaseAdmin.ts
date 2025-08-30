import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Initialize Firebase Admin only if all required env vars are present
if (projectId && clientEmail && privateKey && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
} else if (!projectId || !clientEmail || !privateKey) {
  console.warn('Firebase Admin not initialized - missing env vars:', { 
    projectId: !!projectId, 
    clientEmail: !!clientEmail, 
    privateKey: !!privateKey 
  });
}

export { admin };

export const verifyIdToken = async (idToken: string) => {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
};
