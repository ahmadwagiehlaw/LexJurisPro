import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, onAuthStateChanged, FirebaseUser, doc, getDoc, setDoc, Timestamp } from '../firebase';

interface FirebaseContextType {
  user: FirebaseUser | null;
  profile: any | null;
  loading: boolean;
  isAuthReady: boolean;
  role: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create initial user profile
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'lawyer', // Default role
              createdAt: Timestamp.now()
            };
            await setDoc(userDocRef, newUser);
            setProfile(newUser);
            setRole('lawyer');
          } else {
            const data = userDoc.data();
            setProfile(data);
            setRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setProfile(null);
        setRole(null);
      }
      
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, isAuthReady, role }}>
      {children}
    </FirebaseContext.Provider>
  );
};
