// College Student Scholar Portal for SMARTORA
// Dedicated personal dashboard for enrolled university students to view subjects, attendance, timetable, exams, and grades

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Bell,
  Sparkles,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function CollegeStudentDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    currentOrganization,
    subjects = [],
    exams = [],
    examResults = [],
    notices = []
  } = useData();

  const [activeTab, setActiveTab] = useState('courses');

  // Scholar profile
  const studentId = currentUser?.studentId || currentUser?.id || 'ARUN-CS-2026-001';
  const studentName = currentUser?.name || 'Arun Kumar';
  const department = currentUser?.department || 'Computer Science & Engineering';

  // Personal results
  const myResults = useMemo(() => {
    const matched = examResults.filter(r => r.studentId === studentId || r.studentName?.toLowerCase() === studentName.toLowerCase());
    return matched.length > 0 ? matched : examResults.slice(0, 2);
  }, [examResults, studentId, studentName]);

  // Calculate GPA
  const calculatedGPA = useMemo(() => {
    if (myResults.length === 0) return '9.2';
    const sum = myResults.reduce((acc, r) => acc + Number(r.gpa || 8.5), 0);
    return (sum / myResults.length).toFixed(1);
  }, [myResults]);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-700 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs font-mono">
              {studentId}
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            {department} • B.Tech Undergraduate • Semester 5
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Hall Ticket & ID Card
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current SGPA"
          value={calculatedGPA}
          change="Distinction Grade"
          isPositive={true}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Attendance Standing"
          value="94%"
          change="Safe (>75% mandatory)"
          isPositive={true}
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Registered Subjects"
          value={subjects.length || 4}
          change="21 Credits"
          isPositive={true}
          icon={BookOpen}
          color="cyan"
        />
        <StatCard
          title="Upcoming Hall Exams"
          value={exams.length}
          change="Admit Card Issued"
          isPositive={true}
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Registered Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'exams'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Exam Hall Schedule ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'results'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semester Grade Sheet ({myResults.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notices'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Campus Notices ({notices.length})
        </button>
      </div>

      {/* Tab: Enrolled Subjects */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(sub => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                  {sub.subjectCode}
                </span>
                <span className="text-xs font-bold text-slate-500">{sub.credits} Credits</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instructor: <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.faculty}</span>
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{sub.semester}</span>
                <span className="text-emerald-600 font-bold">Attendance: 96%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Exam Hall Schedule */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map(ex => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 font-mono">
                  {ex.subjectCode}
                </span>
                <Badge variant="warning">Confirmed Hall</Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {ex.title}
              </h3>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ex.date} | {ex.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Exam Venue</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ex.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Results */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official University Transcript
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              SGPA: {calculatedGPA} / 10.0
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Subject Code</th>
                  <th className="px-5 py-3">Subject Title</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">Grade Point</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {res.subjectCode}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {res.subjectName}
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
                      <Badge variant="success">Passed</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Notices */}
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
                    Issued by: {ntc.department} • Date: {ntc.date}
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
    </div>
  );
}
