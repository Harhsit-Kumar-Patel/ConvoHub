// client/src/App.jsx
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { getUser } from './lib/auth.js';
import RoleGuard from './components/RoleGuard.jsx';

// Import all pages
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Direct from './pages/Direct.jsx';
import Complaints from './pages/Complaints.jsx';
import Profile from './pages/Profile.jsx';
import Notices from './pages/Notices.jsx';
import Announcements from './pages/Announcements.jsx';
import Courses from './pages/educational/Courses.jsx';
import CourseDetail from './pages/educational/CourseDetail.jsx';
import CreateCourse from './pages/educational/CreateCourse.jsx';
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
import AnalyticsDashboard from './pages/educational/AnalyticsDashboard.jsx';
import UserManagement from './pages/educational/UserManagement.jsx';
import CreateNotice from './pages/educational/CreateNotice.jsx';
import Projects from './pages/professional/Projects.jsx';
import ProjectBoard from './pages/professional/ProjectBoard.jsx';
import TeamChat from './pages/professional/TeamChat.jsx';
import ExploreTeams from './pages/professional/ExploreTeams.jsx';
import Directory from './pages/professional/Directory.jsx';
import MyTasks from './pages/professional/MyTasks.jsx';
import TeamPerformance from './pages/professional/TeamPerformance.jsx';
import ProjectPortfolio from './pages/professional/ProjectPortfolio.jsx';
import ProfessionalUserManagement from './pages/professional/UserManagement.jsx';

import { ToastProvider, ToastViewport } from '@/components/ui/toast.jsx';
import { NotificationProvider } from './components/NotificationProvider.jsx';


// Main layout component for authenticated users
const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, scale: 0.99 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.99 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'circOut',
    duration: 0.3,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="w-full h-full p-6 md:p-8"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};


export default function App() {
  const user = getUser();
  const isProfessional = user?.workspaceType === 'professional';

  return (
    <ToastProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/direct" element={<Direct />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/profile" element={<Profile />} />
              
              {isProfessional ? (
                <>
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectBoard />} />
                  <Route path="/my-tasks" element={<MyTasks />} />
                  <Route path="/teams" element={<TeamChat />} />
                  <Route path="/explore-teams" element={<ExploreTeams />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/team-performance" element={<RoleGuard min="lead"><TeamPerformance /></RoleGuard>} />
                  <Route path="/portfolio" element={<RoleGuard min="manager"><ProjectPortfolio /></RoleGuard>} />
                  <Route path="/user-management" element={<RoleGuard min="org_admin"><ProfessionalUserManagement /></RoleGuard>} />
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
                  <Route path="/notices" element={<Notices />} />

                  <Route path="/create-notice" element={<RoleGuard min="instructor"><CreateNotice /></RoleGuard>} />
                  <Route path="/create-course" element={<RoleGuard min="instructor"><CreateCourse /></RoleGuard>} />
                  <Route path="/create-assignment" element={<RoleGuard min="instructor"><CreateAssignment /></RoleGuard>} />
                  <Route path="/view-complaints" element={<RoleGuard min="coordinator"><ViewComplaints /></RoleGuard>} />
                  <Route path="/analytics" element={<RoleGuard min="coordinator"><AnalyticsDashboard /></RoleGuard>} />
                  <Route path="/user-management" element={<RoleGuard min="principal"><UserManagement /></RoleGuard>} />
                  <Route path="/grading/assignment/:id" element={<RoleGuard min="instructor"><Grading /></RoleGuard>} />
                  <Route path="/courses/:id/gradebook" element={<RoleGuard min="instructor"><Gradebook /></RoleGuard>} />
                  <Route path="/courses/:id/manage" element={<RoleGuard min="instructor"><ManageCourse /></RoleGuard>} />
                </>
              )}            </Route>
          </Route>
          
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <div className="text-center p-8">
                <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
                <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200">
                  Go to Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </NotificationProvider>
      <ToastViewport />
    </ToastProvider>
  );
}