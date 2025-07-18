import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Handle private key formatting - replace literal \n with actual newlines
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const adminApp =
  getApps().find((app) => app.name === 'admin') ||
  initializeApp(firebaseAdminConfig, 'admin');

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

export default adminApp;
