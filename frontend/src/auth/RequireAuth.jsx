import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
