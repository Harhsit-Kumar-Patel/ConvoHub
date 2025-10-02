// --- EDUCATIONAL DATA ---
export const educationalUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'student',
    workspaceType: 'educational',
    program: 'Computer Science',
    batch: '2025',
  },
  {
    name: 'Bob Lee',
    email: 'bob@example.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'student',
    workspaceType: 'educational',
    program: 'Information Technology',
    batch: '2025',
  },
  // India-focused students
  { name: 'Aarav Sharma', email: 'aarav.sharma@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Computer Science', batch: '2026' },
  { name: 'Diya Patel', email: 'diya.patel@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Electronics', batch: '2026' },
  { name: 'Ishaan Gupta', email: 'ishaan.gupta@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Information Technology', batch: '2025' },
  { name: 'Kavya Nair', email: 'kavya.nair@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Mechanical', batch: '2027' },
  { name: 'Rohan Verma', email: 'rohan.verma@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Civil', batch: '2025' },
  { name: 'Sneha Iyer', email: 'sneha.iyer@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Computer Science', batch: '2026' },
  { name: 'Yash Singh', email: 'yash.singh@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'AI & DS', batch: '2027' },
  { name: 'Meera Reddy', email: 'meera.reddy@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Mathematics', batch: '2025' },
  { name: 'Arjun Mishra', email: 'arjun.mishra@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Physics', batch: '2026' },
  { name: 'Nisha Kulkarni', email: 'nisha.kulkarni@uni.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'student', workspaceType: 'educational', program: 'Biotech', batch: '2027' },
];

export const cohorts = [
  { name: 'CS 2025', code: 'CS2025', description: 'IIT Delhi - Computer Science 2025' },
  { name: 'IT 2026', code: 'IT2026', description: 'IIIT Hyderabad - IT 2026' },
  { name: 'ECE 2026', code: 'ECE2026', description: 'NIT Trichy - Electronics 2026' },
  { name: 'ME 2027', code: 'ME2027', description: 'IIT Bombay - Mechanical 2027' },
  { name: 'AI&DS 2027', code: 'AIDS2027', description: 'IISc Bangalore - AI & Data Science 2027' },
  { name: 'CIVIL 2025', code: 'CIV2025', description: 'IIT Roorkee - Civil 2025' },
];

export const courses = [
  { name: 'Data Structures', code: 'CS201', instructor: 'Prof. S. Rao' },
  { name: 'Algorithms', code: 'CS301', instructor: 'Dr. P. Kumar' },
  { name: 'Operating Systems', code: 'CS210', instructor: 'Prof. R. Banerjee' },
  { name: 'Database Systems', code: 'CS220', instructor: 'Dr. N. Iyer' },
  { name: 'Computer Networks', code: 'CS230', instructor: 'Prof. V. Reddy' },
  { name: 'Web Development', code: 'IT305', instructor: 'Prof. A. Mehta' },
  { name: 'Machine Learning', code: 'AIDS310', instructor: 'Dr. G. Kulkarni' },
  { name: 'Digital Signal Processing', code: 'ECE340', instructor: 'Prof. T. Chandrasekhar' },
];

export const notices = [
  { title: 'Mid-sem Exams Timetable (IST)', body: 'Mid-sems will be held from 10th–14th Oct. Centre: Main Academic Block.', pinned: true, author: 'Dean (Academics)' },
  { title: 'Tech Fest – Kshitij', body: 'Workshops on Robotics & AR/VR this weekend. Registration closes Friday 6 PM IST.' },
  { title: 'Hostel Mess Menu Update', body: 'South Indian special on Wednesday evenings at Hostel 7.' },
  { title: 'Placement Talk by TCS', body: 'Pre-placement talk on campus at LH-2, 5 PM IST.' },
  { title: 'IIT Sports Meet Trials', body: 'Cricket and Badminton trials on Sunday 7 AM at Main Ground.' },
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
  { title: 'Operating Systems: CPU Scheduling', description: 'Simulate Round Robin and SJF with Indian dataset of processes.', dueDate: new Date('2025-11-01T18:30:00Z') },
  { title: 'DBMS: Normalisation', description: 'Normalize an Aadhaar-like citizen DB upto BCNF.', dueDate: new Date('2025-11-05T18:30:00Z') },
  { title: 'Algorithms: Graphs', description: 'Implement Dijkstra for Indian Railways network subset.', dueDate: new Date('2025-11-08T18:30:00Z') },
];


// --- PROFESSIONAL DATA ---
export const professionalUsers = [
   {
    name: 'Charlie Brown',
    email: 'charlie@work.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'professional',
    workspaceType: 'professional',
    skills: ['Project Management', 'Agile'],
  },
   {
    name: 'Diana Prince',
    email: 'diana@work.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'professional',
    workspaceType: 'professional',
    skills: ['UX Design', 'Figma'],
  },
  // India-focused professionals
  { name: 'Rahul Mehta', email: 'rahul.mehta@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['Java', 'Spring Boot', 'Microservices'] },
  { name: 'Priya Singh', email: 'priya.singh@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['Product Management', 'Go-To-Market'] },
  { name: 'Anil Kumar', email: 'anil.kumar@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['DevOps', 'Kubernetes', 'AWS'] },
  { name: 'Neha Agarwal', email: 'neha.agarwal@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['Data Science', 'Python', 'NLP'] },
  { name: 'Sanjay Rao', email: 'sanjay.rao@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['Frontend', 'React', 'TypeScript'] },
  { name: 'Aisha Khan', email: 'aisha.khan@corp.in', passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', role: 'professional', workspaceType: 'professional', skills: ['QA', 'Cypress', 'Playwright'] },
];

export const teams = [
    { name: 'Marketing (India)', description: 'Pan-India marketing campaigns across Tier-1 & Tier-2 cities.'},
    { name: 'Frontend Engineering', description: 'Building multilingual UI components (English/Hindi).' },
    { name: 'Platform Engineering', description: 'Infra for high-traffic Indian festive sales.' },
    { name: 'Sales – West', description: 'Mumbai, Pune, Ahmedabad enterprise accounts.' },
    { name: 'Sales – South', description: 'Bengaluru, Chennai, Hyderabad enterprise accounts.' },
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
  {
    name: 'UPI Integration',
    description: 'Add support for UPI (BHIM, PhonePe, GPay) in checkout.',
    tasks: [
      { title: 'NPCI certification', status: 'in-progress' },
      { title: 'Payment reconciliation dashboard', status: 'todo' },
    ],
  },
];