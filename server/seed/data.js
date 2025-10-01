export const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'admin',
    workspaceType: 'educational', // Added field
    skills: ['JS', 'React'],
    program: 'CS',
    batch: '2025',
    links: { github: 'https://github.com/alice' },
  },
  {
    name: 'Bob Lee',
    email: 'bob@example.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'student',
    workspaceType: 'educational', // Added field
    skills: ['Node', 'MongoDB'],
    program: 'IT',
    batch: '2025',
  },
   {
    name: 'Charlie Brown',
    email: 'charlie@work.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS',
    role: 'professional',
    workspaceType: 'professional', // Added field
    skills: ['Project Management', 'Agile'],
  },
];

export const cohorts = [
  { name: 'Cohort Alpha', code: 'ALPHA25', description: 'Alpha 2025 batch' },
  { name: 'Cohort Beta', code: 'BETA25', description: 'Beta 2025 batch' },
];

export const notices = [
  { title: 'Welcome to ConvoHub', body: 'This is a sample notice for all students.', pinned: true, author: 'Admin' },
  { title: 'Exam Schedule', body: 'Midterms start next Monday. Good luck!' },
];

export const assignments = [
  {
    title: 'Calculus I: Problem Set 3',
    description: 'Complete all questions from Chapter 4 regarding derivatives.',
    dueDate: new Date('2025-10-15T23:59:59Z'),
  },
  {
    title: 'History Essay: The Roman Empire',
    description: 'A 1500-word essay on the fall of the Western Roman Empire.',
    dueDate: new Date('2025-10-22T23:59:59Z'),
  },
];

export const projects = [
  {
    name: 'Q4 Marketing Campaign',
    description: 'Launch campaign for the new "Fusion" product line.',
    tasks: [
      { title: 'Finalize ad copy', status: 'in-progress' },
      { title: 'Approve budget', status: 'done' },
      { title: 'Schedule social media posts', status: 'todo' },
    ]
  },
  {
    name: 'Website Redesign',
    description: 'Overhaul the corporate website with the new branding.',
    tasks: [
      { title: 'Create wireframes', status: 'done' },
      { title: 'Develop homepage component', status: 'in-progress' },
    ]
  },
];