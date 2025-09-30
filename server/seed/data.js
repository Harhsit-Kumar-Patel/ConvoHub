export const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: '$2a$10$2qGv9nKjYv1p7Z0wzVYbUu0KQb3sCzqX3r9Gm2oYzT1A1S5w1u8pS', // 'password' placeholder
    role: 'admin',
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
    skills: ['Node', 'MongoDB'],
    program: 'IT',
    batch: '2025',
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
