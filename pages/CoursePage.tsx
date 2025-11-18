
import React, { useState, useEffect } from 'react';
import { SetView, CourseMaterial, Role, Announcement, Course, User } from '../types';
import { MOCK_COURSES } from '../data/courses';
import { MOCK_USERS } from '../data/users';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SettingsIcon, XIcon } from '../components/icons';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

interface CoursePageProps {
  courseId: number;
  setView: SetView;
}

const CoursePage: React.FC<CoursePageProps> = ({ courseId, setView }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(() => MOCK_COURSES.find(c => c.id === courseId));
  const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [viewingSlides, setViewingSlides] = useState<CourseMaterial | null>(null);

  if (!course) {
    return <div>Course not found.</div>;
  }

  const isCreator = user?.id === course.creatorId;
  const isTeacherInCourse = user?.role === Role.TEACHER && course.teacherIds.includes(user.id);

  const updateCourseState = (updatedCourse: Course) => {
    setCourse(updatedCourse);
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES[courseIndex] = updatedCourse;
    }
  };

  const handleAddMaterial = (material: Omit<CourseMaterial, 'id'>) => {
    const newMaterial = { ...material, id: Date.now() };
    const updatedCourse = { ...course, materials: [...course.materials, newMaterial] };
    updateCourseState(updatedCourse);
    setMaterialModalOpen(false);
  };
  
  const handleAddAnnouncement = (announcement: Omit<Announcement, 'id' | 'courseId' | 'date'>) => {
     const newAnnouncement: Announcement = {
         ...announcement,
         id: Date.now(),
         courseId: course.id,
         date: new Date().toISOString().split('T')[0]
     };
     const updatedCourse = { ...course, announcements: [newAnnouncement, ...course.announcements] };
     updateCourseState(updatedCourse);
     setAnnouncementModalOpen(false);
  };

  const handleSaveChanges = (formData: Omit<Course, 'id' | 'announcements' | 'materials'>) => {
    const updatedCourse = { ...course, ...formData };
    updateCourseState(updatedCourse);
    setManageModalOpen(false);
  };
  
  const teacherIds = [...new Set(course.teacherIds)];
  const teachersInfo = teacherIds.map(id => MOCK_USERS.find(u => u.id === id)).filter((u): u is User => !!u);
  const studentsInfo = course.students.map(id => MOCK_USERS.find(u => u.id === id)).filter((u): u is User => !!u);

  const getMaterialIcon = (type: CourseMaterial['type']) => {
    switch(type) {
        case 'video': return '▶️';
        case 'document': return '📄';
        case 'slides': return '💻';
    }
  }

  return (
    <div className="space-y-6">
        <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to Dashboard
        </button>

      <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <div>
                 <h1 className="text-4xl font-extrabold text-primary-700 dark:text-primary-300 flex items-center gap-4">{course.title} <Badge color="primary">{course.className} - Section {course.section}</Badge></h1>
                <div className="flex items-center mt-2">
                    <p className="text-lg text-secondary-500 mr-2">Taught by:</p>
                    <div className="flex -space-x-2">
                        {teachersInfo.map(t => <Avatar key={t.id} src={t.avatar} alt={t.name} size="sm" />)}
                    </div>
                    <p className="text-lg text-secondary-500 ml-3">{teachersInfo.map(t => t.name).join(', ')}</p>
                </div>
            </div>
            {isCreator && (
                <Button onClick={() => setManageModalOpen(true)}><SettingsIcon className="h-5 w-5 mr-2"/> Manage Class</Button>
            )}
        </div>
        <p className="mt-4 text-secondary-700 dark:text-secondary-300">{course.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Class Content</h2>
                        {isTeacherInCourse && (
                            <Button size="sm" onClick={() => setMaterialModalOpen(true)}>
                                <PlusIcon className="h-4 w-4 mr-1"/> Add Material
                            </Button>
                        )}
                    </div>
                    {course.materials.length > 0 ? (
                        <ul className="space-y-3">
                            {course.materials.map(material => (
                                <li key={material.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary-100 dark:bg-secondary-700/50">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-4">{getMaterialIcon(material.type)}</span>
                                        <div>
                                            <p className="font-semibold">{material.title}</p>
                                            <p className="text-xs capitalize text-secondary-500">{material.type}</p>
                                        </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => {
                                        if (material.type === 'slides') {
                                          setViewingSlides(material);
                                        } else if (material.url && material.url !== '#') {
                                          window.open(material.url, '_blank', 'noopener,noreferrer');
                                        }
                                      }}
                                      disabled={
                                        (material.type === 'slides' && (!material.content || material.content.length === 0)) ||
                                        (material.type !== 'slides' && (!material.url || material.url === '#'))
                                      }
                                    >
                                      View
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-center text-secondary-500 py-4">No materials for this class yet.</p>
                    )}
                </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                 <div className="p-5 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Announcements</h2>
                     {isTeacherInCourse && <Button size="sm" onClick={() => setAnnouncementModalOpen(true)}><PlusIcon className="h-4 w-4 mr-1"/> Post</Button>}
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                    {course.announcements.length > 0 ? (
                        <ul className="space-y-4">
                            {course.announcements.map(ann => (
                                <li key={ann.id}>
                                    <p className="font-semibold">{ann.title}</p>
                                    <p className="text-sm text-secondary-600 dark:text-secondary-400">{ann.content}</p>
                                    <p className="text-xs text-secondary-400 mt-1">{new Date(ann.date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-secondary-500 text-center py-4">No announcements for this course.</p>
                    )}
                </div>
            </Card>

            <Card>
                <div className="p-5 border-b border-secondary-200 dark:border-secondary-700">
                    <h2 className="text-xl font-bold">Student Roster ({studentsInfo.length})</h2>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                    <ul className="space-y-3">
                        {studentsInfo.map(student => (
                            <li key={student.id} className="flex items-center">
                                <Avatar src={student.avatar} alt={student.name} size="sm" />
                                <span className="ml-3 font-medium">{student.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
      </div>
      
      <AddMaterialModal isOpen={isMaterialModalOpen} onClose={() => setMaterialModalOpen(false)} onSave={handleAddMaterial} />
      <AddAnnouncementModal isOpen={isAnnouncementModalOpen} onClose={() => setAnnouncementModalOpen(false)} onSave={handleAddAnnouncement} />
      {isCreator && 
        <ManageCourseModal 
            isOpen={isManageModalOpen} 
            onClose={() => setManageModalOpen(false)} 
            onSave={handleSaveChanges} 
            course={course}
            teachers={MOCK_USERS.filter(u => u.role === Role.TEACHER)}
            allStudents={MOCK_USERS.filter(u => u.role === Role.STUDENT)}
        />
      }
      {viewingSlides && (
        <SlideViewerModal
            material={viewingSlides}
            onClose={() => setViewingSlides(null)}
        />
      )}
    </div>
  );
};

const AddMaterialModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSave: (material: Omit<CourseMaterial, 'id'>) => void
}> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<CourseMaterial['type']>('document');
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const resetState = () => {
        setTitle('');
        setType('document');
        setFile(null);
        setFiles(null);
        setIsProcessing(false);
        setError('');
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(resetState, 300); // Allow closing animation to finish
        }
    }, [isOpen]);
    
    useEffect(() => {
        setFile(null);
        setFiles(null);
    }, [type]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'slides') {
            setFiles(e.target.files);
        } else {
            if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
            }
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        try {
            if (type === 'slides') {
                if (!files || files.length === 0) {
                    setError('Please select one or more images for the slides.');
                    setIsProcessing(false);
                    return;
                }
                const contentPromises = Array.from(files).map(fileToBase64);
                const content = await Promise.all(contentPromises);
                onSave({ title, type, url: '#', content });
            } else {
                if (!file) {
                    setError('Please select a file to upload.');
                    setIsProcessing(false);
                    return;
                }
                const dataUrl = await fileToBase64(file);
                onSave({ title, type, url: dataUrl });
            }
        } catch (err) {
            console.error("Error processing file:", err);
            setError("There was an error processing your file. Please try again.");
            setIsProcessing(false);
        }
    };

    const getFileLabel = () => {
        if (type === 'slides') {
            return files && files.length > 0 ? `${files.length} file(s) selected` : 'PNG, JPG, GIF images';
        }
        return file ? file.name : 'PDF, DOCX, MP4, etc.';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Material">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="mat-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Title</label>
                    <input id="mat-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                 <div>
                    <label htmlFor="mat-type" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Type</label>
                    <select id="mat-type" value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500">
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="slides">Slides (Images)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Upload File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 dark:border-secondary-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <div className="flex text-sm text-secondary-600 dark:text-secondary-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-secondary-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    <span>{isProcessing ? 'Processing...' : 'Select file(s)'}</span>
                                    <input 
                                        id="file-upload" 
                                        name="file-upload" 
                                        type="file" 
                                        className="sr-only" 
                                        onChange={handleFileChange}
                                        multiple={type === 'slides'}
                                        accept={type === 'document' ? '.pdf,.doc,.docx,.txt' : type === 'video' ? 'video/*' : 'image/*'}
                                        disabled={isProcessing}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-500">
                                {getFileLabel()}
                            </p>
                        </div>
                    </div>
                </div>
                
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                    <Button type="submit" disabled={isProcessing || (!title.trim()) || (type !== 'slides' && !file) || (type === 'slides' && (!files || files.length === 0))}>
                        {isProcessing ? 'Uploading...' : 'Add Material'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const AddAnnouncementModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSave: (ann: {title: string, content: string}) => void
}> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content });
        setTitle(''); setContent('');
    };
    
    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Post New Announcement">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="ann-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Title</label>
                    <input id="ann-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                <div>
                    <label htmlFor="ann-content" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Content</label>
                    <textarea id="ann-content" value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Post Announcement</Button>
                </div>
            </form>
        </Modal>
    );
};

const ManageCourseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  course: Course;
  teachers: User[];
  allStudents: User[];
}> = ({ isOpen, onClose, onSave, course, teachers, allStudents }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [teacherIds, setTeacherIds] = useState<string[]>([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([]);
  
  const [studentToAdd, setStudentToAdd] = useState('');

  React.useEffect(() => {
    if (isOpen && course) {
        setTitle(course.title);
        setDescription(course.description);
        setClassName(course.className);
        setSection(course.section);
        setTeacherIds(course.teacherIds);
        setEnrolledStudentIds(course.students);
        setStudentToAdd('');
    }
  }, [course, isOpen]);
  
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage: ${course.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Class Details</h4>
          <div className="space-y-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Subject Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" required />
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
        
        <div>
            <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Teachers</h4>
             <div className="space-y-2 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                {teachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center space-x-3 cursor-pointer">
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

        <div>
            <h4 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Student Roster</h4>
            <div className="space-y-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {enrolledStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-secondary-100 dark:bg-secondary-700/50 p-2 rounded-md">
                            <div className="flex items-center"><Avatar src={student.avatar} alt={student.name} size="sm" /><span className="ml-3 font-medium">{student.name}</span></div>
                            <button type="button" onClick={() => handleRemoveStudent(student.id)} className="p-1 text-red-500 hover:text-red-700"><XIcon className="h-4 w-4" /></button>
                        </div>
                    ))}
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

const SlideViewerModal: React.FC<{
  material: CourseMaterial;
  onClose: () => void;
}> = ({ material, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = material.content || [];

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={material.title}>
      <div className="relative">
        <div className="bg-black rounded-lg flex items-center justify-center aspect-video">
          {slides.length > 0 ? (
            <img 
              src={slides[currentIndex]} 
              alt={`Slide ${currentIndex + 1}`} 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-white">No slides available.</p>
          )}
        </div>

        {slides.length > 1 && (
            <>
                <Button 
                    onClick={goToPrevious} 
                    disabled={currentIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full !p-2"
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </Button>
                <Button 
                    onClick={goToNext}
                    disabled={currentIndex === slides.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full !p-2"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </Button>
            </>
        )}
      </div>
       <div className="text-center mt-4 font-semibold text-secondary-600 dark:text-secondary-300">
            Slide {currentIndex + 1} of {slides.length}
        </div>
    </Modal>
  );
};


export default CoursePage;
