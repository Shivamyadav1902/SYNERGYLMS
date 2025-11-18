import { Assignment, Submission } from '../types';

export let MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    courseId: 101,
    title: 'Physics Lab Report 1',
    description: 'Complete a full lab report on the kinematics experiment.',
    dueDate: '2024-09-15T23:59:59Z',
  },
  {
    id: 2,
    courseId: 101,
    title: 'Problem Set 1',
    description: 'Solve problems 1-10 from chapter 1 of the textbook.',
    dueDate: '2024-09-20T23:59:59Z',
  },
  {
    id: 3,
    courseId: 102,
    title: 'Essay: The Code of Hammurabi',
    description: 'Write a 5-page essay on the societal impact of the Code of Hammurabi.',
    dueDate: '2024-09-22T23:59:59Z',
  },
  {
    id: 4,
    courseId: 103,
    title: 'Calculus Worksheet 1',
    description: 'Complete the provided worksheet on limits and continuity.',
    dueDate: '2024-09-18T23:59:59Z',
  },
  {
    id: 5,
    courseId: 102,
    title: 'Map Quiz: Ancient Egypt',
    description: 'Label the major cities and geographical features of Ancient Egypt on the provided map.',
    dueDate: '2024-09-30T23:59:59Z',
  },
];

export let MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 'student1',
    submittedAt: '2024-09-14T18:30:00Z',
    grade: 95,
    feedback: 'Excellent work, Alex! Your analysis was spot on.',
  },
  {
    id: 2,
    assignmentId: 3,
    studentId: 'student1',
    submittedAt: '2024-09-21T10:00:00Z',
    grade: 85,
    feedback: 'Good essay, but try to expand more on the societal impact in your conclusion.',
  },
  {
    id: 3,
    assignmentId: 3,
    studentId: 'student2',
    submittedAt: '2024-09-20T14:00:00Z',
    grade: 88,
    feedback: 'Well-structured and clearly written. Great job, Maria.',
  },
  {
      id: 4,
      assignmentId: 4,
      studentId: 'student2',
      submittedAt: '2024-09-17T12:00:00Z',
      grade: 100,
      feedback: 'Perfect score! Keep up the great work.',
  }
];