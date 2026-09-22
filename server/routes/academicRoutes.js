import express from 'express';
import { AcademicModel } from '../models/Academic.js';
import { UserModel } from '../models/User.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { generateStudentId } from '../utils/idGenerator.js';
import { hashPassword, generateSalt } from '../utils/crypto.js';

const router = express.Router();

/**
 * GET /api/academic/courses
 */
router.get('/courses', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const courses = await AcademicModel.getCourses(orgId);
  res.json({ success: true, courses });
});

/**
 * GET /api/academic/subjects
 */
router.get('/subjects', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const subjects = await AcademicModel.getSubjects(orgId);
  res.json({ success: true, subjects });
});

/**
 * GET /api/academic/exams
 */
router.get('/exams', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const exams = await AcademicModel.getExams(orgId);
  res.json({ success: true, exams });
});

/**
 * GET /api/academic/results
 */
router.get('/results', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const studentId = req.user.role === 'STUDENT' ? req.user.userId : req.query.studentId;
  const results = await AcademicModel.getResults(orgId, studentId);
  res.json({ success: true, results });
});

/**
 * GET /api/academic/students
 */
router.get('/students', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  // HOD scope: department filter
  const dept = req.user.role === 'HOD' ? req.user.department : req.query.department;
  const students = await AcademicModel.getStudents(orgId, dept);
  res.json({ success: true, students });
});

/**
 * POST /api/academic/students
 * Creates new student account with studentId, user account and salted password hash
 */
router.post('/students', authenticate, async (req, res) => {
  try {
    const { name, email, department, batch, semester, section, phone } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Student name is required.' });
    }

    const orgId = req.user.role === 'PLATFORM_OWNER' && req.body.organizationId
      ? req.body.organizationId
      : req.user.organization_id;

    if (!orgId) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Missing college organization.' });
    }

    // Role check: Only College Admin or HOD can create student accounts
    if (req.user.role !== 'COLLEGE_ADMIN' && req.user.role !== 'HOD' && req.user.role !== 'PLATFORM_OWNER') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only College Admin or HOD can enroll students.' });
    }

    const existingStudents = await AcademicModel.getStudents(orgId);
    const studentId = req.body.studentId && req.body.studentId.includes('-')
      ? req.body.studentId.trim().toUpperCase()
      : generateStudentId(name, department || 'CS', 2026, existingStudents);

    const tempPassword = req.body.tempPassword || `Campus#${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = generateSalt();
    const passwordHash = hashPassword(tempPassword, salt);

    const newStudent = await AcademicModel.createStudent({
      studentId,
      name: name.trim(),
      email: email || `${studentId.toLowerCase()}@brightfuture.demo`,
      department: department || 'Computer Science',
      batch: batch || '2022-2026',
      semester: semester || 'Semester 5',
      section: section || 'A',
      phone: phone || '+91 98450 00000',
      attendance: 90,
      gpa: '8.5',
      status: 'Regular',
      pendingFees: '₹0',
      organizationId: orgId
    });

    await UserModel.saveUser({
      userId: studentId,
      id: studentId,
      name: name.trim(),
      email: email || `${studentId.toLowerCase()}@brightfuture.demo`,
      role: 'STUDENT',
      organization_id: orgId,
      companyId: orgId,
      organizationType: 'COLLEGE',
      department: department || 'Computer Science',
      designation: 'Enrolled Student',
      status: 'Active',
      passwordHash,
      salt,
      mustChangePassword: true,
      permissions: ['courses.view', 'attendance.view', 'results.view', 'fees.view']
    });

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: orgId,
      action: 'STUDENT_ENROLLED',
      module: 'Academics',
      details: `Enrolled student "${name}" with ID [${studentId}] in ${department}`,
      status: 'Success'
    });

    return res.status(201).json({
      success: true,
      student: newStudent,
      studentId,
      tempPassword
    });
  } catch (err) {
    console.error('[Academic Routes] POST /students error:', err);
    return res.status(500).json({ success: false, message: 'Failed to enroll student.' });
  }
});

/**
 * GET /api/academic/notices
 */
router.get('/notices', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const notices = await AcademicModel.getNotices(orgId);
  res.json({ success: true, notices });
});

export default router;
