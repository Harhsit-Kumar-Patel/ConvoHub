export function getToken() {
  return localStorage.getItem('convohub_token');
}

export function getUser() {
  const raw = localStorage.getItem('convohub_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function isAuthed() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem('convohub_token');
  localStorage.removeItem('convohub_user');
}

// Client-side role helpers for UI gating (must match server hierarchy)
const roleRanks = {
  educational: { student: 1, ta: 2, instructor: 3, dept_admin: 4, admin: 99 },
  professional: { member: 1, lead: 2, manager: 3, org_admin: 4, admin: 99 },
};

export function getWorkspaceType() {
  return getUser()?.workspaceType || 'educational';
}

export function getRole() {
  return getUser()?.role || 'student';
}

export function hasRoleAtLeast(min) {
  const ws = getWorkspaceType();
  const current = getRole();
  const table = roleRanks[ws] || roleRanks.educational;
  const curRank = table[current] || 0;
  const minRank = table[min] || Infinity; // if unknown min, deny
  return curRank >= minRank;
}
