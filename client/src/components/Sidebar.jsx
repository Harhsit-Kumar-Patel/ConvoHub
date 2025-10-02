import { Link, useLocation } from 'react-router-dom';
import { getUser, isAuthed, logout } from '../lib/auth.js';
import { Button } from './ui/button.jsx';
import { Icons } from './Icons.jsx';

const educationalLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/notices', label: 'Notices', icon: Icons.notice },
  { to: '/assignments', label: 'Assignments', icon: Icons.notice },
  { to: '/chat', label: 'Cohort Chat', icon: Icons.chat },
  { to: '/direct', label: 'Direct Messages', icon: Icons.dm },
  { to: '/complaints', label: 'Complaint Box', icon: Icons.dm },
  { to: '/profile', label: 'Profile', icon: Icons.profile },
];

const professionalLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/projects', label: 'Projects', icon: Icons.chat },
  { to: '/teams', label: 'Team Chat', icon: Icons.chat }, // Add this line
  { to: '/direct', label: 'Direct Messages', icon: Icons.dm },
  { to: '/complaints', label: 'Complaint Box', icon: Icons.dm },
  { to: '/profile', label: 'Profile', icon: Icons.profile },
];


export default function Sidebar({ isMobileOpen = false, onMobileClose = () => { } }) {
  const location = useLocation();
  const user = getUser();
  const authed = isAuthed();

  const navLinks = user?.workspaceType === 'professional' ? professionalLinks : educationalLinks;

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  }

  if (!authed) {
    return null;
  }

  const SidebarBody = (
    <div className="w-64 bg-card border-r p-4 h-full flex flex-col justify-between">
      <div>
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icons.chat className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link to="/" className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            ConvoHub
          </Link>
        </div>
        <nav className="mt-8 space-y-1">
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div>
        <div className="p-4 border-t">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start mt-2 text-muted-foreground" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:h-screen md:sticky md:top-0">
        {SidebarBody}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full shadow-lg animate-in slide-in-from-left w-64 bg-card border-r">
            {SidebarBody}
          </div>
        </div>
      )}
    </>
  );
}