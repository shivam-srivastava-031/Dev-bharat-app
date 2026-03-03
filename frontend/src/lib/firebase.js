// Firebase config — using npm package
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let auth = null;
let analytics = null;
let googleProvider = null;

try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key') {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        analytics = getAnalytics(app);
        googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        console.log('✅ Firebase initialized');
    } else {
        console.log('⚠️ Firebase: No API key found, running in demo mode');
    }
} catch (error) {
    console.warn('⚠️ Firebase init error:', error.message);
}

export const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not configured. Add your keys to .env');
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

export const loginWithEmail = async (email, password) => {
    if (!auth) throw new Error('Firebase not configured. Add your keys to .env');
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
};

export const signupWithEmail = async (email, password) => {
    if (!auth) throw new Error('Firebase not configured. Add your keys to .env');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
};

export const loginWithPhone = async (phoneNumber, recaptchaContainer) => {
    if (!auth) throw new Error('Firebase not configured');
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, { size: 'invisible' });
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
};

export const logout = async () => {
    if (auth) await signOut(auth);
};

export const onAuthChange = (callback) => {
    if (!auth) {
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
};

export const trackEvent = (eventName, params = {}) => {
    if (analytics) logEvent(analytics, eventName, params);
};

export { app, auth, analytics };
