import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Check if Firebase Admin environment variables are available and valid
const hasValidFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return (
    projectId &&
    clientEmail &&
    privateKey &&
    privateKey !== "your_private_key_here" &&
    privateKey !==
      '"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_CONTENT_HERE\\n-----END PRIVATE KEY-----\\n"' &&
    privateKey.includes("BEGIN PRIVATE KEY") &&
    projectId !== "your_project_id_here" &&
    clientEmail !==
      "firebase-adminsdk-xxxxx@marketin-462707.iam.gserviceaccount.com"
  );
};

// Initialize Firebase Admin only if it hasn't been initialized and config is valid
if (!getApps().length && hasValidFirebaseConfig()) {
  try {
    // Clean up the private key - remove extra quotes and fix newlines
    const privateKey = process.env
      .FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")
      .replace(/^"/, "")
      .replace(/"$/, "");

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
} else if (!hasValidFirebaseConfig()) {
  console.log(
    "Firebase Admin not initialized - missing or invalid configuration"
  );
}

export const adminAuth =
  hasValidFirebaseConfig() && getApps().length > 0 ? getAuth() : null;

export const adminDb =
  hasValidFirebaseConfig() && getApps().length > 0 ? getFirestore() : null;
