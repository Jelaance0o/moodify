import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity";

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <UseAnimations className="loading" animation={infinity} size={80} />;
  }

  if (!user) return <Navigate to="/login" />;
  return children;
}
