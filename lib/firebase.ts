import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "demo-project.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Check if we have valid Firebase configuration
const hasValidFirebaseConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  return (
    apiKey &&
    apiKey !== "your_firebase_api_key_here" &&
    apiKey.length > 10 &&
    projectId &&
    projectId !== "demo-project" &&
    projectId === "marketin-462707" &&
    appId &&
    appId !== "1:430609724444:web:12345abcdef" && // Check for old placeholder
    !appId.includes("12345abcdef") && // Additional check for old placeholder
    appId.startsWith("1:430609724444:web:") && // Check correct project format
    appId.length > 25 // Ensure it's not just a placeholder
  );
};

console.log("Firebase Config Status:", {
  hasValidConfig: hasValidFirebaseConfig(),
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

// Only initialize Firebase if we have a valid configuration
const app = hasValidFirebaseConfig() ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;
