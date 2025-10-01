import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Auth from './pages/Auth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';

// Import your new pages
// import Projects from './pages/Projects.jsx';
// import Assignments from './pages/Assignments.jsx';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={`flex h-screen ${isAuthPage ? '' : 'bg-background'}`}>
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Add routes for new pages here */}
          {/* <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} /> */}
          {/* <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} /> */}
        </Routes>
      </main>
    </div>
  );
}