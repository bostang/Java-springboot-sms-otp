// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Removed: import { initializeAppCheck, ReCaptchaV3Provider, ReCaptchaV2Provider } from "firebase/app-check"; // Removed App Check modules for now

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // This is now your general Firebase Web API Key
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
auth.languageCode = 'it';

// Removed App Check initialization for now to resolve compilation error
/*
// Initialize App Check
// Use ReCaptchaV2Provider for Phone Auth
if (process.env.NODE_ENV === 'development') {
  // To enable debug mode in development, set self.FIREBASE_APPCHECK_DEBUG_TOKEN = true in console
  // or set it programmatically before initializing App Check:
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV2Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY), // Use your reCAPTCHA v2 site key here
  isTokenAutoRefreshEnabled: true // Automatically refresh App Check tokens
});
*/
