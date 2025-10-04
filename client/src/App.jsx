// client/src/App.jsx
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { getUser } from './lib/auth.js';
import RoleGuard from './components/RoleGuard.jsx';

// Shared pages
import Auth from './pages/Auth.jsx';
import Direct from './pages/Direct.jsx';
import Complaints from './pages/Complaints.jsx';
import Profile from './pages/Profile.jsx';
import Notices from './pages/Notices.jsx';
import Dashboard from './pages/Dashboard.jsx'; // Unified Dashboard

// Educational pages
import Courses from './pages/educational/Courses.jsx';
import CourseDetail from './pages/educational/CourseDetail.jsx';
import CreateCourse from './pages/educational/CreateCourse.jsx';
import CreateNotice from './pages/educational/CreateNotice.jsx';
import Gradebook from './pages/educational/Gradebook.jsx';
import Grades from './pages/educational/Grades.jsx';
import CohortChat from './pages/educational/CohortChat.jsx';
import Assignments from './pages/educational/Assignments.jsx';
import AssignmentDetail from './pages/educational/AssignmentDetail.jsx';
import CreateAssignment from './pages/educational/CreateAssignment.jsx';
import ViewComplaints from './pages/educational/ViewComplaints.jsx';
import MyCalendar from './pages/educational/MyCalendar.jsx';
import Grading from './pages/educational/Grading.jsx';
import ManageCourse from './pages/educational/ManageCourse.jsx';

// Professional pages
import Projects from './pages/professional/Projects.jsx';
import ProjectBoard from './pages/professional/ProjectBoard.jsx';
import TeamChat from './pages/professional/TeamChat.jsx';
import ExploreTeams from './pages/professional/ExploreTeams.jsx';
import Directory from './pages/professional/Directory.jsx';

import { ToastProvider, ToastViewport } from '@/components/ui/toast.jsx';


// Main layout component for authenticated users
const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet /> {/* Child routes will render here */}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};


export default function App() {
  const user = getUser();
  const isProfessional = user?.workspaceType === 'professional';

  return (
    <ToastProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* All authenticated routes are now children of this route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/direct" element={<Direct />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notices" element={<Notices />} />

            {isProfessional ? (
              <>
                {/* Professional Routes */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectBoard />} />
                <Route path="/teams" element={<TeamChat />} />
                <Route path="/explore-teams" element={<ExploreTeams />} />
                <Route path="/directory" element={<Directory />} />
              </>
            ) : (
              <>
                {/* Educational Routes */}
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/assignments/:id" element={<AssignmentDetail />} />
                <Route path="/chat" element={<CohortChat />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/calendar" element={<MyCalendar />} />
                
                {/* Role-Protected Educational Routes */}
                <Route path="/create-assignment" element={<RoleGuard min="instructor"><CreateAssignment /></RoleGuard>} />
                <Route path="/create-course" element={<RoleGuard min="instructor"><CreateCourse /></RoleGuard>} />
                <Route path="/create-notice" element={<RoleGuard min="instructor"><CreateNotice /></RoleGuard>} />
                <Route path="/view-complaints" element={<RoleGuard min="coordinator"><ViewComplaints /></RoleGuard>} />
                <Route path="/grading/assignment/:id" element={<RoleGuard min="instructor"><Grading /></RoleGuard>} />
                <Route path="/courses/:id/gradebook" element={<RoleGuard min="instructor"><Gradebook /></RoleGuard>} />
                <Route path="/courses/:id/manage" element={<RoleGuard min="instructor"><ManageCourse /></RoleGuard>} />
              </>
            )}
          </Route>
        </Route>
      </Routes>
      <ToastViewport />
    </ToastProvider>
  );
}