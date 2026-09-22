// College Faculty Dashboard for SMARTORA
// Tailored for Professors and Instructors to manage subjects, classroom attendance, and grading

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  FileCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function CollegeFacultyDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    currentOrganization,
    subjects = [],
    students = [],
    exams = [],
    examResults = [],
    addExamResult
  } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('classes');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  // Grade Form
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    studentName: '',
    subjectCode: '',
    subjectName: '',
    marks: '',
    maxMarks: 100,
    grade: 'A',
    gpa: '8.5'
  });

  // Filter subjects taught by this professor (or first 2 if demo)
  const mySubjects = useMemo(() => {
    const profName = currentUser?.name?.toLowerCase() || 'priya';
    const matched = subjects.filter(s => s.faculty?.toLowerCase().includes(profName) || s.department === currentUser?.department);
    return matched.length > 0 ? matched : subjects.slice(0, 3);
  }, [subjects, currentUser]);

  const handleOpenGradeModal = (student, subject) => {
    setGradeForm({
      studentId: student.studentId || student.id,
      studentName: student.name,
      subjectCode: subject.subjectCode,
      subjectName: subject.name,
      marks: '85',
      maxMarks: 100,
      grade: 'A',
      gpa: '8.5'
    });
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    addExamResult(gradeForm);
    setIsGradeModalOpen(false);
    addToast('Grade Submitted', `Recorded marks for ${gradeForm.studentName} in ${gradeForm.subjectCode}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-700 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Faculty Academic Console
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {currentUser?.name || 'Prof. Priya Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Department of {currentUser?.department || 'Computer Science & Engineering'} • Faculty Scholar Portal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('academic')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Curriculum & Exams
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Subjects"
          value={mySubjects.length}
          change="Current Term"
          isPositive={true}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Students in Batches"
          value={students.length}
          change="Semester 5"
          isPositive={true}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Upcoming Assessments"
          value={exams.length}
          change="Mid-Term Exams"
          isPositive={true}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Class Average GPA"
          value="8.9"
          change="+0.4 Improvement"
          isPositive={true}
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'classes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Lecture Subjects ({mySubjects.length})
        </button>
        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'grading'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Gradebook & Results ({examResults.length})
        </button>
      </div>

      {/* Tab: My Subjects */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mySubjects.map(sub => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                    {sub.subjectCode}
                  </span>
                  <Badge variant="info">{sub.credits} Credits</Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {sub.department} • {sub.semester}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Enrolled Scholars: {students.length}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    if (students.length > 0) {
                      handleOpenGradeModal(students[0], sub);
                    }
                  }}
                  className="text-xs py-1 px-2.5"
                >
                  Enter Grades
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Gradebook */}
      {activeTab === 'grading' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Submitted Assessment Grades
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Scholar</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">GPA</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {res.studentName} <span className="text-xs font-mono font-normal text-slate-400 block">{res.studentId}</span>
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

      {/* Modal: Enter Grades */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Enter Grade: ${gradeForm.studentName}`}
      >
        <form onSubmit={handleGradeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Scholar</label>
            <input
              type="text"
              disabled
              value={`${gradeForm.studentName} (${gradeForm.studentId})`}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              disabled
              value={`${gradeForm.subjectName} (${gradeForm.subjectCode})`}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Marks (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={gradeForm.marks}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  const g = m >= 90 ? 'O' : m >= 80 ? 'A+' : m >= 70 ? 'A' : m >= 60 ? 'B+' : m >= 50 ? 'B' : 'F';
                  const gpa = (m / 10).toFixed(1);
                  setGradeForm({ ...gradeForm, marks: e.target.value, grade: g, gpa });
                }}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Letter Grade</label>
              <input
                type="text"
                readOnly
                value={gradeForm.grade}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-purple-600 border border-slate-200 dark:border-slate-700 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grade Point (GPA)</label>
              <input
                type="text"
                readOnly
                value={gradeForm.gpa}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-emerald-600 border border-slate-200 dark:border-slate-700 text-center"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Commit Grade</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
