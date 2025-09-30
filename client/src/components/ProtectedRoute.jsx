import { Navigate } from 'react-router-dom';
import { isAuthed } from '../lib/auth.js';

export default function ProtectedRoute({ children }) {
  if (!isAuthed()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
