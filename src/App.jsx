// Main Application Component for SMARTORA
// Universal AI-Powered Business Management & Automation Platform
// 5-Tier Hierarchical SaaS Architecture & Multi-Tenant Routing

import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import EmployeesPage from './pages/EmployeesPage';
import StudentsPage from './pages/StudentsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import TasksPage from './pages/TasksPage';
import AttendancePage from './pages/AttendancePage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import InvoicesPage from './pages/InvoicesPage';
import SuppliersPage from './pages/SuppliersPage';
import ProjectsPage from './pages/ProjectsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AutomationPage from './pages/AutomationPage';
import ExpensesPage from './pages/ExpensesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import FinancePage from './pages/FinancePage';

// 5-Tier Dedicated Role Dashboards
import PlatformDashboard from './pages/platform/PlatformDashboard';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import EndUserDashboard from './pages/user/EndUserDashboard';
import CollegeHODDashboard from './pages/college/CollegeHODDashboard';

// Category Domain Pages (College Academic & Hotel Hospitality)
import CollegeAcademicPage from './pages/college/CollegeAcademicPage';
import HotelRoomsPage from './pages/hotel/HotelRoomsPage';
import HotelFrontDeskPage from './pages/hotel/HotelFrontDeskPage';
import HotelHousekeepingPage from './pages/hotel/HotelHousekeepingPage';

// AI Intelligence Layer Pages (RAG Knowledge Base & Agent Activity)
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AgentActivityPage from './pages/AgentActivityPage';

import { useAuth } from './context/AuthContext';
import { ROLES } from './data/mockData';

export default function App() {
  const { isAuthenticated, currentUser, loginDemo } = useAuth();

  // Determine default landing page by role
  const getDefaultPageForRole = (user) => {
    if (!user) return 'dashboard';
    switch (user.role) {
      case ROLES.PLATFORM_OWNER:
        return 'platform-dashboard';
      case ROLES.DEPARTMENT_MANAGER:
        return 'department-dashboard';
      case ROLES.STAFF:
        return 'staff-dashboard';
      case ROLES.END_USER:
        return 'user-dashboard';
      case ROLES.COMPANY_ADMIN:
      default:
        return 'dashboard';
    }
  };

  // Read initial route from URL hash or default to role-appropriate dashboard if authenticated, else landing
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) return hash;
    return isAuthenticated ? getDefaultPageForRole(currentUser) : 'landing';
  });

  // Sync route with URL hash for seamless bookmarking & history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = `#/${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoLogin = (roleKey) => {
    const user = loginDemo(roleKey);
    const targetPage = getDefaultPageForRole(user);
    navigateTo(targetPage);
  };

  // Render Public Pages without the App Shell Layout
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={navigateTo} onDemoLogin={handleDemoLogin} />;
  }

  if (currentPage === 'login') {
    return <Login onNavigate={navigateTo} />;
  }

  if (currentPage === 'register') {
    return <Register onNavigate={navigateTo} />;
  }

  // Render Authenticated Dashboard Pages inside Reusable App Shell
  const renderCurrentPage = () => {
    switch (currentPage) {
      // 5-Tier Dedicated Role Pages
      case 'platform-dashboard':
        return <PlatformDashboard onNavigate={navigateTo} />;
      case 'department-dashboard':
        return <DepartmentDashboard onNavigate={navigateTo} />;
      case 'staff-dashboard':
        return <StaffDashboard onNavigate={navigateTo} />;
      case 'user-dashboard':
        return <EndUserDashboard onNavigate={navigateTo} />;

      // Core Company Admin & Operations Pages
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'sales':
        return <SalesPage onNavigate={navigateTo} />;
      case 'invoices':
        return <InvoicesPage onNavigate={navigateTo} />;
      case 'inventory':
        return <InventoryPage onNavigate={navigateTo} />;
      case 'suppliers':
        return <SuppliersPage onNavigate={navigateTo} />;
      case 'projects':
        return <ProjectsPage onNavigate={navigateTo} />;
      case 'appointments':
        return <AppointmentsPage onNavigate={navigateTo} />;
      case 'tasks':
        return <TasksPage onNavigate={navigateTo} />;
      case 'automation':
        return <AutomationPage onNavigate={navigateTo} />;
      case 'expenses':
        return <ExpensesPage onNavigate={navigateTo} />;
      case 'finance':
      case 'company-finance':
        return <FinancePage onNavigate={navigateTo} />;
      case 'users':
        return <UsersPage onNavigate={navigateTo} />;
      case 'employees':
      case 'faculty':
      case 'staff':
        return <EmployeesPage onNavigate={navigateTo} />;
      case 'students':
        return <StudentsPage onNavigate={navigateTo} />;
      case 'departments':
      case 'department':
      case 'my-department':
        return <DepartmentsPage onNavigate={navigateTo} />;
      case 'attendance':
        return <AttendancePage onNavigate={navigateTo} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={navigateTo} />;
      case 'ai-assistant':
        return <AIAssistantPage onNavigate={navigateTo} />;
      case 'knowledge-base':
      case 'dept-docs':
        return <KnowledgeBasePage onNavigate={navigateTo} />;
      case 'agent-activity':
        return <AgentActivityPage onNavigate={navigateTo} />;
      case 'notifications':
        return <NotificationsPage onNavigate={navigateTo} />;
      case 'reports':
        return <ReportsPage onNavigate={navigateTo} />;
      case 'settings':
        return <SettingsPage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;

      // Category Domain Specific Pages
      case 'college-dashboard':
        return <CollegeHODDashboard onNavigate={navigateTo} />;
      case 'academic':
      case 'courses':
        return <CollegeAcademicPage initialTab="courses" onNavigate={navigateTo} />;
      case 'subjects':
      case 'assignments':
        return <CollegeAcademicPage initialTab="subjects" onNavigate={navigateTo} />;
      case 'classes':
      case 'sections':
        return <CollegeAcademicPage initialTab="courses" onNavigate={navigateTo} />;
      case 'exams':
      case 'timetable':
        return <CollegeAcademicPage initialTab="exams" onNavigate={navigateTo} />;
      case 'results':
        return <CollegeAcademicPage initialTab="results" onNavigate={navigateTo} />;
      case 'notices':
      case 'dept-notices':
        return <CollegeAcademicPage initialTab="notices" onNavigate={navigateTo} />;
      case 'dept-tasks':
        return <TasksPage onNavigate={navigateTo} />;
      case 'rooms':
        return <HotelRoomsPage onNavigate={navigateTo} />;
      case 'front-desk':
        return <HotelFrontDeskPage onNavigate={navigateTo} />;
      case 'housekeeping':
        return <HotelHousekeepingPage onNavigate={navigateTo} />;

      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={navigateTo}>
      {renderCurrentPage()}
    </Layout>
  );
}
