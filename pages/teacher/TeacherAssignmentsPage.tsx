import React, { useState, useEffect } from 'react';
import { SetView, Assignment, Course, User, Submission } from '../../types';
import { MOCK_COURSES } from '../../data/courses';
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS } from '../../data/assignments';
import { MOCK_USERS } from '../../data/users';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ChevronLeftIcon, PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

interface TeacherAssignmentsPageProps {
  courseId: number;
  setView: SetView;
}

const AssignmentFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Assignment, 'id' | 'courseId'>) => void;
  assignment: Assignment | null;
}> = ({ isOpen, onClose, onSave, assignment }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    React.useEffect(() => {
        if(isOpen) {
            if(assignment) {
                setTitle(assignment.title);
                setDescription(assignment.description || '');
                // Format for datetime-local input which expects YYYY-MM-DDTHH:mm
                setDueDate(assignment.dueDate ? new Date(new Date(assignment.dueDate).getTime() - new Date(assignment.dueDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');
            } else {
                setTitle('');
                setDescription('');
                setDueDate('');
            }
        }
    }, [assignment, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, dueDate: new Date(dueDate).toISOString() });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={assignment ? 'Edit Assignment' : 'Add New Assignment'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="asg-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Title</label>
                    <input id="asg-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                <div>
                    <label htmlFor="asg-desc" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description (Optional)</label>
                    <textarea id="asg-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="asg-due" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Due Date</label>
                    <input id="asg-due" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Assignment</Button>
                </div>
            </form>
        </Modal>
    );
};

const ViewSubmissionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  course: Course;
  onGrade: (submission: Submission, student: User) => void;
}> = ({ isOpen, onClose, assignment, course, onGrade }) => {
  if (!isOpen || !assignment) return null;

  const students = MOCK_USERS.filter(u => course.students.includes(u.id));
  const submissions = MOCK_SUBMISSIONS.filter(s => s.assignmentId === assignment.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submissions for: ${assignment.title}`}>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {students.length > 0 ? students.map(student => {
          const submission = submissions.find(s => s.studentId === student.id);

          const getStatus = () => {
             if (submission?.grade !== null && submission?.grade !== undefined) {
              return <Badge color="green">Graded ({submission.grade}%)</Badge>;
            }
            if (submission) {
              return <Badge color="primary">Submitted</Badge>;
            }
            return <Badge color="secondary">Not Submitted</Badge>;
          };
          
          const handleGradeClick = () => {
              const submissionToGrade = submission || {
                  id: Date.now() + Math.random(),
                  assignmentId: assignment.id,
                  studentId: student.id,
                  submittedAt: '', // No submission yet
                  grade: null,
                  feedback: '',
              };
              onGrade(submissionToGrade, student);
          };

          return (
            <div key={student.id} className="flex items-center justify-between p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center">
                <Avatar src={student.avatar} alt={student.name} size="sm" />
                <div className="ml-3">
                  <p className="font-semibold">{student.name}</p>
                  <div className="mt-1">{getStatus()}</div>
                </div>
              </div>
              <Button size="sm" onClick={handleGradeClick}>
                {submission?.grade !== null && submission?.grade !== undefined ? 'Edit Grade' : 'Grade'}
              </Button>
            </div>
          );
        }) : <p className="text-center text-secondary-500 py-8">No students are enrolled in this course.</p>}
      </div>
    </Modal>
  );
};

const GradeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (submission: Submission) => void;
  gradingInfo: { submission: Submission; student: User } | null;
}> = ({ isOpen, onClose, onSave, gradingInfo }) => {
  const [grade, setGrade] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (gradingInfo) {
      setGrade(gradingInfo.submission.grade?.toString() || '');
      setFeedback(gradingInfo.submission.feedback || '');
    }
  }, [gradingInfo]);

  if (!gradingInfo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradeValue = grade.trim() === '' ? null : parseInt(grade, 10);
    // Add a submission date if it's the first time grading
    const submittedAt = gradingInfo.submission.submittedAt || new Date().toISOString();
    onSave({ ...gradingInfo.submission, grade: gradeValue, feedback, submittedAt });
  };
  
  const assignmentTitle = MOCK_ASSIGNMENTS.find(a => a.id === gradingInfo.submission.assignmentId)?.title || '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Grade: ${assignmentTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg mb-4">
            <Avatar src={gradingInfo.student.avatar} alt={gradingInfo.student.name} size="md" />
            <div className="ml-4">
                <p className="text-sm text-secondary-500">Grading submission for:</p>
                <p className="text-xl font-bold text-secondary-800 dark:text-secondary-200">{gradingInfo.student.name}</p>
            </div>
        </div>
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

const TeacherAssignmentsPage: React.FC<TeacherAssignmentsPageProps> = ({ courseId, setView }) => {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS.filter(a => a.courseId === courseId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [gradingInfo, setGradingInfo] = useState<{ submission: Submission, student: User } | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<number | null>(null);

  if (!course) {
    return <div>Course not found.</div>;
  }

  const handleAddNew = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };
  
  const handleOpenDeleteConfirm = (assignmentId: number) => {
    setAssignmentToDelete(assignmentId);
    setConfirmModalOpen(true);
  };

  const handleDelete = () => {
    if (assignmentToDelete === null) return;
    
    const updatedAssignments = assignments.filter(a => a.id !== assignmentToDelete);
    setAssignments(updatedAssignments);
    // Also update the mock data source
    const assignmentIndex = MOCK_ASSIGNMENTS.findIndex(a => a.id === assignmentToDelete);
    if (assignmentIndex !== -1) {
      MOCK_ASSIGNMENTS.splice(assignmentIndex, 1);
    }
    setConfirmModalOpen(false);
    setAssignmentToDelete(null);
  };

  const handleSave = (formData: Omit<Assignment, 'id' | 'courseId'>) => {
    if (editingAssignment) {
      const updatedAssignment = { ...editingAssignment, ...formData };
      const updatedAssignments = assignments.map(a => a.id === editingAssignment.id ? updatedAssignment : a);
      setAssignments(updatedAssignments);

      const assignmentIndex = MOCK_ASSIGNMENTS.findIndex(a => a.id === editingAssignment.id);
      if (assignmentIndex !== -1) {
        MOCK_ASSIGNMENTS[assignmentIndex] = updatedAssignment;
      }
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        courseId: courseId,
        ...formData,
      };
      const updatedAssignments = [...assignments, newAssignment];
      setAssignments(updatedAssignments);
      MOCK_ASSIGNMENTS.push(newAssignment);
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
  };
  
  const handleOpenSubmissions = (assignment: Assignment) => {
    setViewingAssignment(assignment);
  };

  const handleGradeSubmission = (submission: Submission, student: User) => {
    setGradingInfo({ submission, student });
    setViewingAssignment(null); // Close the submissions modal
  };

  const handleSaveGrade = (updatedSubmission: Submission) => {
    const existingIndex = MOCK_SUBMISSIONS.findIndex(s => s.studentId === updatedSubmission.studentId && s.assignmentId === updatedSubmission.assignmentId);
    
    if (existingIndex > -1) {
        MOCK_SUBMISSIONS[existingIndex] = updatedSubmission;
    } else {
        MOCK_SUBMISSIONS.push({ ...updatedSubmission, id: Date.now() });
    }
    setAssignments(assignments => [...assignments]); // Force re-render of parent component to reflect new submission data
    setGradingInfo(null); // Close the grading modal
  };


  return (
    <div className="space-y-6">
      <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
        <ChevronLeftIcon className="h-4 w-4 mr-1"/>
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Manage Assignments</h1>
            <p className="text-secondary-500">{course.title}</p>
        </div>
        <Button onClick={handleAddNew}><PlusIcon className="h-5 w-5 mr-2"/> Add New Assignment</Button>
      </div>

      <Card>
        <div className="space-y-4 p-4">
            {assignments.length > 0 ? (
                assignments.map(assignment => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                        <div>
                            <p className="font-bold text-lg">{assignment.title}</p>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">{assignment.description}</p>
                            <p className="text-sm text-secondary-500 mt-1">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0 ml-4">
                            <Button size="sm" variant="secondary" onClick={() => handleOpenSubmissions(assignment)}>View Submissions</Button>
                            <Button size="sm" variant="secondary" onClick={() => handleEdit(assignment)} aria-label="Edit"><PencilIcon className="h-4 w-4"/></Button>
                            <Button size="sm" variant="danger" onClick={() => handleOpenDeleteConfirm(assignment.id)} aria-label="Delete"><TrashIcon className="h-4 w-4"/></Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-secondary-500 py-8">No assignments created for this course yet.</p>
            )}
        </div>
      </Card>
      
      <AssignmentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        assignment={editingAssignment}
      />
      <ViewSubmissionsModal
        isOpen={!!viewingAssignment}
        onClose={() => setViewingAssignment(null)}
        assignment={viewingAssignment}
        course={course}
        onGrade={handleGradeSubmission}
      />
      <GradeModal
        isOpen={!!gradingInfo}
        onClose={() => setGradingInfo(null)}
        onSave={handleSaveGrade}
        gradingInfo={gradingInfo}
      />
       <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This will also remove all student submissions."
        confirmText="Delete"
      />
    </div>
  );
};

export default TeacherAssignmentsPage;
