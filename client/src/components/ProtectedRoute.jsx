import { Navigate, Outlet } from 'react-router-dom';
import { isAuthed } from '../lib/auth.js';

export default function ProtectedRoute() {
  if (!isAuthed()) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}