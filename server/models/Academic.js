import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';
import { matchesTenant } from '../utils/tenantUtils.js';

export const AcademicModel = {
  getCourses: async (orgId) => {
    const list = diskStore.readCollection('academic_courses', [
      { id: 'CRS-CS-01', courseId: 'CRS-CS-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Computer Science & Engineering', code: 'CSE-UG', department: 'Computer Science', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' },
      { id: 'CRS-IT-01', courseId: 'CRS-IT-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Information Technology', code: 'IT-UG', department: 'Information Technology', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' },
      { id: 'CRS-EC-01', courseId: 'CRS-EC-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Electronics & Communication', code: 'ECE-UG', department: 'Electronics', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' }
    ]);
    if (!orgId) return list;
    return list.filter(c => matchesTenant(c, orgId));
  },

  getSubjects: async (orgId) => {
    const list = diskStore.readCollection('academic_subjects', [
      { id: 'SUB-CS-101', subjectCode: 'CS301', name: 'Design & Analysis of Algorithms', department: 'Computer Science', semester: 'Semester 5', credits: 4, faculty: 'Dr. Priya Sharma', organizationId: 'SMR-CMP-0003' },
      { id: 'SUB-CS-102', subjectCode: 'CS302', name: 'Database Management Systems & NoSQL', department: 'Computer Science', semester: 'Semester 5', credits: 4, faculty: 'Prof. Ramesh Rao', organizationId: 'SMR-CMP-0003' },
      { id: 'SUB-CS-103', subjectCode: 'CS303', name: 'Operating Systems & Distributed Architecture', department: 'Computer Science', semester: 'Semester 5', credits: 3, faculty: 'Dr. Priya Sharma', organizationId: 'SMR-CMP-0003' },
      { id: 'SUB-IT-101', subjectCode: 'IT301', name: 'Cloud Computing & Microservices', department: 'Information Technology', semester: 'Semester 5', credits: 4, faculty: 'Prof. Ananya Sen', organizationId: 'SMR-CMP-0003' }
    ]);
    if (!orgId) return list;
    return list.filter(s => matchesTenant(s, orgId));
  },

  getExams: async (orgId) => {
    const list = diskStore.readCollection('academic_exams', [
      { id: 'EXM-CS-01', examId: 'EXM-CS-01', title: 'Mid-Term Exam: Algorithms (CS301)', subjectCode: 'CS301', department: 'Computer Science', semester: 'Semester 5', date: '2026-10-15', time: '10:00 AM - 01:00 PM', room: 'Hall B-201', maxMarks: 100, type: 'Internal', organizationId: 'SMR-CMP-0003' },
      { id: 'EXM-CS-02', examId: 'EXM-CS-02', title: 'Mid-Term Exam: DBMS (CS302)', subjectCode: 'CS302', department: 'Computer Science', semester: 'Semester 5', date: '2026-10-18', time: '10:00 AM - 01:00 PM', room: 'Hall B-204', maxMarks: 100, type: 'Internal', organizationId: 'SMR-CMP-0003' }
    ]);
    if (!orgId) return list;
    return list.filter(e => matchesTenant(e, orgId));
  },

  getResults: async (orgId, studentId = null) => {
    const list = diskStore.readCollection('academic_results', [
      { id: 'RES-01', resultId: 'RES-01', studentId: 'ARUN-CS-2026-001', studentName: 'Arun Kumar', subjectCode: 'CS301', subjectName: 'Algorithms', marks: 88, maxMarks: 100, grade: 'A+', gpa: '9.2', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' },
      { id: 'RES-02', resultId: 'RES-02', studentId: 'ARUN-CS-2026-001', studentName: 'Arun Kumar', subjectCode: 'CS302', subjectName: 'DBMS', marks: 84, maxMarks: 100, grade: 'A', gpa: '8.8', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' },
      { id: 'RES-03', resultId: 'RES-03', studentId: 'DIVYA-CS-2026-002', studentName: 'Divya Nambiar', subjectCode: 'CS301', subjectName: 'Algorithms', marks: 94, maxMarks: 100, grade: 'O', gpa: '9.8', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' }
    ]);
    let filtered = list;
    if (orgId) filtered = filtered.filter(r => matchesTenant(r, orgId));
    if (studentId) {
      const norm = String(studentId).trim().toLowerCase();
      filtered = filtered.filter(r => r.studentId && r.studentId.toLowerCase() === norm);
    }
    return filtered;
  },

  getStudents: async (orgId, dept = null) => {
    const list = diskStore.readCollection('academic_students', [
      { id: 'ARUN-CS-2026-001', studentId: 'ARUN-CS-2026-001', userId: 'ARUN-CS-2026-001', name: 'Arun Kumar', department: 'Computer Science', batch: '2022-2026', semester: 'Semester 5', section: 'A', phone: '+91 98450 11223', email: 'arun.cs@brightfuture.demo', attendance: 88, gpa: '9.0', status: 'Regular', pendingFees: '₹0', organizationId: 'SMR-CMP-0003' },
      { id: 'DIVYA-CS-2026-002', studentId: 'DIVYA-CS-2026-002', userId: 'DIVYA-CS-2026-002', name: 'Divya Nambiar', department: 'Computer Science', batch: '2022-2026', semester: 'Semester 5', section: 'A', phone: '+91 98450 44556', email: 'divya.cs@brightfuture.demo', attendance: 95, gpa: '9.8', status: 'Regular', pendingFees: '₹0', organizationId: 'SMR-CMP-0003' },
      { id: 'ROHIT-CS-2026-003', studentId: 'ROHIT-CS-2026-003', userId: 'ROHIT-CS-2026-003', name: 'Rohit Verma', department: 'Computer Science', batch: '2022-2026', semester: 'Semester 5', section: 'B', phone: '+91 98450 77889', email: 'rohit.cs@brightfuture.demo', attendance: 68, gpa: '6.5', status: 'At Risk', pendingFees: '₹25,000', organizationId: 'SMR-CMP-0003' }
    ]);
    let filtered = list;
    if (orgId) filtered = filtered.filter(s => matchesTenant(s, orgId));
    if (dept) {
      const normDept = String(dept).trim().toLowerCase();
      filtered = filtered.filter(s => s.department && s.department.toLowerCase().includes(normDept));
    }
    return filtered;
  },

  createStudent: async (studentData) => {
    const list = diskStore.readCollection('academic_students', []);
    const record = {
      ...studentData,
      id: studentData.studentId,
      userId: studentData.studentId,
      status: studentData.status || 'Regular',
      createdAt: new Date().toISOString()
    };
    list.push(record);
    diskStore.writeCollection('academic_students', list);
    return record;
  },

  getNotices: async (orgId) => {
    const list = diskStore.readCollection('academic_notices', [
      { id: 'NTC-01', title: 'Semester 5 Examination Schedule & Hall Ticket Download', date: '2026-09-20', department: 'Academic Directorate', priority: 'High', organizationId: 'SMR-CMP-0003' },
      { id: 'NTC-02', title: 'Annual Smart India Hackathon internal campus trials', date: '2026-09-18', department: 'Computer Science', priority: 'Medium', organizationId: 'SMR-CMP-0003' },
      { id: 'NTC-03', title: 'Tuition Fee Due Date & Scholarship verification deadline', date: '2026-09-15', department: 'Accounts', priority: 'High', organizationId: 'SMR-CMP-0003' }
    ]);
    if (!orgId) return list;
    return list.filter(n => matchesTenant(n, orgId));
  }
};
