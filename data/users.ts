
import { User, Role } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'student1',
    name: 'Alex Johnson',
    email: 'alex.j@school.edu',
    role: Role.STUDENT,
    avatar: 'https://picsum.photos/seed/alex/200',
    schoolId: 'S-ALJ-001',
    contact: '123-456-7890',
    gradeLevel: 10,
    courseIds: [101, 102],
  },
  {
    id: 'student2',
    name: 'Maria Garcia',
    email: 'maria.g@school.edu',
    role: Role.STUDENT,
    avatar: 'https://picsum.photos/seed/maria/200',
    schoolId: 'S-MGA-002',
    contact: '234-567-8901',
    gradeLevel: 11,
    courseIds: [102, 103],
  },
  {
    id: 'teacher1',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@school.edu',
    role: Role.TEACHER,
    avatar: 'https://picsum.photos/seed/reed/200',
    schoolId: 'T-ERD-001',
    contact: '345-678-9012',
  },
  {
    id: 'teacher2',
    name: 'Mr. David Chen',
    email: 'd.chen@school.edu',
    role: Role.TEACHER,
    avatar: 'https://picsum.photos/seed/chen/200',
    schoolId: 'T-DCH-002',
    contact: '456-789-0123',
  },
  {
    id: 'admin1',
    name: 'Principal Thompson',
    email: 'admin@school.edu',
    role: Role.ADMIN,
    avatar: 'https://picsum.photos/seed/thompson/200',
    schoolId: 'A- PTH-001',
    contact: '567-890-1234',
  },
];
