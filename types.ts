
export enum Role {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  schoolId: string;
  contact?: string;
  gradeLevel?: number; // e.g., 9, 10, 11, 12
  courseIds?: number[]; // For students
}

export interface CourseMaterial {
  id: number;
  type: 'video' | 'document' | 'slides';
  title: string;
  url: string;
  content?: string[]; // For slides, array of image URLs/base64
}

export interface Announcement {
  id: number;
  courseId: number;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
}

export interface Course {
  id: number;
  title: string; // e.g., 'Physics', 'World History'
  description: string;
  className: string; // e.g., 'Grade 10'
  section: string; // e.g., 'A', 'B'
  creatorId?: string; // User who created it
  teacherIds: string[];
  materials: CourseMaterial[];
  students: string[]; // array of student ids
  announcements: Announcement[];
}

export interface Assignment {
  id: number;
  courseId: number;
  title:string;
  description?: string;
  dueDate: string; // ISO string
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: string;
  submittedAt: string; // ISO string
  grade: number | null;
  feedback?: string;
}

export interface Fee {
  id: number;
  studentId: string;
  amount: number;
  description: string;
  dueDate: string; // ISO string
  paid: boolean;
}

export interface FeePayment {
  id: number;
  feeId: number;
  amount: number;
  paymentDate: string; // ISO string
  method: 'Credit Card' | 'Bank Transfer' | 'PayPal';
}

export interface TimeTableEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string; // e.g., '09:00 - 10:00'
  subject: string;
  teacher: string;
  room: string;
}

export interface ClassTimeTable {
  className: string; // e.g., 'Grade 10'
  section: string; // e.g., 'A'
  schedule: TimeTableEntry[];
}


// View state for navigation
export type View =
  | { type: 'dashboard' }
  | { type: 'profile' }
  | { type: 'course'; id: number }
  | { type: 'assignments' }
  | { type: 'gradebook'; courseId?: number }
  | { type: 'user-management' }
  | { type: 'course-management' }
  | { type: 'manage-assignments'; courseId: number }
  | { type: 'ai-tutor' }
  | { type: 'fees' };

export type SetView = (view: View) => void;