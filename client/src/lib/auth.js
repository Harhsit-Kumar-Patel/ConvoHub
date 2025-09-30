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
