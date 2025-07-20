// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

// Check if the service account details are provided in environment variables
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  // Check if all required service account properties are available
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  } else {
    // If running in an environment without these variables (like a local dev setup without a full .env),
    // we can initialize without credentials for certain functionalities, though most will fail.
    // Or, we can simply log that initialization is skipped.
    console.warn('Firebase Admin SDK not initialized. Missing environment variables.');
    // Initializing without credentials if you only need access to unauthenticated features,
    // which is unlikely for admin tasks. For this app, we'll just warn.
    // admin.initializeApp(); 
  }
}

const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

// It's crucial to handle the case where adminDb might be null if initialization fails.
// Any file importing adminDb should check if it's null before using it.
// For this app, flows will check for this.

export { adminDb };
