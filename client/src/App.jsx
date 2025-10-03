// client/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
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

// Educational pages
import EduDashboard from './pages/educational/EduDashboard.jsx';
import Courses from './pages/educational/Courses.jsx';
import CourseDetail from './pages/educational/CourseDetail.jsx';
import CreateCourse from './pages/educational/CreateCourse.jsx';
import CreateNotice from './pages/educational/CreateNotice.jsx';
import Grades from './pages/educational/Grades.jsx';
import CohortChat from './pages/educational/CohortChat.jsx';
import Assignments from './pages/educational/Assignments.jsx';
import AssignmentDetail from './pages/educational/AssignmentDetail.jsx';
import CreateAssignment from './pages/educational/CreateAssignment.jsx';
import ViewComplaints from './pages/educational/ViewComplaints.jsx';
import MyCalendar from './pages/educational/MyCalendar.jsx';
import Grading from './pages/educational/Grading.jsx';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = getUser();

  const MainDashboard = user?.workspaceType === 'professional' ? ProDashboard : EduDashboard;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <ToastProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-background">
                <Sidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto">
                  <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
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
                        <Route path="/" element={<MainDashboard />} />
                        <Route path="/dashboard" element={<MainDashboard />} />
                        <Route path="/notices" element={<Notices />} />
                        <Route path="/direct" element={<Direct />} />
                        <Route path="/complaints" element={<Complaints />} />
                        <Route path="/profile" element={<Profile />} />

                        {user?.workspaceType === 'professional' ? (
                          <>
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<ProjectBoard />} />
                            <Route path="/teams" element={<TeamChat />} />
                            <Route path="/explore-teams" element={<ExploreTeams />} />
                            <Route path="/directory" element={<Directory />} />
                          </>
                        ) : (
                          <>
                            <Route path="/assignments" element={<Assignments />} />
                            <Route path="/assignments/:id" element={<AssignmentDetail />} />
                            <Route path="/chat" element={<CohortChat />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/courses/:id" element={<CourseDetail />} />
                            <Route path="/grades" element={<Grades />} />
                            <Route path="/calendar" element={<MyCalendar />} />
                            
                            {/* Role-Protected Routes */}
                            <Route path="/create-assignment" element={<RoleGuard min="instructor"><CreateAssignment /></RoleGuard>} />
                            <Route path="/create-course" element={<RoleGuard min="instructor"><CreateCourse /></RoleGuard>} />
                            <Route path="/create-notice" element={<RoleGuard min="instructor"><CreateNotice /></RoleGuard>} />
                            <Route path="/view-complaints" element={<RoleGuard min="coordinator"><ViewComplaints /></RoleGuard>} />
                            <Route path="/grading/assignment/:id" element={<RoleGuard min="instructor"><Grading /></RoleGuard>} />
                          </>
                        )}
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastViewport />
    </ToastProvider>
  );
}