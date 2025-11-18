
import React, { useState, useMemo, useEffect } from 'react';
import { SetView, Role, Submission, Course, Assignment, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_COURSES } from '../data/courses';
import { MOCK_ASSIGNMENTS } from '../data/assignments';
import { MOCK_SUBMISSIONS } from '../data/assignments';
import { MOCK_USERS } from '../data/users';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { ChevronLeftIcon } from '../components/icons';

interface GradebookPageProps {
  courseId?: number;
  setView: SetView;
}

const GradeSubmissionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (submission: Submission) => void;
  submissionData: Submission;
  studentName: string;
  assignmentTitle: string;
}> = ({ isOpen, onClose, onSave, submissionData, studentName, assignmentTitle }) => {
  const [grade, setGrade] = useState<string>(submissionData.grade?.toString() || '');
  const [feedback, setFeedback] = useState<string>(submissionData.feedback || '');

  useEffect(() => {
    if (submissionData) {
      setGrade(submissionData.grade?.toString() || '');
      setFeedback(submissionData.feedback || '');
    }
  }, [submissionData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradeValue = grade.trim() === '' ? null : parseInt(grade, 10);
    onSave({ ...submissionData, grade: gradeValue, feedback });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Grade: ${assignmentTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-lg font-semibold text-secondary-700 dark:text-secondary-300">Student: {studentName}</p>
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Grade (out of 100)</label>
          <input
            id="grade"
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500"
            placeholder="Provide constructive feedback..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Grade</Button>
        </div>
      </form>
    </Modal>
  );
};


const TeacherGradebook: React.FC<{ courseId: number, setView: SetView }> = ({ courseId, setView }) => {
  const [course] = useState<Course | undefined>(MOCK_COURSES.find(c => c.id === courseId));
  const [assignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS.filter(a => a.courseId === courseId));
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS.filter(s => assignments.map(a => a.id).includes(s.assignmentId)));
  
  const [students] = useState<User[]>(MOCK_USERS.filter(u => course?.students.includes(u.id)));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleOpenModal = (studentId: string, assignmentId: string) => {
    let submission = submissions.find(s => s.studentId === studentId && s.assignmentId === parseInt(assignmentId, 10));
    if (!submission) {
      submission = {
        id: Date.now() + Math.random(), // Temp ID for new submission
        studentId,
        assignmentId: parseInt(assignmentId, 10),
        submittedAt: new Date().toISOString(),
        grade: null,
        feedback: '',
      };
    }
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleSaveGrade = (updatedSubmission: Submission) => {
    const existingIndex = MOCK_SUBMISSIONS.findIndex(s => s.id === updatedSubmission.id);
    if (existingIndex > -1) {
      MOCK_SUBMISSIONS[existingIndex] = updatedSubmission;
    } else {
      MOCK_SUBMISSIONS.push(updatedSubmission);
    }
    setSubmissions(MOCK_SUBMISSIONS.filter(s => assignments.map(a => a.id).includes(s.assignmentId)))
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const studentAverages = useMemo(() => {
    return students.map(student => {
        const studentSubmissions = submissions.filter(s => s.studentId === student.id && s.grade !== null);
        if (studentSubmissions.length === 0) return { studentId: student.id, average: null };
        const total = studentSubmissions.reduce((acc, sub) => acc + (sub.grade || 0), 0);
        return { studentId: student.id, average: Math.round(total / studentSubmissions.length) };
    });
  }, [students, submissions]);
  
  const assignmentAverages = useMemo(() => {
    return assignments.map(assignment => {
        const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id && s.grade !== null);
        if (assignmentSubmissions.length === 0) return { assignmentId: assignment.id, average: null };
        const total = assignmentSubmissions.reduce((acc, sub) => acc + (sub.grade || 0), 0);
        return { assignmentId: assignment.id, average: Math.round(total / assignmentSubmissions.length) };
    });
  }, [assignments, submissions]);

  if (!course) return <div>Course not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
        <ChevronLeftIcon className="h-4 w-4 mr-1"/>
        Back to Dashboard
      </button>
      <div>
        <h1 className="text-3xl font-bold">Gradebook</h1>
        <p className="text-secondary-500">{course.title}</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              <th className="p-4 font-semibold sticky left-0 bg-secondary-50 dark:bg-secondary-800">Student Name</th>
              {assignments.map(a => <th key={a.id} className="p-4 font-semibold text-center">{a.title}</th>)}
              <th className="p-4 font-semibold text-center">Overall</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const studentAverage = studentAverages.find(sa => sa.studentId === student.id)?.average;
              return (
                <tr key={student.id} className="border-b border-secondary-200 dark:border-secondary-700">
                  <td className="p-4 sticky left-0 bg-white dark:bg-secondary-800">
                    <div className="flex items-center">
                        <Avatar src={student.avatar} alt={student.name} size="sm" />
                        <span className="ml-3 font-medium">{student.name}</span>
                    </div>
                  </td>
                  {assignments.map(assignment => {
                    const submission = submissions.find(s => s.studentId === student.id && s.assignmentId === assignment.id);
                    return (
                      <td key={assignment.id} className="p-4 text-center">
                        <button onClick={() => handleOpenModal(student.id, assignment.id.toString())} className="w-full h-full p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700">
                          {submission?.grade !== null && submission?.grade !== undefined ? (
                            <span className="font-bold text-lg">{submission.grade}</span>
                          ) : submission ? (
                            <Badge color="primary">Submitted</Badge>
                          ) : (
                            <span className="text-secondary-400">-</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-4 text-center font-bold text-lg">
                    {studentAverage !== null ? `${studentAverage}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
           <tfoot>
                <tr className="bg-secondary-100 dark:bg-secondary-900 font-bold">
                    <td className="p-4 sticky left-0 bg-secondary-100 dark:bg-secondary-900">Class Average</td>
                    {assignments.map(assignment => {
                        const avg = assignmentAverages.find(a => a.assignmentId === assignment.id)?.average;
                        return (
                            <td key={assignment.id} className="p-4 text-center">
                                {avg !== null ? `${avg}%` : '-'}
                            </td>
                        )
                    })}
                    <td className="p-4"></td>
                </tr>
           </tfoot>
        </table>
      </Card>
      
      {selectedSubmission && (
        <GradeSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGrade}
          submissionData={selectedSubmission}
          studentName={MOCK_USERS.find(u => u.id === selectedSubmission.studentId)?.name || ''}
          assignmentTitle={MOCK_ASSIGNMENTS.find(a => a.id === selectedSubmission.assignmentId)?.title || ''}
        />
      )}
    </div>
  );
};


const StudentGradebook: React.FC<{ setView: SetView }> = ({ setView }) => {
    const { user } = useAuth();
    const enrolledCourses = MOCK_COURSES.filter(c => user?.courseIds?.includes(c.id));

    const gradesByCourse = useMemo(() => {
        return enrolledCourses.map(course => {
            const courseAssignments = MOCK_ASSIGNMENTS.filter(a => a.courseId === course.id);
            const courseSubmissions = MOCK_SUBMISSIONS.filter(s => courseAssignments.map(a => a.id).includes(s.assignmentId));

            const assignmentsWithGrades = courseAssignments.map(assignment => {
                const submission = courseSubmissions.find(s => s.assignmentId === assignment.id && s.studentId === user!.id);
                const allSubmissionsForAssignment = courseSubmissions.filter(s => s.assignmentId === assignment.id && s.grade !== null);
                let classAverage = null;
                if(allSubmissionsForAssignment.length > 0) {
                    const total = allSubmissionsForAssignment.reduce((acc, s) => acc + (s.grade || 0), 0);
                    classAverage = Math.round(total / allSubmissionsForAssignment.length);
                }
                
                return {
                    ...assignment,
                    submission,
                    classAverage
                };
            });
            return {
                ...course,
                assignmentsWithGrades
            };
        });
    }, [enrolledCourses, user]);
    

  return (
    <div className="space-y-8">
        <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to Dashboard
        </button>
      <h1 className="text-3xl font-bold">My Grades</h1>
      {gradesByCourse.map(course => (
          <div key={course.id}>
              <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
              <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-secondary-50 dark:bg-secondary-800">
                        <tr>
                            <th className="p-4 font-semibold">Assignment</th>
                            <th className="p-4 font-semibold">Due Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Grade</th>
                            <th className="p-4 font-semibold">Class Avg.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.assignmentsWithGrades.map(({ submission, classAverage, ...assignment}) => {
                            const getStatus = () => {
                                if (submission) {
                                  return submission.grade !== null ? <Badge color="green">Graded</Badge> : <Badge color="primary">Submitted</Badge>;
                                }
                                return new Date(assignment.dueDate) < new Date() ? <Badge color="red">Overdue</Badge> : <Badge color="yellow">Pending</Badge>;
                            };

                            return (
                                <tr key={assignment.id} className="border-b border-secondary-200 dark:border-secondary-700">
                                    <td className="p-4 font-medium">{assignment.title}</td>
                                    <td className="p-4">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                    <td className="p-4">{getStatus()}</td>
                                    <td className="p-4 font-bold text-lg">{submission?.grade !== null && submission?.grade !== undefined ? `${submission.grade}%` : 'N/A'}</td>
                                    <td className="p-4 text-secondary-600 dark:text-secondary-400">{classAverage !== null ? `${classAverage}%` : 'N/A'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
              </Card>
          </div>
      ))}
    </div>
  );
};


const GradebookPage: React.FC<GradebookPageProps> = ({ courseId, setView }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  if (user.role === Role.TEACHER) {
    if (!courseId) {
      return (
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">Gradebook</h1>
          <p className="text-secondary-500">Please select a course from your dashboard to view its gradebook.</p>
          <Button onClick={() => setView({ type: 'dashboard' })}>Back to Dashboard</Button>
        </div>
      );
    }
    return <TeacherGradebook courseId={courseId} setView={setView} />;
  }
  
  if (user.role === Role.STUDENT) {
    return <StudentGradebook setView={setView} />;
  }

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold">Gradebook</h1>
      <p className="text-secondary-500">The gradebook is not available for your role.</p>
      <Button onClick={() => setView({ type: 'dashboard' })}>Back to Dashboard</Button>
    </div>
  );
};

export default GradebookPage;
