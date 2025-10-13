import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import api from '@/lib/api';
import { hasRoleAtLeast } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/Icons';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToCurrent = () => toolbar.onNavigate('TODAY');
  const view = (viewName) => toolbar.onView(viewName);

  const viewNames = [
    { key: 'month', label: 'Month' },
    { key: 'week', label: 'Week' },
    { key: 'day', label: 'Day' },
    { key: 'agenda', label: 'Agenda' },
  ];

  return (
    <div className="rbc-toolbar-custom mb-6 p-2 rounded-lg bg-card/60 backdrop-blur-xl border supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-heading text-foreground">{toolbar.label}</h2>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={goToBack}><Icons.chevronLeft className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={goToNext}><Icons.chevronRight className="h-5 w-5" /></Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToCurrent}>Today</Button>
        </div>
        <div className="hidden md:inline-flex items-center rounded-md border bg-background p-1 text-sm">
            {viewNames.map((v) => (
                <button key={v.key} onClick={() => view(v.key)} className={`px-3 py-1.5 transition-colors rounded-md ${toolbar.view === v.key ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}>
                    {v.label}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// Custom Event component
const EventComponent = ({ event }) => (
  <div className="flex items-center gap-2 text-xs font-semibold p-1" data-type={event.type}>
    <span className="truncate">{event.title}</span>
  </div>
);

// Loading Skeleton
const CalendarSkeleton = () => (
    <div className="p-8">
        <div className="h-16 w-full rounded-lg bg-muted animate-pulse mb-6"></div>
        <div className="h-[60vh] w-full rounded-lg bg-muted animate-pulse"></div>
    </div>
);


export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', allDay: false });
  const { toast } = useToast();
  const navigate = useNavigate();
  const canCreateEvents = hasRoleAtLeast('instructor');

  const fetchCalendarItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/calendar/items');
      const formattedEvents = (res.data || []).map(item => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch calendar items", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load calendar data." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCalendarItems();
  }, [fetchCalendarItems]);

  const handleSelectEvent = useCallback((event) => {
    if (event.link) {
      navigate(event.link);
    }
  }, [navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all event details." });
      return;
    }
    try {
      await api.post('/calendar/events', newEvent);
      toast({ title: "Event Created", description: "The event has been added to the calendar." });
      setIsDialogOpen(false);
      setNewEvent({ title: '', start: '', end: '', allDay: false });
      fetchCalendarItems(); // Refresh events
    } catch (error) {
      console.error("Failed to create event", error);
      toast({ variant: "destructive", title: "Error", description: "Could not create the event." });
    }
  };

  if (loading) {
      return <CalendarSkeleton />;
  }

  return (
    <div className="p-8 space-y-6 h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading">Calendar</h1>
          <p className="text-muted-foreground">View assignments, deadlines, and events.</p>
        </div>
        {canCreateEvents && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Calendar Event</DialogTitle>
                <DialogDescription>This event will be visible to everyone in your workspace.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label htmlFor="title">Event Title</label>
                  <input id="title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" required />
                </div>
                <div>
                  <label htmlFor="start">Start Date</label>
                  <input id="start" type="datetime-local" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" required />
                </div>
                <div>
                  <label htmlFor="end">End Date</label>
                  <input id="end" type="datetime-local" value={newEvent.end} onChange={e => setNewEvent({...newEvent, end: e.target.value})} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" required />
                </div>
                <div className="flex items-center gap-2">
                  <input id="allDay" type="checkbox" checked={newEvent.allDay} onChange={e => setNewEvent({...newEvent, allDay: e.target.checked})} />
                  <label htmlFor="allDay">All-day event</label>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </header>

      <div className="flex-1 -mx-8 -mb-8">
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', padding: '0 2rem 2rem 2rem' }}
            onSelectEvent={handleSelectEvent}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
          />
      </div>
    </div>
  );
}