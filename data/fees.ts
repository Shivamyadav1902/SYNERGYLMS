
import { Fee, FeePayment } from '../types';

export const MOCK_FEES: Fee[] = [
  {
    id: 1,
    studentId: 'student1',
    amount: 1500,
    description: 'Fall 2024 Tuition Fee',
    dueDate: '2024-09-01T23:59:59Z',
    paid: true,
  },
  {
    id: 2,
    studentId: 'student1',
    amount: 75,
    description: 'Physics Lab Fee',
    dueDate: '2024-09-10T23:59:59Z',
    paid: false,
  },
  {
    id: 3,
    studentId: 'student2',
    amount: 1500,
    description: 'Fall 2024 Tuition Fee',
    dueDate: '2024-09-01T23:59:59Z',
    paid: true,
  },
  {
    id: 4,
    studentId: 'student2',
    amount: 50,
    description: 'History Textbook Fee',
    dueDate: '2024-09-05T23:59:59Z',
    paid: true,
  },
];

export let MOCK_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 1,
    feeId: 1,
    amount: 1500,
    paymentDate: '2024-08-25T10:00:00Z',
    method: 'Credit Card',
  },
  {
    id: 2,
    feeId: 3,
    amount: 1500,
    paymentDate: '2024-08-28T14:30:00Z',
    method: 'Bank Transfer',
  },
  {
    id: 3,
    feeId: 4,
    amount: 50,
    paymentDate: '2024-09-01T09:00:00Z',
    method: 'Credit Card',
  }
];
