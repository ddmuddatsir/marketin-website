"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing auth state...");

    if (!auth) {
      console.log("Firebase not configured - using development mode");

      // For development, create a mock user if Firebase is not configured
      if (process.env.NODE_ENV === "development") {
        const mockUser = {
          uid: "test-user-id", // Use same ID as in API for consistency
          email: "test@example.com",
          displayName: "Test User",
          photoURL: null,
          emailVerified: true,
          getIdToken: async () => "test-token",
        } as User;

        console.log("Setting mock user for development:", mockUser.email);
        setUser(mockUser);
      }

      setLoading(false);
      return;
    }

    console.log("Firebase configured, setting up auth listener...");

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Auth timeout reached, setting loading to false");
      if (loading) {
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      clearTimeout(timeoutId); // Clear timeout if auth state changes
      setUser(user);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [loading]);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      console.error(
        "Firebase not configured. Please check your Firebase setup."
      );
      throw new Error("Firebase auth not initialized");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      console.error(
        "Firebase not configured. Please check your Firebase setup."
      );
      throw new Error("Firebase auth not initialized");
    }
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName: name });
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error(
        "Firebase not configured. Please check your Firebase setup."
      );
      throw new Error("Firebase Auth is not configured");
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      console.log("Successfully signed in:", result.user.email);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear wishlist from localStorage when signing out
      localStorage.removeItem("wishlist_items");

      // Handle development mode with mock user
      if (process.env.NODE_ENV === "development" && !auth) {
        console.log("Development mode: signing out mock user");
        setUser(null);
        return;
      }

      if (!auth) {
        console.error(
          "Firebase not configured. Please check your Firebase setup."
        );
        return;
      }

      await firebaseSignOut(auth);
      console.log("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
