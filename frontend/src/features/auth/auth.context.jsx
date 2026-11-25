import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(
      (data) => setUser(data.user),
      (error) => {
        if (error.response?.status !== 401) {
          console.error("Unable to load the current user", error);
        }
        setUser(null);
      }
    ).finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
