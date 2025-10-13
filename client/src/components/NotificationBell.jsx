import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNotifications } from './NotificationProvider';
import { Icons } from './Icons';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icons.notice className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          {notifications.length > 0 && (
            <Button variant="link" onClick={markAllAsRead} className="text-xs h-auto p-0">
              Mark all as read
            </Button>
          )}
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <Link to={n.link || '#'} key={n._id} className="block p-3 hover:bg-accent rounded-lg">
                <div className="flex items-start">
                  {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-3"></div>}
                  <div className={n.read ? 'text-muted-foreground' : ''}>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No notifications yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}