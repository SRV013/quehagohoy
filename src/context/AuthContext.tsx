import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { auth } from '../services/firebase';

export type AppUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

type AuthContextValue = {
  user: AppUser | null;
  initializing: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Firebase reutiliza la misma instancia mutable de User entre onAuthStateChanged y
// auth.currentUser: si le pasáramos ese objeto directo a setState, React puede ver
// la misma referencia (aunque sus propiedades hayan cambiado, ej. displayName tras
// updateProfile) y saltear el re-render. Por eso mapeamos siempre a un objeto plano
// nuevo antes de guardarlo en estado.
function toAppUser(firebaseUser: FirebaseUser | null): AppUser | null {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(toAppUser(nextUser));
      setInitializing(false);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    initializing,
    signUp: async (name, email, password) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await credential.user.reload();
      setUser(toAppUser(auth.currentUser));
    },
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOutUser: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
