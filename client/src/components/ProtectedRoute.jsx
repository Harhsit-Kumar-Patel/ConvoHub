import { Navigate, Outlet } from 'react-router-dom';
import { isAuthed } from '../lib/auth.js';

export default function ProtectedRoute() {
  if (!isAuthed()) {
    return <Navigate to="/auth" replace />;
  }
  // The Outlet component is used to render the nested child routes
  return <Outlet />;
}