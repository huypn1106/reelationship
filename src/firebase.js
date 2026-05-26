import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
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
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    console.log('🎬 Firebase initialized successfully in client!');
  } catch (error) {
    console.error('⚠️ Failed to initialize Firebase:', error);
  }
} else {
  console.log('💡 Running Reelationship in premium client-side fallback mode (local storage & in-memory sync engine). Paste real credentials in .env to connect.');
}

// Authentication Helpers
const signInWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    console.warn("Firebase not configured for Google Sign-In.");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

const logOut = async () => {
  if (!isFirebaseConfigured || !auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};

export { isFirebaseConfigured, auth, db, rtdb, storage, signInWithGoogle, logOut };

