
import React from 'react';
import { SetView } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS } from '../data/assignments';
import { MOCK_COURSES } from '../data/courses';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { ChevronLeftIcon } from '../components/icons';

interface AssignmentsPageProps {
  setView: SetView;
}

const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ setView }) => {
  const { user } = useAuth();
  
  if (!user || !user.courseIds) return null;

  const myAssignments = MOCK_ASSIGNMENTS.filter(a => user.courseIds?.includes(a.courseId));
  
  return (
    <div className="space-y-6">
       <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to Dashboard
        </button>
      <h1 className="text-3xl font-bold">My Assignments</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Course</th>
              <th className="p-4 font-semibold">Due Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {myAssignments.map(assignment => {
              const submission = MOCK_SUBMISSIONS.find(s => s.assignmentId === assignment.id && s.studentId === user.id);
              const course = MOCK_COURSES.find(c => c.id === assignment.courseId);
              
              const getStatus = () => {
                if (submission) {
                  return submission.grade !== null ? <Badge color="green">Graded</Badge> : <Badge color="primary">Submitted</Badge>;
                }
                return new Date(assignment.dueDate) < new Date() ? <Badge color="red">Overdue</Badge> : <Badge color="yellow">Pending</Badge>;
              };

              return (
                <tr key={assignment.id} className="border-b border-secondary-200 dark:border-secondary-700">
                  <td className="p-4 font-medium">{assignment.title}</td>
                  <td className="p-4 text-secondary-600 dark:text-secondary-400">{course?.title}</td>
                  <td className="p-4 text-secondary-600 dark:text-secondary-400">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                  <td className="p-4">{getStatus()}</td>
                  <td className="p-4 font-bold">{submission?.grade !== null ? `${submission?.grade}%` : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AssignmentsPage;
