'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserByEmail, createUser } from '@/lib/firestore';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: {
      name: string;
      role: 'provider' | 'client';
      phone?: string;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user data from Firestore
          let userData = await getUserByEmail(firebaseUser.email!);

          // If no user document exists in Firestore, create one
          if (!userData) {
            // Create a basic user document - we'll assume client role by default
            const userDataToCreate: any = {
              email: firebaseUser.email!,
              name:
                firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              role: 'client', // Default to client
            };

            // Only add phone if it exists
            if (firebaseUser.phoneNumber) {
              userDataToCreate.phone = firebaseUser.phoneNumber;
            }

            await createUser(userDataToCreate);

            // Fetch the newly created user
            userData = await getUserByEmail(firebaseUser.email!);
          }

          setUser(userData);
        } catch (error) {
          console.error('Error fetching/creating user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      name: string;
      role: 'provider' | 'client';
      phone?: string;
    }
  ) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    const userDataToCreate: any = {
      email: firebaseUser.email!,
      name: userData.name,
      role: userData.role,
    };

    // Only add phone if it exists
    if (userData.phone) {
      userDataToCreate.phone = userData.phone;
    }

    await createUser(userDataToCreate);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
