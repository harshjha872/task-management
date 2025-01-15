import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

//@ts-ignore
const AuthContext = createContext()

export function AuthProvider({ children }: {children: any}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user:any) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const logout = async () => {
    return signOut(auth);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const value = {
    user,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}