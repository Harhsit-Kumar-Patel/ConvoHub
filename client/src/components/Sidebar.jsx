import { Link, useLocation } from 'react-router-dom';
import { getUser, isAuthed, logout, hasRoleAtLeast } from '../lib/auth.js';
import { Button } from './ui/button.jsx';
import { Icons } from './Icons.jsx';

const educationalLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/courses', label: 'Courses', icon: Icons.notice },
  { to: '/create-course', label: 'Create Course', icon: Icons.notice, minRole: 'instructor' },
  { to: '/notices', label: 'Announcements', icon: Icons.notice },
  { to: '/create-notice', label: 'Post Notice', icon: Icons.notice, minRole: 'instructor' },
  { to: '/assignments', label: 'Assignments', icon: Icons.notice },
  { to: '/calendar', label: 'My Calendar', icon: Icons.calendar },
  { to: '/create-assignment', label: 'Create Assignment', icon: Icons.notice, minRole: 'instructor' },
  { to: '/grades', label: 'Grades', icon: Icons.chat },
  { to: '/chat', label: 'Cohort Chat', icon: Icons.chat },
  { to: '/direct', label: 'Direct Messages', icon: Icons.dm },
  { to: '/complaints', label: 'Complaint Box', icon: Icons.dm },
  { to: '/analytics', label: 'Analytics', icon: Icons.dashboard, minRole: 'coordinator' },
  { to: '/view-complaints', label: 'View Complaints', icon: Icons.dm, minRole: 'coordinator' },
  { to: '/user-management', label: 'User Management', icon: Icons.profile, minRole: 'principal' },
  { to: '/profile', label: 'Profile', icon: Icons.profile },
];

const professionalLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/projects', label: 'Projects', icon: Icons.chat },
  { to: '/my-tasks', label: 'My Tasks', icon: Icons.profile },
  { to: '/teams', label: 'Team Chat', icon: Icons.chat },
  { to: '/explore-teams', label: 'Explore Teams', icon: Icons.chat },
  { to: '/team-performance', label: 'Team Performance', icon: Icons.dashboard, minRole: 'lead' },
  { to: '/notices', label: 'Notices', icon: Icons.notice },
  { to: '/directory', label: 'Directory', icon: Icons.profile },
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
  };

  if (!authed) return null;

  const SidebarBody = (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      {/* Header (fixed) */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icons.chat className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link to="/" className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            ConvoHub
          </Link>
        </div>
      </div>
      
      {/* Navigation (scrollable) */}
      <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
        {navLinks.map(link => {
          if (link.minRole && !hasRoleAtLeast(link.minRole)) return null;
          const isActive = location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(`${link.to}/`));
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer (fixed) */}
      <div className="flex-shrink-0">
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
      <aside className="hidden md:block flex-shrink-0">
        {SidebarBody}
      </aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full shadow-lg animate-in slide-in-from-left">
            {SidebarBody}
          </div>
        </div>
      )}
    </>
  );
}