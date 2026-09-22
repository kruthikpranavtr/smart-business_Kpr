// College Academic & Curriculum Management Page for SMARTORA
// Centralized Directorate Console for Courses, Subjects, Examinations, and Results

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  FileCheck,
  Award,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Bell
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function CollegeAcademicPage({ initialTab = 'courses' }) {
  const {
    courses = [],
    subjects = [],
    exams = [],
    examResults = [],
    notices = [],
    students = [],
    departments = [],
    addCourse,
    addSubject,
    addExam,
    currentOrganization
  } = useData();

  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Forms
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    department: 'Computer Science & Engineering',
    program: 'Undergraduate',
    duration: '4 Years',
    semesters: 8
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    subjectCode: '',
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    credits: 4,
    faculty: currentUser?.name || 'Dr. Priya Sharma'
  });

  const [examForm, setExamForm] = useState({
    title: '',
    subjectCode: '',
    department: 'Computer Science & Engineering',
    semester: 'Semester 5',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 01:00 PM',
    room: 'Hall B-201',
    maxMarks: 100,
    type: 'Internal'
  });

  // Filtered lists
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDeptFilter === 'ALL' || c.department === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [courses, searchQuery, selectedDeptFilter]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const matchSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase()) || s.faculty?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [subjects, searchQuery, selectedDeptFilter]);

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const matchSearch = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || e.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDeptFilter === 'ALL' || e.department === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [exams, searchQuery, selectedDeptFilter]);

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code) return;
    addCourse(courseForm);
    setIsCourseModalOpen(false);
    setCourseForm({ name: '', code: '', department: 'Computer Science & Engineering', program: 'Undergraduate', duration: '4 Years', semesters: 8 });
    addToast('Course Added', `Successfully added degree program "${courseForm.name}".`, 'success');
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.subjectCode) return;
    addSubject(subjectForm);
    setIsSubjectModalOpen(false);
    setSubjectForm({ name: '', subjectCode: '', department: 'Computer Science & Engineering', semester: 'Semester 5', credits: 4, faculty: currentUser?.name || 'Dr. Priya Sharma' });
    addToast('Subject Added', `Created curriculum subject "${subjectForm.name}".`, 'success');
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    if (!examForm.title || !examForm.subjectCode) return;
    addExam(examForm);
    setIsExamModalOpen(false);
    setExamForm({ title: '', subjectCode: '', department: 'Computer Science & Engineering', semester: 'Semester 5', date: new Date().toISOString().split('T')[0], time: '10:00 AM - 01:00 PM', room: 'Hall B-201', maxMarks: 100, type: 'Internal' });
    addToast('Exam Scheduled', `Scheduled exam session "${examForm.title}".`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Academic Directorate
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name || 'Academic Campus'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curriculum, Courses & Examinations
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Standardized academic framework, accredited syllabus, exam halls, and grade records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCourseModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Degree Course
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSubjectModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Subject
          </Button>
          <Button
            size="sm"
            onClick={() => setIsExamModalOpen(true)}
            className="bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold shadow-md"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Degree Courses"
          value={courses.length}
          change="+1 Accredited"
          isPositive={true}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Curriculum Subjects"
          value={subjects.length}
          change="Syllabus 2026"
          isPositive={true}
          icon={BookOpen}
          color="cyan"
        />
        <StatCard
          title="Scheduled Exams"
          value={exams.length}
          change="Hall Tickets Ready"
          isPositive={true}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Total Scholars"
          value={students.length}
          change="Enrolled"
          isPositive={true}
          icon={Users}
          color="emerald"
        />
      </div>

      {/* Navigation Tabs & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'subjects'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Subjects ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'exams'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Examinations ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'results'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Results & GPA ({examResults.length})
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'notices'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Circulars & Notices ({notices.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">CS & Engineering</option>
            <option value="Information Technology">Information Tech</option>
            <option value="Electronics & Communication">Electronics (EC)</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                    {course.code}
                  </span>
                  <Badge variant={course.status === 'Active' ? 'success' : 'default'}>
                    {course.status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {course.department}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>{course.program}</span>
                <span>{course.duration} ({course.semesters} Semesters)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Subject Code</th>
                  <th className="px-5 py-3">Subject Name</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Semester</th>
                  <th className="px-5 py-3">Credits</th>
                  <th className="px-5 py-3">Faculty Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sub.subjectCode}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="px-5 py-3.5">
                      {sub.department}
                    </td>
                    <td className="px-5 py-3.5 font-medium">
                      {sub.semester}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
                        {sub.credits} Credits
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {sub.faculty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Examinations */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map(ex => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 font-mono">
                    {ex.subjectCode} • {ex.type}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Max: {ex.maxMarks} Marks
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {ex.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {ex.department} • {ex.semester}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ex.date} | {ex.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Examination Hall</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ex.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Results */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Student ID</th>
                  <th className="px-5 py-3">Scholar Name</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Marks</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">GPA</th>
                  <th className="px-5 py-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {res.studentId}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {res.studentName}
                    </td>
                    <td className="px-5 py-3.5 font-medium">
                      {res.subjectName} ({res.subjectCode})
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {res.marks} / {res.maxMarks}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-purple-600 dark:text-purple-400">
                      {res.grade}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {res.gpa}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={res.status === 'Passed' ? 'success' : 'danger'}>
                        {res.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          {notices.map(ntc => (
            <div
              key={ntc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ntc.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Issued by: {ntc.department} • Published: {ntc.date}
                  </p>
                </div>
              </div>
              <Badge variant={ntc.priority === 'High' ? 'danger' : 'info'}>
                {ntc.priority} Priority
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Degree Course */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Add Degree Program / Course"
      >
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
            <input
              type="text"
              required
              placeholder="e.g. B.Tech Computer Science & Engineering"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CSE-UG"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
              <input
                type="text"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={courseForm.department}
              onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Create Program</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Subject */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Curriculum Subject"
      >
        <form onSubmit={handleSubjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Design & Analysis of Algorithms"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS301"
                value={subjectForm.subjectCode}
                onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value.toUpperCase() })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Faculty Professor</label>
            <input
              type="text"
              value={subjectForm.faculty}
              onChange={(e) => setSubjectForm({ ...subjectForm, faculty: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsSubjectModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Create Subject</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Schedule Exam */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Schedule Examination Session"
      >
        <form onSubmit={handleExamSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Exam Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Mid-Term Exam: Algorithms (CS301)"
              value={examForm.title}
              onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS301"
                value={examForm.subjectCode}
                onChange={(e) => setExamForm({ ...examForm, subjectCode: e.target.value.toUpperCase() })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={examForm.date}
                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Timing</label>
              <input
                type="text"
                value={examForm.time}
                onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Exam Hall</label>
              <input
                type="text"
                value={examForm.room}
                onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsExamModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Publish Exam</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
