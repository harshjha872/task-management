import { createContext, useContext, useEffect, useState } from 'react';

//@ts-ignore
const AuthContext = createContext()

const MOCK_USER = {
  email: "local-user@example.com",
  displayName: "Local User",
  uid: "local-user-id"
};

export function AuthProvider({ children }: {children: any}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Auto-login for demo purposes
      setUser(MOCK_USER);
      localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
    }
    setLoading(false);
  }, []);


  const logout = async () => {
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  const loginWithGoogle = async () => {
    setUser(MOCK_USER);
    localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
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
