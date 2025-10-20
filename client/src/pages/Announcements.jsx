import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { hasRoleAtLeast } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const canManageAnnouncements = hasRoleAtLeast('lead');

  const fetchAnnouncements = () => {
    setLoading(true);
    api.get('/announcements')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (announcementData) => {
    try {
      if (announcementData._id) {
        await api.put(`/announcements/${announcementData._id}`, announcementData);
        toast({ title: 'Announcement updated successfully!' });
      } else {
        await api.post('/announcements', announcementData);
        toast({ title: 'Announcement created successfully!' });
      }
      fetchAnnouncements();
      setIsDialogOpen(false);
      setSelectedAnnouncement(null);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to save announcement' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        toast({ title: 'Announcement deleted successfully!' });
        fetchAnnouncements();
      } catch (err) {
        toast({ variant: 'destructive', title: 'Failed to delete announcement' });
      }
    }
  };

  const openDialog = (announcement = null) => {
    setSelectedAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const filteredItems = useMemo(() => {
    return items;
  }, [items]);

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Announcements</h2>
          <p className="text-muted-foreground">Stay in the loop with the latest announcements.</p>
        </div>
        {canManageAnnouncements && (
          <Button onClick={() => openDialog()}>Create Announcement</Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredItems.map((announcement) => (
            <motion.div
              key={announcement._id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{announcement.body}</p>
                </div>
                {canManageAnnouncements && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDialog(announcement)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement._id)}>Delete</Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">By {announcement.author || 'Admin'} • {new Date(announcement.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?._id ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement?._id ? 'Update the details of the announcement.' : 'Create a new announcement for the professional workspace.'}
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            announcement={selectedAnnouncement}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedAnnouncement(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function AnnouncementForm({ announcement, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    body: announcement?.body || '',
    pinned: announcement?.pinned || false,
    _id: announcement?._id || null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2 bg-background"
          required
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium">Body</label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={5}
          className="mt-1 w-full border rounded-md px-3 py-2 bg-background"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="pinned"
          name="pinned"
          type="checkbox"
          checked={formData.pinned}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label htmlFor="pinned" className="text-sm">Pin this announcement</label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}