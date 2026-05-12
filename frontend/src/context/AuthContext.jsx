import { createContext, useContext, useState, useEffect } from "react";
import { authApi, userApi } from "../api/api";

// ──────────────────────────────────────────────────────────────
//  Auth Context
//
//  Provides user state, login/signup/logout, and profile loading.
//  The JWT is stored as an HTTP-only cookie, so we just call
//  getProfile() on mount to check if we're authenticated.
// ──────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await authApi.login(email, password);
    setUser(res.data.user);
    return res;
  }

  async function signup(formData) {
    const res = await authApi.signup(formData);
    setUser(res.data.user);
    return res;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  async function refreshUser() {
    const res = await userApi.getProfile();
    setUser(res.data);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
