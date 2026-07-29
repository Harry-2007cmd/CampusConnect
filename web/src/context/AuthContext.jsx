import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "../services/api";
import { requestOtp, verifyOtp, getMe, updateProfile } from "../services/authService";

const AuthContext = createContext(null);

function isProfileComplete(user) {
  return Boolean(user?.name && user?.year && user?.department && user?.gender);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // restoring session on page load

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const me = await getMe();
        setToken(storedToken);
        setUser(me);
      }
    } catch (err) {
      // Stored token is invalid/expired — fall back to logged-out state.
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtp(email) {
    await requestOtp(email);
  }

  async function confirmOtp(email, code) {
    const { access_token, user: verifiedUser } = await verifyOtp(email, code);
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
    setUser(verifiedUser);
    return verifiedUser;
  }

  async function saveProfile(updates) {
    const updatedUser = await updateProfile(updates);
    setUser(updatedUser);
    return updatedUser;
  }

  async function logOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token),
      isProfileComplete: isProfileComplete(user),
      sendOtp,
      confirmOtp,
      saveProfile,
      logOut,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}
