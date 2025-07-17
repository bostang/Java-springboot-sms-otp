// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

    apiKey: "AIzaSyCp2i-F0XR_sNzREenEPP3rXp8agZDL49A",
  
    authDomain: "java-springboot-sms-otp.firebaseapp.com",
  
    projectId: "java-springboot-sms-otp",
  
    storageBucket: "java-springboot-sms-otp.firebasestorage.app",
  
    messagingSenderId: "299586048159",
  
    appId: "1:299586048159:web:0975b26ca07e037d4f92aa",
  
    measurementId: "G-C03MT7F4KH"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// HOW TO GET THE CONFIGURATION VALUES:
// 1. Go to your Firebase Console (https://console.firebase.google.com/)
// 2. Select your project
// 3. Navigate to Project Settings (gear icon next to Project Overview)
// 4. Under the "General" tab, scroll down to "Your apps"
// 5. If you haven't already, add a web app to your project
// 6. Copy the Firebase configuration object from there and replace the placeholders above