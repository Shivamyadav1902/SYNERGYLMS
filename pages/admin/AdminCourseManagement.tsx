
import React, { useState } from 'react';
import { SetView, Course, Role, User, TimeTableEntry } from '../../types';
import { MOCK_COURSES } from '../../data/courses';
import { MOCK_USERS } from '../../data/users';
import { MOCK_TIMETABLE } from '../../data/timetable';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ChevronLeftIcon, SettingsIcon, TrashIcon, XIcon, UsersIcon, ClockIcon, BookOpenIcon } from '../../components/icons';
import Avatar from '../../components/ui/Avatar';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

// New component for displaying a class card in the grid view
const ClassCard: React.FC<{ course: Course, onSelect: (course: Course) => void }> = ({ course, onSelect }) => (
    <Card onClick={() => onSelect(course)} className="flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="bg-secondary-500 p-4">
            <h3 className="text-xl font-bold text-white truncate">{course.title}</h3>
            <p className="text-sm text-secondary-200">{course.className} - Section {course.section}</p>
        </div>
        <div className="p-4 flex-grow">
            <p className="text-secondary-600 dark:text-secondary-300 text-sm">{course.description}</p>
        </div>
    </Card>
);

const AdminCourseManagement: React.FC<{ setView: SetView }> = ({ setView }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Course | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Course | null>(null);
  const [selectedClass, setSelectedClass] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'subjects' | 'timetable'>('students');
  
  const teachers = MOCK_USERS.filter(user => user.role === Role.TEACHER);
  const allStudents = MOCK_USERS.filter(user => user.role === Role.STUDENT);

  const handleAddNew = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingClass(course);
    setIsModalOpen(true);
  };
  
  const handleOpenDeleteConfirm = (course: Course) => {
    setClassToDelete(course);
    setConfirmModalOpen(true);
  };

  const handleDelete = () => {
    if (!classToDelete) return;
    
    const updatedCourses = courses.filter(c => c.id !== classToDelete.id);
    setCourses(updatedCourses);
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === classToDelete.id);
    if(courseIndex !== -1) MOCK_COURSES.splice(courseIndex, 1);
    
    setConfirmModalOpen(false);
    setClassToDelete(null);
    setSelectedClass(null); // Go back to all classes view after deletion
  };

  const handleSave = (formData: Omit<Course, 'id' | 'announcements' | 'materials'> & {id?: number}) => {
    const isEditing = editingClass !== null;
    
    if (isEditing) {
      const updatedCourses = courses.map(c => 
        c.id === editingClass.id ? { ...c, ...formData } : c
      );
      setCourses(updatedCourses);
      const courseIndex = MOCK_COURSES.findIndex(c => c.id === editingClass.id);
      if(courseIndex !== -1) MOCK_COURSES[courseIndex] = { ...MOCK_COURSES[courseIndex], ...formData };
      
      if(selectedClass && selectedClass.id === editingClass.id) {
          setSelectedClass({ ...selectedClass, ...formData, announcements: selectedClass.announcements, materials: selectedClass.materials });
      }

    } else {
      const newCourse: Course = {
        id: Date.now(),
        ...formData,
        materials: [],
        announcements: []
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      MOCK_COURSES.push(newCourse);
    }
    setIsModalOpen(false);
    setEditingClass(null);
  };

  // Render view for a selected class
  if (selectedClass) {
    const selectedClassStudents = MOCK_USERS.filter(u => selectedClass.students.includes(u.id));
    const selectedClassSubjects = MOCK_COURSES.filter(c => c.className === selectedClass.className && c.section === selectedClass.section);
    const selectedClassTimeTable = MOCK_TIMETABLE.find(t => t.className === selectedClass.className && t.section === selectedClass.section);
    const daysOfWeek: TimeTableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedClass(null)} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to All Classes
        </button>

        <Card className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{selectedClass.className} - Section {selectedClass.section}</h1>
                    <p className="text-secondary-500 mt-1">Details and schedule for this class group.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(selectedClass)}><SettingsIcon className="h-5 w-5 mr-2"/> Manage</Button>
                    <Button variant="danger" onClick={() => handleOpenDeleteConfirm(selectedClass)}><TrashIcon className="h-5 w-5 mr-2"/> Delete</Button>
                </div>
            </div>
        </Card>

        <div>
          <div className="border-b border-secondary-200 dark:border-secondary-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}>
                <UsersIcon className="inline-block h-5 w-5 mr-2"/> Students ({selectedClassStudents.length})
              </button>
              <button onClick={() => setActiveTab('subjects')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subjects' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}>
                <BookOpenIcon className="inline-block h-5 w-5 mr-2"/> Subjects ({selectedClassSubjects.length})
              </button>
               <button onClick={() => setActiveTab('timetable')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timetable' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}`}>
                <ClockIcon className="inline-block h-5 w-5 mr-2"/> Time Table
              </button>
            </nav>
          </div>
          <Card className="mt-4 p-6">
            {activeTab === 'students' && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedClassStudents.map(student => (
                        <div key={student.id} className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                            <Avatar src={student.avatar} alt={student.name} size="sm" />
                            <div className="ml-3">
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-secondary-500">{student.schoolId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'subjects' && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedClassSubjects.map(subject => (
                        <div key={subject.id} className="flex items-start p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                            <BookOpenIcon className="h-6 w-6 mr-4 mt-1 text-primary-500 flex-shrink-0"/>
                            <div>
                                <p className="font-semibold">{subject.title}</p>
                                <p className="text-sm text-secondary-500">{subject.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'timetable' && (
                <div className="max-h-96 overflow-y-auto">
                    {selectedClassTimeTable ? (
                        <div className="space-y-6">
                            {daysOfWeek.map(day => {
                                const daySchedule = selectedClassTimeTable.schedule.filter(s => s.day === day);
                                if (daySchedule.length === 0) return null;
                                return (
                                    <div key={day}>
                                        <h4 className="font-bold text-lg mb-2 pb-1 border-b border-secondary-200 dark:border-secondary-700">{day}</h4>
                                        <div className="space-y-2">
                                            {daySchedule.sort((a,b) => a.time.localeCompare(b.time)).map((entry, index) => (
                                                <div key={index} className="grid grid-cols-4 gap-4 items-center p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800">
                                                    <p className="font-mono text-sm text-secondary-600 dark:text-secondary-400">{entry.time}</p>
                                                    <p className="font-semibold col-span-1">{entry.subject}</p>
                                                    <p className="text-sm text-secondary-500">{entry.teacher}</p>
                                                    <p className="text-sm text-secondary-500 text-right">Room: {entry.room}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-secondary-500 py-8">No timetable found for this class.</p>
                    )}
                </div>
            )}
          </Card>
        </div>

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


  // Render main grid view of all classes
  return (
    <div className="space-y-6">
      <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
        <ChevronLeftIcon className="h-4 w-4 mr-1"/>
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Button onClick={handleAddNew}>Add New Class</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <ClassCard 
            key={course.id} 
            course={course} 
            onSelect={setSelectedClass}
          />
        ))}
      </div>
      {courses.length === 0 && <p className="text-secondary-500">No classes have been created yet.</p>}
      
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        classData={editingClass}
        teachers={teachers}
        allStudents={allStudents}
      />
       <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Class"
        message={`Are you sure you want to delete the class "${classToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

const CourseFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  classData: Course | null;
  teachers: User[];
  allStudents: User[];
}> = ({ isOpen, onClose, onSave, classData, teachers, allStudents }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [teacherIds, setTeacherIds] = useState<string[]>([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([]);
  
  const [studentToAdd, setStudentToAdd] = useState('');

  React.useEffect(() => {
    if (isOpen) {
        if (classData) {
          setTitle(classData.title);
          setDescription(classData.description);
          setClassName(classData.className);
          setSection(classData.section);
          setTeacherIds(classData.teacherIds);
          setEnrolledStudentIds(classData.students);
        } else { // Reset for new course
          setTitle('');
          setDescription('');
          setClassName('');
          setSection('');
          setTeacherIds([]);
          setEnrolledStudentIds([]);
        }
        setStudentToAdd('');
    }
  }, [classData, isOpen]);

  const handleAddStudent = () => {
    if(studentToAdd && !enrolledStudentIds.includes(studentToAdd)) {
        setEnrolledStudentIds([...enrolledStudentIds, studentToAdd]);
        setStudentToAdd('');
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    setEnrolledStudentIds(enrolledStudentIds.filter(id => id !== studentId));
  };
  
  const handleTeacherSelection = (teacherId: string) => {
    setTeacherIds(prev => 
        prev.includes(teacherId) 
            ? prev.filter(id => id !== teacherId) 
            : [...prev, teacherId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, className, section, teacherIds, students: enrolledStudentIds });
  };

  const unenrolledStudents = allStudents.filter(s => !enrolledStudentIds.includes(s.id));
  const enrolledStudents = enrolledStudentIds.map(id => allStudents.find(s => s.id === id)).filter(Boolean) as User[];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={classData ? 'Manage Class' : 'Add New Class'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Details */}
        <div>
          <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Class Details</h4>
          <div className="space-y-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Subject Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Physics" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="className" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Class</label>
                  <input id="className" type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Section</label>
                  <input id="section" type="text" value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. A" className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
             </div>
          </div>
        </div>
        
        {/* Teachers */}
        <div>
            <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Teachers</h4>
            <div className="space-y-2 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                {teachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700/50">
                        <input
                            type="checkbox"
                            checked={teacherIds.includes(teacher.id)}
                            onChange={() => handleTeacherSelection(teacher.id)}
                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                         <Avatar src={teacher.avatar} alt={teacher.name} size="sm" />
                        <span className="text-secondary-700 dark:text-secondary-300">{teacher.name}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Student Roster */}
        <div>
            <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Student Roster</h4>
            <div className="space-y-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {enrolledStudents.length > 0 ? enrolledStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-secondary-100 dark:bg-secondary-700/50 p-2 rounded-md">
                            <div className="flex items-center"><Avatar src={student.avatar} alt={student.name} size="sm" /><span className="ml-3 font-medium">{student.name}</span></div>
                            <button type="button" onClick={() => handleRemoveStudent(student.id)} className="p-1 text-red-500 hover:text-red-700"><XIcon className="h-4 w-4" /></button>
                        </div>
                    )) : <p className="text-sm text-secondary-500 text-center py-2">No students enrolled.</p>}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-secondary-200 dark:border-secondary-700">
                    <select value={studentToAdd} onChange={(e) => setStudentToAdd(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Add a student...</option>
                        {unenrolledStudents.map(student => (<option key={student.id} value={student.id}>{student.name}</option>))}
                    </select>
                    <Button type="button" variant="secondary" onClick={handleAddStudent} disabled={!studentToAdd}>Add</Button>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminCourseManagement;