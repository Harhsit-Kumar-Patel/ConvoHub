import { Navigate } from 'react-router-dom';
import { isAuthed, hasRoleAtLeast, getWorkspaceType } from '@/lib/auth.js';

/**
 * RoleGuard component
 * Usage:
 * <RoleGuard min="instructor" workspace="educational">...</RoleGuard>
 * <RoleGuard min="lead" workspace="professional">...</RoleGuard>
 * If only authenticated check is needed, just wrap with ProtectedRoute.
 */
export default function RoleGuard({ children, min, workspace }) {
  if (!isAuthed()) return <Navigate to="/auth" replace />;

  const ws = getWorkspaceType();
  if (workspace && ws !== workspace) return <Navigate to="/" replace />;

  if (min && !hasRoleAtLeast(min)) return <Navigate to="/" replace />;

  return children;
}
