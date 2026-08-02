import { educationalUsers, professionalUsers, notices as educationalNotices, courses as seedCourses, assignments as seedAssignments, teams as seedTeams, projects as seedProjects } from '../seed/data.js';
import { getDBStatus } from './db.js';
import { NODE_ENV } from './config.js';

const professionalAnnouncements = [
  {
    _id: 'demo-announcement-1',
    title: 'Quarterly Planning Sync',
    body: 'Team leads should update project milestones before Friday evening.',
    pinned: true,
    author: 'Operations Lead',
    workspaceType: 'professional',
    createdAt: new Date('2026-04-01T09:00:00Z').toISOString(),
  },
  {
    _id: 'demo-announcement-2',
    title: 'Design System Refresh',
    body: 'Shared component guidelines have been updated for the next sprint.',
    pinned: false,
    author: 'Design Ops',
    workspaceType: 'professional',
    createdAt: new Date('2026-04-02T11:30:00Z').toISOString(),
  },
];

const demoDirectMessages = [];

function serializeUser(user) {
  return {
    ...user,
    _id: String(user._id),
    passwordHash: undefined,
  };
}

export function getDemoDirectMessages(currentUserId, otherUserId, limit = 50) {
  const me = String(currentUserId);
  const other = String(otherUserId);
  return demoDirectMessages
    .filter((message) => {
      const from = String(message.from?._id || message.from || '');
      const to = String(message.toUser || '');
      return (from === me && to === other) || (from === other && to === me);
    })
    .slice(-Math.min(Number(limit) || 50, 200));
}

export function createDemoDirectMessage({ fromUserId, toUserId, body }) {
  const sender = getDemoUsers().find((user) => String(user._id) === String(fromUserId));
  const message = {
    _id: `demo-message-${Date.now()}-${demoDirectMessages.length + 1}`,
    from: {
      _id: String(fromUserId),
      name: sender?.name || 'Demo User',
    },
    toUser: String(toUserId),
    body: String(body),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  demoDirectMessages.push(message);
  return message;
}

export function isDemoMode() {
  return NODE_ENV !== 'production' && getDBStatus().degraded;
}

export function getDemoUsers(workspaceType) {
  const allUsers = [...educationalUsers, ...professionalUsers].map(serializeUser);
  if (!workspaceType) return allUsers;
  return allUsers.filter((user) => user.workspaceType === workspaceType);
}

export function getDemoNotices(workspaceType) {
  const base = workspaceType === 'professional' ? professionalAnnouncements : educationalNotices;
  return base.map((item, index) => ({
    _id: item._id || `demo-notice-${workspaceType}-${index + 1}`,
    createdAt: item.createdAt || new Date(Date.now() - index * 3600_000).toISOString(),
    updatedAt: item.updatedAt || new Date(Date.now() - index * 1800_000).toISOString(),
    ...item,
  }));
}

export function getDemoCourses() {
  const students = getDemoUsers('educational').filter((user) => ['student', 'ta'].includes(user.role));
  return seedCourses.map((course, index) => ({
    _id: `demo-course-${course.code.toLowerCase()}`,
    ...course,
    description: course.description || `${course.name} workspace with learning materials and collaborative updates.`,
    students: students.map((student) => ({ _id: student._id, name: student.name, email: student.email })),
    createdAt: new Date(Date.now() - (index + 2) * 86400_000).toISOString(),
    updatedAt: new Date(Date.now() - index * 43200_000).toISOString(),
  }));
}

export function getDemoAssignments() {
  const courses = getDemoCourses();
  return seedAssignments.map((assignment, index) => {
    const course = courses.find((item) => item.code === assignment.courseCode) || null;
    return {
      _id: `demo-assignment-${index + 1}`,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      course: course ? { _id: course._id, name: course.name, code: course.code } : null,
      submissions: [],
      createdAt: new Date(Date.now() - (index + 1) * 86400_000).toISOString(),
      updatedAt: new Date(Date.now() - index * 43200_000).toISOString(),
    };
  });
}

export function getDemoGrades() {
  const users = getDemoUsers('educational');
  const student = users.find((user) => user.role === 'student');
  const assignments = getDemoAssignments();
  return assignments.map((assignment, index) => ({
    _id: `demo-grade-${index + 1}`,
    student: { _id: student?._id, name: student?.name || 'Student User' },
    assignment: { _id: assignment._id, title: assignment.title },
    course: assignment.course ? { _id: assignment.course._id, name: assignment.course.name } : null,
    score: index === 0 ? 'A' : 'A-',
    feedback: index === 0 ? 'Strong understanding of the concepts.' : 'Good work, add more detail in your explanation.',
    createdAt: new Date(Date.now() - index * 86400_000).toISOString(),
  }));
}

export function getDemoTeams() {
  const users = getDemoUsers('professional');
  return seedTeams.map((team, index) => ({
    _id: `demo-team-${index + 1}`,
    name: team.name,
    description: team.description,
    members: users.filter((user) => team.members.map(String).includes(String(user._id))),
    createdAt: new Date(Date.now() - (index + 1) * 86400_000).toISOString(),
  }));
}

export function getDemoProjects() {
  const users = getDemoUsers('professional');
  return seedProjects.map((project, index) => ({
    _id: `demo-project-${index + 1}`,
    name: project.name,
    description: project.description,
    members: users.filter((user) => project.members.map(String).includes(String(user._id))),
    tasks: (project.tasks || []).map((task, taskIndex) => ({
      _id: `demo-project-${index + 1}-task-${taskIndex + 1}`,
      ...task,
      assignee: task.assignee ? users.find((user) => String(user._id) === String(task.assignee))?._id || task.assignee : null,
    })),
    createdAt: new Date(Date.now() - (index + 1) * 172800_000).toISOString(),
    updatedAt: new Date(Date.now() - index * 86400_000).toISOString(),
  }));
}

export function getDemoNotifications(userId) {
  return [
    {
      _id: 'demo-notification-1',
      user: userId,
      title: 'Welcome to demo mode',
      body: 'MongoDB is offline, so the app is serving seeded demo data.',
      type: 'announcement',
      link: '/dashboard',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getDemoComplaints(userId, all = false) {
  const items = [
    {
      _id: 'demo-complaint-1',
      user: userId,
      body: 'Need clearer guidance for project milestone reviews.',
      anonymous: false,
      status: 'review',
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
    },
    {
      _id: 'demo-complaint-2',
      user: null,
      body: 'Calendar reminders should be visible in the dashboard timeline.',
      anonymous: true,
      status: 'open',
      createdAt: new Date(Date.now() - 43200_000).toISOString(),
    },
  ];

  return all ? items : items.filter((item) => !item.anonymous && item.user === userId);
}

export function getDemoCalendarItems() {
  return getDemoAssignments().map((assignment) => ({
    _id: assignment._id,
    title: `(Due) ${assignment.title}`,
    start: assignment.dueDate,
    end: assignment.dueDate,
    allDay: true,
    type: 'assignment',
    link: `/assignments/${assignment._id}`,
  }));
}

export function getDemoAnalytics() {
  const courses = getDemoCourses();
  const students = getDemoUsers('educational').filter((user) => user.role === 'student');
  const grades = getDemoGrades();

  return {
    totalCourses: courses.length,
    totalStudents: students.length,
    totalGrades: grades.length,
    enrollmentPerCourse: courses.map((course) => ({
      _id: course._id,
      name: course.name,
      code: course.code,
      studentCount: course.students.length,
    })),
    gradeDistribution: grades.reduce((acc, grade) => {
      const key = String(grade.score).charAt(0).toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  };
}

export function getDemoSearchResults(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) {
    return { users: [], courses: [], assignments: [], projects: [], notices: [] };
  }

  const match = (value) => String(value || '').toLowerCase().includes(q);

  return {
    users: getDemoUsers().filter((item) => match(item.name) || match(item.email)).slice(0, 5),
    courses: getDemoCourses().filter((item) => match(item.name) || match(item.code)).slice(0, 5),
    assignments: getDemoAssignments().filter((item) => match(item.title) || match(item.description)).slice(0, 5),
    projects: getDemoProjects().filter((item) => match(item.name) || match(item.description)).slice(0, 5),
    notices: [...getDemoNotices('educational'), ...getDemoNotices('professional')]
      .filter((item) => match(item.title) || match(item.body))
      .slice(0, 5),
  };
}

export function getDemoRecentThreads(userId) {
  const users = getDemoUsers().filter((user) => user._id !== userId).slice(0, 3);
  return users.map((user, index) => ({
    user: { _id: user._id, name: user.name, email: user.email },
    lastMessage: index === 0 ? 'Shared the latest update with your workspace.' : 'Following up on the demo workspace tasks.',
    lastAt: new Date(Date.now() - (index + 1) * 7200_000).toISOString(),
  }));
}

export function getDemoTeamPerformance(teamId) {
  const team = getDemoTeams().find((item) => item._id === teamId);
  const projects = getDemoProjects();
  if (!team) return [];

  return team.members.map((member) => {
    const taskCounts = { todo: 0, 'in-progress': 0, done: 0 };
    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (String(task.assignee) === String(member._id) && taskCounts[task.status] !== undefined) {
          taskCounts[task.status] += 1;
        }
      });
    });
    return {
      memberId: member._id,
      memberName: member.name,
      taskCounts,
      totalTasks: taskCounts.todo + taskCounts['in-progress'] + taskCounts.done,
    };
  });
}
