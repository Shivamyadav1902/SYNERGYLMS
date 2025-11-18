
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SetView, Course, Assignment } from '../../types';
import { MOCK_COURSES } from '../../data/courses';
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS } from '../../data/assignments';
import Card from '../../components/ui/Card';
import { BookOpenIcon } from '../../components/icons';

interface StudentDashboardProps {
  setView: SetView;
}

const CourseCard: React.FC<{ course: Course, onClick: () => void }> = ({ course, onClick }) => {
  return (
    <Card onClick={onClick} className="flex flex-col h-full">
      <div className="bg-primary-500 p-4">
        <h3 className="text-xl font-bold text-white truncate">{course.title}</h3>
        <p className="text-sm text-primary-200">{course.className} - Section {course.section}</p>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-secondary-600 dark:text-secondary-300 text-sm">{course.description}</p>
      </div>
       <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="w-full bg-secondary-200 rounded-full h-2.5 dark:bg-secondary-700">
          <div className="bg-green-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
        </div>
        <p className="text-xs text-secondary-500 mt-1 text-right">45% Complete</p>
       </div>
    </Card>
  );
};

const UpcomingAssignment: React.FC<{ assignment: Assignment, courseTitle: string }> = ({ assignment, courseTitle }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            <div>
                <p className="font-semibold">{assignment.title}</p>
                <p className="text-sm text-secondary-500">{courseTitle}</p>
            </div>
            <p className="text-sm font-medium text-red-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
    );
};


const StudentDashboard: React.FC<StudentDashboardProps> = ({ setView }) => {
  const { user } = useAuth();
  const enrolledCourses = MOCK_COURSES.filter(c => user?.courseIds?.includes(c.id));
  const upcomingAssignments = MOCK_ASSIGNMENTS.filter(a => user?.courseIds?.includes(a.courseId) && !MOCK_SUBMISSIONS.find(s => s.assignmentId === a.id && s.studentId === user.id)).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name.split(' ')[0]}!</h1>
        <p className="text-secondary-500 mt-1">Here's your learning snapshot for today.</p>
      </div>
      
      {/* Enrolled Courses */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center"><BookOpenIcon className="h-6 w-6 mr-2 text-primary-500"/> My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => setView({ type: 'course', id: course.id })} />
          ))}
        </div>
      </section>

      {/* Upcoming Assignments & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h2>
            <Card className="p-4">
                <div className="space-y-3">
                    {upcomingAssignments.length > 0 ? (
                        upcomingAssignments.map(asg => {
                            const course = MOCK_COURSES.find(c => c.id === asg.courseId);
                            return <UpcomingAssignment key={asg.id} assignment={asg} courseTitle={course?.title || ''}/>
                        })
                    ) : <p className="text-secondary-500 text-center p-4">No upcoming deadlines. Great job!</p>}
                </div>
            </Card>
        </section>

        <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Announcements</h2>
             <Card className="p-4">
                <div className="space-y-3">
                    {MOCK_COURSES.flatMap(c => c.announcements).slice(0,3).map(ann => (
                         <div key={ann.id} className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                            <p className="font-semibold">{ann.title} <span className="text-xs font-normal text-secondary-500">({MOCK_COURSES.find(c=>c.id === ann.courseId)?.title})</span></p>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">{ann.content}</p>
                         </div>
                    ))}
                </div>
            </Card>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;