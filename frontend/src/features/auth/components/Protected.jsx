import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-loading" role="status" aria-live="polite">
        <span className="auth-loading__spinner" aria-hidden="true" />
        <p>Checking your session...</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
}
