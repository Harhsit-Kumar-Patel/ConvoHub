import React, { useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import SettingsModal from '@/components/SettingsModal.jsx';
import { getUser } from '@/lib/auth.js';

export default function Header({ onOpenMobileSidebar }) {
  const user = getUser();
  const initials = useMemo(() => (user?.name || 'U').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase(), [user]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Mobile sidebar toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={onOpenMobileSidebar}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </Button>

        {/* Search */}
        <div className="flex-1">
          <div className="relative max-w-xl">
            <input
              aria-label="Search"
              placeholder="Search notices, chats, people..."
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SettingsModal />
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
