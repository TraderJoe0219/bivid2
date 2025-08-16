import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase Admin envs: FIREBASE_ADMIN_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // camelCase (現行の型が期待)
      projectId,
      clientEmail,
      privateKey,
      // snake_case (一部の内部チェック/古いエラー文言対策)
      project_id: projectId as any,
      client_email: clientEmail as any,
      private_key: privateKey as any,
    } as any),
  });
}

export { admin };
