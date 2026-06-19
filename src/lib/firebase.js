import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is available (env vars may be missing at build time)
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let app = null;
let auth = null;
let googleProvider = null;
let db = null;
let storage = null;

if (hasConfig) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        db = getFirestore(app);
        storage = getStorage(app);
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
    }
}

export { auth, googleProvider, db, storage };
export default app;
