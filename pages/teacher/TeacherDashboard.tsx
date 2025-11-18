import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SetView, Course } from '../../types';
import { MOCK_COURSES } from '../../data/courses';
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS } from '../../data/assignments';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { BookOpenIcon, TrashIcon, EyeIcon, PencilIcon, ChevronLeftIcon } from '../../components/icons';
import Modal from '../../components/ui/Modal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

interface TeacherDashboardProps {
  setView: SetView;
}

const CourseCard: React.FC<{ course: Course, onSelect: (course: Course) => void }> = ({ course, onSelect }) => (
  <Card onClick={() => onSelect(course)} className="flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="bg-primary-500 p-4">
      <h3 className="text-xl font-bold text-white truncate">{course.title}</h3>
      <p className="text-sm text-primary-200">{course.className} - Section {course.section}</p>
    </div>
    <div className="p-4 flex-grow">
      <p className="text-secondary-600 dark:text-secondary-300 text-sm">{course.description}</p>
    </div>
    <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-200">{course.students.length} Students</p>
    </div>
  </Card>
);

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}> = ({ icon, title, onClick, variant = 'default' }) => {
  const baseClasses = 'p-6 text-center text-white flex flex-col items-center justify-center h-full';
  const variantClasses = {
    default: 'bg-primary-500 hover:bg-primary-600',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <Card onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
    </Card>
  );
};


const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setView }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  if (!user) return null;

  const taughtCourses = courses.filter(course =>
    course.teacherIds.includes(user.id) || course.creatorId === user.id
  );

  const taughtCourseIds = taughtCourses.map(c => c.id);
  const recentSubmissions = MOCK_SUBMISSIONS
    .filter(sub => MOCK_ASSIGNMENTS.find(a => a.id === sub.assignmentId && taughtCourseIds.includes(a.courseId)))
    .filter(sub => sub.grade === null) // Only show ungraded
    .slice(0, 5);

  const handleSaveNewClass = (newCourseData: { title: string; description: string; className: string, section: string }) => {
    const newCourse: Course = {
      id: Date.now(),
      title: newCourseData.title,
      description: newCourseData.description,
      className: newCourseData.className,
      section: newCourseData.section,
      creatorId: user.id,
      teacherIds: [user.id],
      materials: [],
      students: [],
      announcements: [],
    };
    MOCK_COURSES.push(newCourse);
    setCourses([...MOCK_COURSES]);
    setCreateModalOpen(false);
  };
  
  const handleOpenDeleteConfirm = (courseId: number) => {
    setCourseToDelete(courseId);
    setConfirmModalOpen(true);
  };
  
  const handleDeleteCourse = () => {
    if (courseToDelete === null) return;
    
    const updatedCourses = MOCK_COURSES.filter(c => c.id !== courseToDelete);
    MOCK_COURSES.length = 0; // Clear original array
    Array.prototype.push.apply(MOCK_COURSES, updatedCourses); // Push updated courses
    setCourses(updatedCourses);
    setConfirmModalOpen(false);
    setCourseToDelete(null);
    setSelectedCourse(null); // Go back to all classes view
  };

  if (selectedCourse) {
    const isCreator = user.id === selectedCourse.creatorId;
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to All Classes
        </button>
        <div className="text-center">
            <h1 className="text-4xl font-bold">{selectedCourse.title}</h1>
            <p className="text-secondary-500 mt-2 max-w-2xl mx-auto">{selectedCourse.className} - Section {selectedCourse.section}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <ActionCard icon={<EyeIcon/>} title="View Class Details" onClick={() => setView({type: 'course', id: selectedCourse.id})} />
            <ActionCard icon={<PencilIcon/>} title="Manage Assignments" onClick={() => setView({type: 'manage-assignments', courseId: selectedCourse.id})} />
            <ActionCard icon={<BookOpenIcon/>} title="Open Gradebook" onClick={() => setView({type: 'gradebook', courseId: selectedCourse.id})} />
            {isCreator && <ActionCard icon={<TrashIcon/>} title="Delete Class" onClick={() => handleOpenDeleteConfirm(selectedCourse.id)} variant="danger"/>}
        </div>
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleDeleteCourse}
          title="Delete Course"
          message="Are you sure you want to delete this class? This action cannot be undone."
          confirmText="Delete"
        />
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
      `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-secondary-500 mt-1">Here's your teaching overview for today.</p>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-primary-500" /> My Classes
          </h2>
          <Button onClick={() => setCreateModalOpen(true)}>Create New Class</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taughtCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onSelect={setSelectedCourse}
            />
          ))}
        </div>
        {taughtCourses.length === 0 && <p className="text-secondary-500">You are not assigned to any classes yet.</p>}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Needs Grading</h2>
        <Card className="p-4">
          <div className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map(sub => {
                const assignment = MOCK_ASSIGNMENTS.find(a => a.id === sub.assignmentId);
                const course = MOCK_COURSES.find(c => c.id === assignment?.courseId);
                return (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                    <div>
                      <p className="font-semibold">{assignment?.title}</p>
                      <p className="text-sm text-secondary-500">{course?.title}</p>
                    </div>
                    <Button size="sm" onClick={() => setView({ type: 'gradebook', courseId: course!.id })}>Grade</Button>
                  </div>
                );
              })
            ) : <p className="text-secondary-500 text-center p-4">No submissions need grading. You're all caught up!</p>}
          </div>
        </Card>
      </section>
      <CreateClassModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSaveNewClass}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message="Are you sure you want to delete this class? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

const CreateClassModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; className: string, section: string }) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, className, section });
    setTitle('');
    setDescription('');
    setClassName('');
    setSection('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Class">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="class-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Subject Title</label>
          <input id="class-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Physics" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="class-desc" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description</label>
          <textarea id="class-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Class</label>
              <input id="class-name" type="text" value={className} onChange={e => setClassName(e.target.value)} placeholder="e.g. Grade 10" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label htmlFor="class-section" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Section</label>
              <input id="class-section" type="text" value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. A" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
            </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Class</Button>
        </div>
      </form>
    </Modal>
  )
}


export default TeacherDashboard;
