import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../lib/demoData';
import { auth, db } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  switchDemoUser: (role: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('reporter');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.reporter);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt anonymous sign in to establish real Firebase Auth credentials for rules
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        try {
          // Sync profile to firestore if not present
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, {
              uid: user.uid,
              email: `${currentRole}@resqroute.internal`,
              displayName: DEMO_USERS[currentRole]?.displayName || 'Demo User',
              role: currentRole,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('[ResQRoute Auth] Firestore user sync notice:', e);
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.warn('[ResQRoute Auth] Anonymous signin note:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentRole]);

  const switchDemoUser = async (role: UserRole) => {
    setCurrentRole(role);
    const demo = DEMO_USERS[role];
    if (demo) {
      setCurrentUser(demo);
    }
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: `${role}@resqroute.internal`,
          displayName: demo?.displayName || `${role.toUpperCase()} User`,
          role: role,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('[ResQRoute Auth] Role update warning:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        currentRole,
        setRole: switchDemoUser,
        switchDemoUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
