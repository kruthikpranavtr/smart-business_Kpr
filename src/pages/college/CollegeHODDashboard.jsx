// College Head of Department (HOD) Dashboard for SMARTORA
// Scoped to the HOD's specific academic department (e.g. Computer Science & Engineering)

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  AlertTriangle,
  Award,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  UserPlus
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function CollegeHODDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    currentOrganization,
    students = [],
    employees = [],
    subjects = [],
    exams = [],
    notices = [],
    addStudent,
    addExam
  } = useData();
  const { addToast } = useToast();

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Department determination
  const departmentName = currentUser?.department || 'Computer Science & Engineering';

  // Scoped Department Data
  const deptStudents = useMemo(() => {
    return students.filter(s =>
      !s.department || s.department.toLowerCase().includes(departmentName.toLowerCase().slice(0, 8))
    );
  }, [students, departmentName]);

  const deptFaculty = useMemo(() => {
    return employees.filter(e =>
      !e.department || e.department.toLowerCase().includes(departmentName.toLowerCase().slice(0, 8))
    );
  }, [employees, departmentName]);

  const deptSubjects = useMemo(() => {
    return subjects.filter(s =>
      !s.department || s.department.toLowerCase().includes(departmentName.toLowerCase().slice(0, 8))
    );
  }, [subjects, departmentName]);

  const deptExams = useMemo(() => {
    return exams.filter(e =>
      !e.department || e.department.toLowerCase().includes(departmentName.toLowerCase().slice(0, 8))
    );
  }, [exams, departmentName]);

  const atRiskStudents = useMemo(() => {
    return deptStudents.filter(s => (s.attendance || 85) < 75);
  }, [deptStudents]);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'B.Tech CSE',
    semester: 'Semester 1',
    admissionYear: 2026
  });

  const [createdStudentResult, setCreatedStudentResult] = useState(null);

  const handleEnrollStudent = (e) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    const res = addStudent({
      ...studentForm,
      department: departmentName
    });

    setCreatedStudentResult(res);
    addToast('Student Enrolled', `Enrolled scholar ${studentForm.name} [${res.studentId}].`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-700 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              HOD Directorate Portal
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {departmentName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Department Chair: <span className="font-bold text-white">{currentUser?.name || 'Dr. Priya Sharma'}</span> • Academic Year 2026-27
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setCreatedStudentResult(null);
              setIsStudentModalOpen(true);
            }}
            className="bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Enroll Department Student
          </Button>
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
          title="Department Scholars"
          value={deptStudents.length}
          change="+3 This Term"
          isPositive={true}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Department Faculty"
          value={deptFaculty.length || 6}
          change="100% Onboarded"
          isPositive={true}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Curriculum Modules"
          value={deptSubjects.length}
          change="Syllabus Active"
          isPositive={true}
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Scholars At-Risk (<75%)"
          value={atRiskStudents.length}
          change={atRiskStudents.length > 0 ? "Counseling Alert" : "All Clear"}
          isPositive={atRiskStudents.length === 0}
          icon={AlertTriangle}
          color={atRiskStudents.length > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Department Students ({deptStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faculty'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Faculty Mentors ({deptFaculty.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exams'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Department Exams ({deptExams.length})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Tab: Department Students */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Student / Roll ID</th>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Course & Semester</th>
                  <th className="px-5 py-3">Attendance</th>
                  <th className="px-5 py-3">GPA</th>
                  <th className="px-5 py-3">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {deptStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {student.studentId || student.id}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="px-5 py-3.5">
                      {student.course || 'B.Tech CSE'} • {student.semester || 'Semester 5'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${(student.attendance || 90) < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {student.attendance || 90}%
                        </span>
                        {(student.attendance || 90) < 75 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            Shortage
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-purple-600 dark:text-purple-400">
                      {student.gpa || '8.5'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={student.status === 'Active' || student.status === 'Regular' ? 'success' : 'warning'}>
                        {student.status || 'Active'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Faculty Mentors */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deptFaculty.map(fac => (
            <div
              key={fac.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                  {fac.employeeId || fac.id}
                </span>
                <Badge variant="success">Active Faculty</Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {fac.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {fac.designation || 'Associate Professor'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Contact:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{fac.email || 'faculty@campus.demo'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Department Exams */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptExams.map(ex => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold border border-amber-200 dark:border-amber-800">
                  {ex.subjectCode}
                </span>
                <span className="text-xs font-bold text-slate-400">Hall: {ex.room}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {ex.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Date: {ex.date} | Timing: {ex.time}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Enroll Department Student */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title={`Enroll Scholar in ${departmentName}`}
      >
        {createdStudentResult ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scholar Successfully Enrolled!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The student account has been provisioned and permanent login credentials generated:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left font-mono text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div><span className="text-slate-400">Student Name:</span> <span className="font-bold text-slate-900 dark:text-white">{createdStudentResult.student.name}</span></div>
              <div><span className="text-slate-400">Student ID / Login:</span> <span className="font-bold text-blue-600 dark:text-blue-400">{createdStudentResult.studentId}</span></div>
              <div><span className="text-slate-400">Temp Password:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{createdStudentResult.tempPassword}</span></div>
            </div>
            <Button size="sm" onClick={() => setIsStudentModalOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEnrollStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Scholar Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Arun Kumar"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email ID</label>
                <input
                  type="email"
                  placeholder="student@campus.demo"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                <select
                  value={studentForm.semester}
                  onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admission Year</label>
                <input
                  type="number"
                  value={studentForm.admissionYear}
                  onChange={(e) => setStudentForm({ ...studentForm, admissionYear: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsStudentModalOpen(false)}>Cancel</Button>
              <Button size="sm" type="submit">Generate ID & Enroll</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
