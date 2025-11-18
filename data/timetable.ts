
import { ClassTimeTable, TimeTableEntry } from '../types';

export const MOCK_TIMETABLE: ClassTimeTable[] = [
  {
    className: 'Grade 10',
    section: 'A',
    schedule: [
      { day: 'Monday', time: '09:00 - 10:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
      { day: 'Monday', time: '10:00 - 11:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
      { day: 'Monday', time: '11:00 - 12:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
      { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
      { day: 'Tuesday', time: '11:00 - 12:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
      { day: 'Wednesday', time: '10:00 - 11:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
      { day: 'Thursday', time: '09:00 - 10:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
      { day: 'Thursday', time: '10:00 - 11:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
      { day: 'Friday', time: '11:00 - 12:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
    ]
  },
  {
    className: 'Grade 10',
    section: 'B',
    schedule: [
      { day: 'Monday', time: '09:00 - 10:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
      { day: 'Monday', time: '10:00 - 11:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
      { day: 'Tuesday', time: '10:00 - 11:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
      { day: 'Wednesday', time: '09:00 - 10:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: '101' },
      { day: 'Wednesday', time: '11:00 - 12:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
      { day: 'Friday', time: '09:00 - 10:00', subject: 'World History', teacher: 'Mr. David Chen', room: '201' },
    ]
  },
  {
    className: 'Grade 11',
    section: 'A',
    schedule: [
      { day: 'Monday', time: '13:00 - 14:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
      { day: 'Tuesday', time: '14:00 - 15:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
      { day: 'Thursday', time: '13:00 - 14:00', subject: 'Calculus I', teacher: 'Mr. David Chen', room: '102' },
    ]
  }
];
