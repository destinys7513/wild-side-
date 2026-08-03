import { createContext, useContext, useEffect, useState } from "react";
import { getSession, login, logout, isLoggedIn } from "@/lib/auth";

export interface AppAuthState {
  user: { username: string; isAdmin: boolean } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  localUsername: string | null;
}

const AuthContext = createContext<AppAuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ ok: false, error: "Not initialized" }),
  logout: () => {},
  localUsername: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.ok) {
      const session = getSession();
      setUser(session);
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const value: AppAuthState = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login: handleLogin,
    logout: handleLogout,
    localUsername: user?.username ?? null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}