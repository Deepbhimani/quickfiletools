import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore profile (role, plan, etc.)
  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      setUserProfile(snap.data());
    }
  }

  // Sync user into MongoDB backend (auto-creates if not exists)
  async function syncToMongoDB() {
    try {
      await authAPI.getProfile();
      console.log("[auth] MongoDB sync successful");
    } catch (err) {
      console.warn("[auth] MongoDB sync failed:", err.message);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
        // Sync to MongoDB every time auth state is confirmed
        // getProfile now auto-creates the user if missing
        await syncToMongoDB();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signup(email, password, name) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Save to Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      name,
      role: "user",
      plan: "free",
      usageCount: 0,
      usageLimit: 10,
      createdAt: serverTimestamp(),
    });

    await fetchProfile(cred.user.uid);

    // Sync to MongoDB
    await syncToMongoDB();

    return cred;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await fetchProfile(cred.user.uid);

    // Sync to MongoDB
    await syncToMongoDB();

    return cred;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    // Upsert Firestore profile for Google users
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName,
        role: "user",
        plan: "free",
        usageCount: 0,
        usageLimit: 10,
        createdAt: serverTimestamp(),
      });
    }

    await fetchProfile(cred.user.uid);

    // Sync to MongoDB
    await syncToMongoDB();

    return cred;
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  const isPremium = userProfile?.role === "premium" || userProfile?.role === "admin";
  const isAdmin   = userProfile?.role === "admin";

  const value = {
    user,
    userProfile,
    loading,
    isPremium,
    isAdmin,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    refreshProfile: () => user && fetchProfile(user.uid),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
