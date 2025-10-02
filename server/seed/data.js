// --- EDUCATIONAL DATA ---
export const educationalUsers = [
  // Test users for each role
  { name: 'Student User', email: 'student@edu.com', role: 'student', workspaceType: 'educational', program: 'Computer Science', batch: '2025' },
  { name: 'TA User', email: 'ta@edu.com', role: 'ta', workspaceType: 'educational', program: 'Computer Science', batch: '2025' },
  { name: 'Instructor User', email: 'instructor@edu.com', role: 'instructor', workspaceType: 'educational', program: 'Computer Science' },
  { name: 'Coordinator User', email: 'coordinator@edu.com', role: 'coordinator', workspaceType: 'educational' },
  { name: 'Principal User', email: 'principal@edu.com', role: 'principal', workspaceType: 'educational' },
  { name: 'Admin User', email: 'admin@edu.com', role: 'admin', workspaceType: 'educational' },
];

// --- PROFESSIONAL DATA ---
export const professionalUsers = [
   // Test users for each role
  { name: 'Member User', email: 'member@work.com', role: 'member', workspaceType: 'professional', skills: ['Team Collaboration'] },
  { name: 'Lead User', email: 'lead@work.com', role: 'lead', workspaceType: 'professional', skills: ['Agile', 'Task Management'] },
  { name: 'Manager User', email: 'manager@work.com', role: 'manager', workspaceType: 'professional', skills: ['Project Planning', 'Budgeting'] },
  { name: 'Org Admin User', email: 'orgadmin@work.com', role: 'org_admin', workspaceType: 'professional', skills: ['Administration'] },
  { name: 'Admin User', email: 'admin@work.com', role: 'admin', workspaceType: 'professional' },
];


export const cohorts = [
  { name: 'CS 2025', code: 'CS2025', description: 'IIT Delhi - Computer Science 2025' },
  { name: 'IT 2026', code: 'IT2026', description: 'IIIT Hyderabad - IT 2026' },
  { name: 'ECE 2026', code: 'ECE2026', description: 'NIT Trichy - Electronics 2026' },
];

export const courses = [
  { name: 'Data Structures', code: 'CS201', instructor: 'Prof. S. Rao' },
  { name: 'Algorithms', code: 'CS301', instructor: 'Dr. P. Kumar' },
  { name: 'Operating Systems', code: 'CS210', instructor: 'Prof. R. Banerjee' },
];

export const notices = [
  { title: 'Mid-sem Exams Timetable (IST)', body: 'Mid-sems will be held from 10th–14th Oct. Centre: Main Academic Block.', pinned: true, author: 'Dean (Academics)' },
  { title: 'Tech Fest – Kshitij', body: 'Workshops on Robotics & AR/VR this weekend. Registration closes Friday 6 PM IST.' },
];

export const assignments = [
  {
    title: 'Data Structures: Lab 3',
    description: 'Implement a binary search tree with inorder traversal metrics.',
    dueDate: new Date('2025-10-15T23:59:59Z'),
  },
  {
    title: 'Web Dev: Project Milestone 1',
    description: 'Submit wireframes, REST endpoints design and ER diagram (Indian e-gov service use case).',
    dueDate: new Date('2025-10-22T23:59:59Z'),
  },
];

export const teams = [
    { name: 'Marketing (India)', description: 'Pan-India marketing campaigns across Tier-1 & Tier-2 cities.'},
    { name: 'Frontend Engineering', description: 'Building multilingual UI components (English/Hindi).' },
];

export const projects = [
  {
    name: 'Diwali 2025 Campaign',
    description: 'Integrated festive campaign for North & West India with OTT + Outdoor.',
    tasks: [
      { title: 'Finalize Hindi/English ad copies', status: 'in-progress' },
      { title: 'City-wise outdoor plans (Mumbai/Delhi)', status: 'done' },
    ]
  },
  {
    name: 'Website Internationalization',
    description: 'Add i18n with Hindi and regional languages for Indian market.',
    tasks: [
      { title: 'Create wireframes', status: 'done' },
      { title: 'Add i18n keys for product pages', status: 'in-progress' },
    ]
  },
];