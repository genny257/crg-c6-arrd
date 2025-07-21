// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

// This check prevents Firebase from initializing on the server side
// where the env vars might not be available
if (typeof window !== "undefined" && firebaseConfig.projectId) {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (e) {
        console.error("Firebase initialization error", e);
      }
    } else {
      app = getApp();
    }
    
    db = getFirestore(app!);
    storage = getStorage(app!);

    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn("Firestore offline persistence failed: Multiple tabs open.");
        } else if (err.code == 'unimplemented') {
          console.warn("Firestore offline persistence not supported in this browser.");
        }
      });

} else {
    console.warn("Firebase not initialized. Missing projectId or running on server.")
}

export { db, storage };
