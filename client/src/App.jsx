import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence and motion
import { getUser } from './lib/auth.js';

// Shared pages
import Auth from './pages/Auth.jsx';
import Direct from './pages/Direct.jsx';
import Complaints from './pages/Complaints.jsx';
import Profile from './pages/Profile.jsx';
import Notices from './pages/Notices.jsx';

// Educational pages
import EduDashboard from './pages/educational/EduDashboard.jsx';
import Courses from './pages/educational/Courses.jsx';
import Grades from './pages/educational/Grades.jsx';
import CohortChat from './pages/educational/CohortChat.jsx';
import Assignments from './pages/educational/Assignments.jsx';
import AssignmentDetail from './pages/educational/AssignmentDetail.jsx';

// Professional pages
import ProDashboard from './pages/professional/ProDashboard.jsx';
import Projects from './pages/professional/Projects.jsx';
import ProjectBoard from './pages/professional/ProjectBoard.jsx';
import TeamChat from './pages/professional/TeamChat.jsx';
import ExploreTeams from './pages/professional/ExploreTeams.jsx';
import Directory from './pages/professional/Directory.jsx';
import { ToastProvider, ToastViewport } from '@/components/ui/toast.jsx';


export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = getUser();

  const MainDashboard = user?.workspaceType === 'professional' ? ProDashboard : EduDashboard;

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <ToastProvider>
    <div className={`flex h-screen ${isAuthPage ? '' : 'bg-background'}`}>
      {!isAuthPage && (
        <>
          {/* Mobile overlay */}
          <Sidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
        </>
      )}
      <main className="flex-1 overflow-y-auto">
        {!isAuthPage && (
          <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes location={location}>
              {/* Public Auth Route */}
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />

              {/* Shared */}
              <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
              <Route path="/direct" element={<ProtectedRoute><Direct /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {user?.workspaceType === 'professional' ? (
                <>
                  {/* Professional Routes */}
                  <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ProjectBoard /></ProtectedRoute>} />
                  <Route path="/teams" element={<ProtectedRoute><TeamChat /></ProtectedRoute>} />
                  <Route path="/explore-teams" element={<ProtectedRoute><ExploreTeams /></ProtectedRoute>} />
                  <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                </>
              ) : (
                <>
                  {/* Educational Routes */}
                  <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
                  <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetail /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><CohortChat /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
                </>
              )}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <ToastViewport />
    </div>
    </ToastProvider>
  );
}