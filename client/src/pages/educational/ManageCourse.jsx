import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function ManageCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', code: '', instructor: '', description: '' });
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(res => {
        setCourse(res.data);
        setFormData({
          name: res.data.name,
          code: res.data.code,
          instructor: res.data.instructor,
          description: res.data.description
        });
        setStudents(res.data.students || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/courses/${id}`, formData);
      setCourse(res.data);
      toast({ title: 'Course updated successfully!' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to update course' });
    }
  };
  
  const handleSearch = async () => {
      if (!search) return;
      const res = await api.get('/users/search', { params: { q: search } });
      setSearchResults(res.data || []);
  };

  const handleEnroll = async (studentId) => {
      try {
          await api.post(`/courses/${id}/enroll`, { studentId });
          const res = await api.get(`/courses/${id}`);
          setStudents(res.data.students || []);
          toast({ title: 'Student enrolled!' });

      } catch (err) {
          toast({ variant: 'destructive', title: 'Failed to enroll student' });
      }
  };
  
  const handleRemove = async (studentId) => {
      try {
          await api.delete(`/courses/${id}/students/${studentId}`);
          setStudents(students.filter(s => s._id !== studentId));
          toast({ title: 'Student removed' });
      } catch (err) {
          toast({ variant: 'destructive', title: 'Failed to remove student' });
      }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <header>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/courses">← Back to Courses</Link>
        </Button>
        <h1 className="text-4xl font-bold font-heading">Manage: {course.name}</h1>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Code</label>
              <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Instructor</label>
              <input value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-background" />
            </div>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Enrollment</CardTitle>
            <CardDescription>Add or remove students from this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full border rounded-lg px-3 py-2 bg-background" />
                <Button onClick={handleSearch}>Search</Button>
            </div>
            <div className="space-y-2 mb-4">
                {searchResults.map(user => (
                    <div key={user._id} className="flex justify-between items-center p-2 border rounded">
                        <p>{user.name} ({user.email})</p>
                        <Button size="sm" onClick={() => handleEnroll(user._id)}>Enroll</Button>
                    </div>
                ))}
            </div>
            <h3 className="font-semibold mb-2">Enrolled Students</h3>
            <div className="space-y-2">
                {students.map(student => (
                    <div key={student._id} className="flex justify-between items-center p-2 border rounded">
                        <p>{student.name} ({student.email})</p>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(student._id)}>Remove</Button>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}