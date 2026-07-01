"use client";

import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/lib/firebase";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const createUser = (
    email: string,
    password: string
  ) => {
    setLoading(true);

    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  const loginUser = (
    email: string,
    password: string
  ) => {
    setLoading(true);

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  const googleLogin = () => {
    setLoading(true);

    return signInWithPopup(
      auth,
      googleProvider
    );
  };

  const updateUserProfile = (
    name: string,
    photoURL: string
  ) => {
    return updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL,
    });
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const authInfo = {
  user,
  setUser,
  loading,
  createUser,
  loginUser,
  googleLogin,
  logoutUser,
  updateUserProfile,
};

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;