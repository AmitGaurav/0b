import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import DiscussionForumPage from './pages/discussion-forum/DiscussionForumPage';
import MySocietyPage from './pages/my-society/MySocietyPage';
import SocietyOnboardingPage from './pages/society-onboarding/SocietyOnboardingPage';
import SocietyRegistrationPage from './pages/society-onboarding/SocietyRegistrationPage';
import SocietyDetailsPage from './pages/society-onboarding/SocietyDetailsPage';
import SocietyVerificationPage from './pages/society-verification/SocietyVerificationPage';
import SocietyProfileManagementPage from './pages/society-onboarding/SocietyProfileManagementPage';
import SocietyMembersPage from './pages/society-onboarding/SocietyMembersPage';
import SocietyUnitsPage from './pages/society-onboarding/SocietyUnitsPage';
import SocietyAmenitiesPage from './pages/society-onboarding/SocietyAmenitiesPage';
import SocietyParkingPage from './pages/society-onboarding/SocietyParkingPage';
import BulkUploadPage from './pages/society-onboarding/BulkUploadPage';
import ReportsPage from './pages/reports/ReportsPage';
import AdminPage from './pages/admin/AdminPage';
import ComplaintsPage from './pages/complaints/ComplaintsPage';
import SuggestionsPage from './pages/suggestions/SuggestionsPage';
import PollsPage from './pages/polls/PollsPage';
import EventsPage from './pages/events/EventsPage';
import MaintenanceRequestsPage from './pages/maintenance-requests/MaintenanceRequestsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import HelpCenterPage from './pages/help/HelpCenterPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import VendorsPage from './pages/vendors/VendorsPage';
import VendorManagementPage from './pages/vendors/VendorManagementPage';
import VendorVerificationPage from './pages/vendors/VendorVerificationPage';
import VendorServicesPage from './pages/vendors/VendorServicesPage';
import VendorDocumentsPage from './pages/vendors/VendorDocumentsPage';
import VendorPaymentsPage from './pages/vendors/VendorPaymentsPage';
import VendorActivityLogPage from './pages/vendors/VendorActivityLogPage';
import VendorContractPage from './pages/vendors/VendorContractPage';
import VendorRatingsAndReviewsPage from './pages/vendors/VendorRatingsAndReviewsPage';
import VendorBulkUploadPage from './pages/vendors/VendorBulkUploadPage';
import VendorRolesPermissionsPage from './pages/vendors/VendorRolesPermissionsPage';
import ActivityAndEventLogPage from './pages/admin/ActivityAndEventLogPage';
import StaffRegistrationPage from './pages/staff/StaffRegistrationPage';
import StaffRegistrationPageSimple from './pages/staff/StaffRegistrationPageSimple';
import StaffRegistrationPageTest from './pages/staff/StaffRegistrationPageTest';
import StaffRegistrationIndustryStandard from './pages/staff/StaffRegistrationIndustryStandard';
import StaffVerificationPage from './pages/staff/StaffVerificationPage';
import StaffProfileManagementPage from './pages/staff/StaffProfileManagementPage';
import StaffRolesPermissionsPage from './pages/staff/StaffRolesPermissionsPage';
import StaffAttendancePage from './pages/staff/StaffAttendancePage';
import SocietyDirectoryPage from './pages/my-society/SocietyDirectoryPage';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/routing/PrivateRoute';
import SocietySelectionWrapper from './components/wrappers/SocietySelectionWrapper';

const App: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SocietySelectionWrapper>
      <Routes>
        {/* Public routes */}
        <Route
          path="/auth/*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </AuthLayout>
            )
          }
        />

        {/* Private routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/discussion-forum" element={<DiscussionForumPage />} />
                  <Route path="/my-society" element={<MySocietyPage />} />
                  <Route path="/my-society/directory" element={<SocietyDirectoryPage />} />
                  <Route path="/society-onboarding" element={<SocietyOnboardingPage />} />
                  <Route path="/society-registration" element={<SocietyRegistrationPage />} />
                  <Route path="/society-details/:id" element={<SocietyDetailsPage />} />
                  <Route path="/society-verification" element={<SocietyVerificationPage />} />
                  <Route path="/society-profile-management" element={<SocietyProfileManagementPage />} />
                  <Route path="/society-settings" element={<SocietyProfileManagementPage />} />
                  <Route path="/society-amenities" element={<SocietyAmenitiesPage />} />
                  <Route path="/society-parking" element={<SocietyParkingPage />} />
                  <Route path="/society-units" element={<SocietyUnitsPage />} />
                  <Route path="/society-members" element={<SocietyMembersPage />} />
                  <Route path="/bulk-upload" element={<BulkUploadPage />} />
                  <Route path="/society-onboarding/bulk-upload" element={<BulkUploadPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/notices" element={<AnnouncementsPage />} />
                  <Route path="/complaints" element={<ComplaintsPage />} />
                  <Route path="/suggestions" element={<SuggestionsPage />} />
                  <Route path="/polls" element={<PollsPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/maintenance-requests" element={<MaintenanceRequestsPage />} />
                  <Route path="/help-center" element={<HelpCenterPage />} />
                  <Route path="/vendors" element={<VendorsPage />} />
                  <Route path="/vendors/registration" element={<VendorManagementPage />} />
                  <Route path="/vendors/verification" element={<VendorVerificationPage />} />
                  <Route path="/vendors/services" element={<VendorServicesPage />} />
                  <Route path="/vendors/documents" element={<VendorDocumentsPage />} />
                  <Route path="/vendors/payments" element={<VendorPaymentsPage />} />
                  <Route path="/vendors/activity-log" element={<VendorActivityLogPage />} />
                  <Route path="/vendors/ratings-reviews" element={<VendorRatingsAndReviewsPage />} />
                  <Route path="/vendors/contracts" element={<VendorContractPage />} />
                  <Route path="/vendors/bulk-upload" element={<VendorBulkUploadPage />} />
                  <Route path="/vendors/roles-permissions" element={<VendorRolesPermissionsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/activity-log" element={<ActivityAndEventLogPage />} />
                  <Route path="/staff/registration" element={<StaffRegistrationIndustryStandard />} />
                  <Route path="/staff/verification" element={<StaffVerificationPage />} />
                  <Route path="/staff/profiles" element={<StaffProfileManagementPage />} />
                  <Route path="/staff/roles-permissions" element={<StaffRolesPermissionsPage />} />
                  <Route path="/staff/profile-management" element={<Navigate to="/staff/profiles" replace />} />
                  <Route path="/staff/register" element={<Navigate to="/staff/registration" replace />} />
                  <Route path="/staff/directory" element={<Navigate to="/staff/profiles" replace />} />
                  <Route path="/staff/attendance" element={<StaffAttendancePage />} />
                  <Route path="/staff/documents" element={<Navigate to="/staff/registration" replace />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </SocietySelectionWrapper>
  );
};

export default App;
