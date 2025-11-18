import { Course } from '../types';

export let MOCK_COURSES: Course[] = [
  {
    id: 101,
    title: 'Physics',
    description: 'Explore the fundamental principles of classical mechanics, thermodynamics, and electromagnetism.',
    className: 'Grade 10',
    section: 'A',
    creatorId: 'teacher1',
    teacherIds: ['teacher1'],
    materials: [
      { id: 1, type: 'video', title: 'Lecture 1: Kinematics', url: '#' },
      { id: 2, type: 'document', title: 'Syllabus', url: '#' },
      { 
        id: 3, 
        type: 'slides', 
        title: 'Chapter 1 Slides', 
        url: '#',
        content: [
          'https://picsum.photos/seed/physics-slide1/800/600',
          'https://picsum.photos/seed/physics-slide2/800/600',
          'https://picsum.photos/seed/physics-slide3/800/600',
          'https://picsum.photos/seed/physics-slide4/800/600',
        ]
      },
    ],
    students: ['student1'],
    announcements: [
        { id: 1, courseId: 101, title: 'Welcome!', content: 'Welcome to Physics 101. Please review the syllabus.', date: '2024-09-01' }
    ]
  },
  {
    id: 102,
    title: 'World History',
    description: 'A survey of major world civilizations from prehistory to the medieval period.',
    className: 'Grade 10',
    section: 'B',
    creatorId: undefined,
    teacherIds: ['teacher2'],
    materials: [
        { id: 1, type: 'video', title: 'Lecture 1: Mesopotamia', url: '#' },
        { id: 2, type: 'document', title: 'Reading List', url: '#' },
    ],
    students: ['student1', 'student2'],
    announcements: [
        { id: 1, courseId: 102, title: 'Midterm Exam Schedule', content: 'The midterm will be on October 15th.', date: '2024-09-10' }
    ]
  },
  {
    id: 103,
    title: 'Calculus I',
    description: 'Introduction to differential and integral calculus.',
    className: 'Grade 11',
    section: 'A',
    creatorId: 'teacher1',
    teacherIds: ['teacher1', 'teacher2'],
    materials: [
        { id: 1, type: 'video', title: 'Lecture 1: Limits', url: '#' },
    ],
    students: ['student2'],
    announcements: []
  },
];
