import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout, CandidateLayout, HRLayout, AdminLayout } from '@layouts'
import { ProtectedRoute, NotFound, Unauthorized, LoadingSpinner } from '@shared/components'
import { ROLES } from '@shared/constants'

// --- Public Pages ---
const HomePage = lazy(() => import('@pages/HomePage'))
const LoginPage = lazy(() => import('@pages/LoginPage'))
const RegisterPage = lazy(() => import('@pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@pages/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@pages/VerifyEmailPage'))
const VerifyEmailPendingPage = lazy(() => import('@pages/VerifyEmailPendingPage'))
const JobListPage = lazy(() => import('@pages/JobListPage'))
const JobDetailPage = lazy(() => import('@pages/JobDetailPage'))
const FaqsPage = lazy(() => import('@pages/FaqsPage'))
const AboutPage = lazy(() => import('@pages/AboutPage'))
const PrivacyPolicyPage = lazy(() => import('@pages/policies/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@pages/policies/TermsPage'))
const NotificationsPage = lazy(() => import('@pages/NotificationsPage'))

// --- Candidate Pages ---
const CandidateDashboard = lazy(() => import('@pages/candidate/CandidateDashboard'))
const CvManagerPage = lazy(() => import('@pages/candidate/CvManagerPage'))
const MyProfilePage = lazy(() => import('@pages/candidate/MyProfilePage'))
const SavedJobsPage = lazy(() => import('@pages/candidate/SavedJobsPage'))
const AppliedJobsPage = lazy(() => import('@pages/candidate/AppliedJobsPage'))

// --- HR Pages ---
const HRDashboard = lazy(() => import('@pages/hr/HRDashboard'))
const CompanyProfilePage = lazy(() => import('@pages/hr/CompanyProfilePage'))
const MyJobsPage = lazy(() => import('@pages/hr/MyJobsPage'))
const CreateJobPage = lazy(() => import('@pages/hr/CreateJobPage'))
const EditJobPage = lazy(() => import('@pages/hr/EditJobPage'))
const KanbanBoardPage = lazy(() => import('@pages/hr/KanbanBoardPage'))
const CandidatesPage = lazy(() => import('@pages/hr/CandidatesPage'))

// --- Admin Pages ---
const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard'))
const ManageCompaniesPage = lazy(() => import('@pages/admin/ManageCompaniesPage'))
const SystemSettingsPage = lazy(() => import('@pages/admin/SystemSettingsPage'))
const ManageUsersPage = lazy(() => import('@pages/admin/ManageUsersPage'))
const ManageJobsPage = lazy(() => import('@pages/admin/ManageJobsPage'))
const AdminChatCenter = lazy(() => import('@pages/admin/AdminChatCenter'))
const ManageContentsPage = lazy(() => import('@pages/admin/ManageContentsPage'))

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ===== AUTH ROUTES (Full Screen) ===== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email-pending" element={<VerifyEmailPendingPage />} />

        {/* ===== PUBLIC ROUTES ===== */}
        {/* ===== PUBLIC ROUTES ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* ===== CANDIDATE ROUTES ===== */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/cv" element={<CvManagerPage />} />
          <Route path="/candidate/jobs" element={<JobListPage />} />
          <Route path="/candidate/jobs/:id" element={<JobDetailPage />} />
          <Route path="/candidate/profile" element={<MyProfilePage />} />
          <Route path="/candidate/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/candidate/applied-jobs" element={<AppliedJobsPage />} />
          <Route path="/candidate/notifications" element={<NotificationsPage />} />
          {/* Thêm candidate routes ở đây */}
        </Route>

        {/* ===== HR ROUTES ===== */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.HR]}>
              <HRLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/profile" element={<MyProfilePage />} />
          <Route path="/hr/company" element={<CompanyProfilePage />} />
          <Route path="/hr/jobs" element={<MyJobsPage />} />
          <Route path="/hr/jobs/create" element={<CreateJobPage />} />
          <Route path="/hr/jobs/:id/edit" element={<EditJobPage />} />
          <Route path="/hr/jobs/:jobId/applications" element={<KanbanBoardPage />} />
          <Route path="/hr/candidates" element={<CandidatesPage />} />
          <Route path="/hr/notifications" element={<NotificationsPage />} />
        </Route>

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/jobs" element={<ManageJobsPage />} />
          <Route path="/admin/support" element={<AdminChatCenter />} />
          <Route path="/admin/companies" element={<ManageCompaniesPage />} />
          <Route path="/admin/contents" element={<ManageContentsPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          {/* Thêm admin routes ở đây */}
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
