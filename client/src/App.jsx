import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';

// Import all pages
import Dashboard from './pages/Dashboard.jsx';
import Auth from './pages/Auth.jsx';
import Notices from './pages/Notices.jsx';
import Chat from './pages/Chat.jsx';
import Direct from './pages/Direct.jsx';
import Complaints from './pages/Complaints.jsx';
import Profile from './pages/Profile.jsx';
import Assignments from './pages/Assignments.jsx';
import AssignmentDetail from './pages/AssignmentDetail.jsx';
import Projects from './pages/Projects.jsx';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={`flex h-screen ${isAuthPage ? '' : 'bg-background'}`}>
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/direct" element={<ProtectedRoute><Direct /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Educational Routes */}
          <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
          <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetail /></ProtectedRoute>} />

          {/* Professional Routes */}
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}