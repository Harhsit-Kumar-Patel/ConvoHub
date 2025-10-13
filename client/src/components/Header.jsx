import React, { useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import SettingsModal from '@/components/SettingsModal.jsx';
import NotificationBell from '@/components/NotificationBell.jsx';
import GlobalSearch from '@/components/GlobalSearch.jsx'; // --- NEW ---
import { getUser } from '@/lib/auth.js';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip.jsx';

export default function Header({ onOpenMobileSidebar }) {
  const user = getUser();
  const initials = useMemo(() => (user?.name || 'U').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase(), [user]);

  return (
    <header className="z-30 border-b bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg flex-shrink-0">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Mobile sidebar toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={onOpenMobileSidebar}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </Button>

        {/* --- UPDATED: Global Search component --- */}
        <div className="flex-1">
          <GlobalSearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NotificationBell />
                </div>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SettingsModal />
                </div>
              </TooltipTrigger>
              <TooltipContent>Appearance settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent>{user?.name || 'Profile'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}