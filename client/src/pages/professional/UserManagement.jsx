import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { getUser } from '@/lib/auth';

const educationalRoles = ['student', 'ta', 'instructor', 'coordinator', 'principal', 'admin'];
const professionalRoles = ['member', 'lead', 'manager', 'org_admin', 'admin'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const currentUser = getUser();

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users/manage')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Failed to fetch users", err);
        toast({ variant: "destructive", title: "Error", description: "Could not load user data." });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!editingUser) return;
    try {
      const res = await api.put(`/users/manage/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      fetchUsers(); // Re-fetch the list to show updated data
      setIsEditDialogOpen(false);
      toast({ title: "User Updated", description: `${res.data.name}'s profile has been saved.` });
    } catch (err) {
      console.error("Failed to update user", err);
      toast({ variant: "destructive", title: "Update Failed", description: err.response?.data?.message || "Could not save changes." });
    }
  };

  const handleDeleteUser = async (userId) => {
      if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
          try {
              await api.delete(`/users/manage/${userId}`);
              fetchUsers();
              toast({ title: "User Deleted", description: "The user has been removed." });
          } catch (err) {
              console.error("Failed to delete user", err);
              toast({ variant: "destructive", title: "Deletion Failed", description: err.response?.data?.message || "Could not delete the user." });
          }
      }
  };
  
  const workspaceTitle = currentUser?.workspaceType === 'professional' ? 'Employee' : 'User';

  if (loading) return <div className="p-8">Loading user data...</div>;

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold font-heading">{workspaceTitle} Management</h1>
        <p className="text-muted-foreground">View, edit, and manage all users in the workspace.</p>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-medium text-left">Name</th>
                  <th className="px-4 py-3 font-medium text-left">Email</th>
                  <th className="px-4 py-3 font-medium text-left">Role</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(user)} className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
            <DialogDescription>Update the user's details and role below.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input id="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 bg-background" />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select id="role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 bg-background capitalize">
                  {(editingUser.workspaceType === 'professional' ? professionalRoles : educationalRoles).map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}