import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Check if credentials are provided
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app = null;
let auth = null;
let db = null;
let rtdb = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);
    console.log('🎬 Firebase initialized successfully in client!');
  } catch (error) {
    console.error('⚠️ Failed to initialize Firebase:', error);
  }
} else {
  console.log('💡 Running Reelationship in premium client-side fallback mode (local storage & in-memory sync engine). Paste real credentials in .env to connect.');
}

export { isFirebaseConfigured, auth, db, rtdb, storage };
