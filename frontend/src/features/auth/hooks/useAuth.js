import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");

  const { loading, user, setUser } = context;

  async function handleRegister(credentials) {
    const data = await register(credentials);
    setUser(data.user);
    return true;
  }

  async function handleLogin(credentials) {
    const data = await login(credentials);
    setUser(data.user);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return { handleLogin, handleLogout, handleRegister, loading, user };
};