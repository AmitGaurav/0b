import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiSettings, 
  FiBarChart2, 
  FiFileText,
  FiMapPin,
  FiUserPlus,
  FiDollarSign,
  FiPieChart,
  FiShield,
  FiMail,
  FiMessageCircle,
  FiCheckSquare,
  FiGrid,
  FiTruck,
  FiCheckCircle,
  FiEdit,
  FiUpload,
  FiLayers,
  FiChevronDown,
  FiChevronRight,
  FiPackage,
  FiClock,
  FiStar,
  FiCreditCard,
  FiPhone,
  FiActivity,
  FiCalendar,
  FiBell,
  FiBook,
  FiClipboard,
  FiTool,
  FiAlertTriangle,
  FiCamera,
  FiKey,
  FiEye,
  FiArchive,
  FiTarget,
  FiAward,
  FiDatabase,
  FiLifeBuoy,
  FiMonitor,
  FiRefreshCw,
  FiDownload,
  FiSliders,
  FiLock,
  FiGlobe,
  FiHardDrive,
  FiServer,
  FiWifi,
  FiTrendingUp,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 256px;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
`;

const LogoSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  overflow-y: auto;
`;

const NavSection = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[4]};
  
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
    border-right: 3px solid ${({ theme }) => theme.colors.primary[500]};
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const SubNavList = styled.ul<{ expanded: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: ${({ theme }) => theme.spacing[6]};
  max-height: ${({ expanded }) => expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const SubNavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const SubNavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transition.colors};
  border-left: 2px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[700]};
    border-left-color: ${({ theme }) => theme.colors.gray[300]};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
    border-left-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ParentNavItemLink = styled.div<{ hasActiveChild?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, hasActiveChild }) => hasActiveChild ? theme.colors.primary[700] : theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transition.colors};
  cursor: pointer;
  background: ${({ theme, hasActiveChild }) => hasActiveChild ? theme.colors.primary[50] : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
`;

interface NavItemType {
  name: string;
  href?: string;
  icon: React.ComponentType;
  children?: NavItemType[];
}

// MAIN (User/Guest) Navigation
const mainNavItems: NavItemType[] = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'My Society', href: '/my-society', icon: FiMapPin },
  { name: 'Complaints', href: '/complaints', icon: FiMessageCircle },
  { name: 'Suggestions', href: '/suggestions', icon: HiLightBulb },
  { name: 'Discussion Forum', href: '/discussion-forum', icon: FiMail },
  { name: 'Announcements', href: '/announcements', icon: FiBell },
  { name: 'Polls', href: '/polls', icon: FiCheckSquare },
  { name: 'Surveys', href: '/surveys', icon: FiClipboard },
  { name: 'Events', href: '/events', icon: FiCalendar },
  { name: 'Notices', href: '/notices', icon: FiFileText },
  { name: 'Documents', href: '/documents', icon: FiBook },
  { name: 'Forms', href: '/forms', icon: FiEdit },
  { name: 'Maintenance Requests', href: '/maintenance-requests', icon: FiTool },
  { name: 'Feedback', href: '/feedback', icon: FiStar },
  { name: 'Vendor Ratings & Reviews', href: '/vendors/ratings-reviews', icon: FiStar },
];

// ADMIN (Admin/Super-Admin) Navigation
const adminNavItems: NavItemType[] = [
  { name: 'Activity & Event Log', href: '/admin/activity-log', icon: FiActivity },
  {
    name: 'Vendors',
    icon: FiPackage,
    children: [
      { name: 'Vendor Management', href: '/vendors/registration', icon: FiUserPlus },
      { name: 'Vendor Verification', href: '/vendors/verification', icon: FiCheckCircle },
      { name: 'Vendor Services', href: '/vendors/services', icon: FiGrid },
      { name: 'Vendor Documents', href: '/vendors/documents', icon: FiBook },
      { name: 'Vendor Contracts', href: '/vendors/contracts', icon: FiFileText },
      { name: 'Vendor Payments', href: '/vendors/payments', icon: FiCreditCard },
      { name: 'Vendor Communication', href: '/vendors/communication', icon: FiMail },
      { name: 'Vendor Activity Log', href: '/vendors/activity-log', icon: FiActivity },
      { name: 'Vendor Roles and Permissions', href: '/vendors/roles-permissions', icon: FiKey },
      { name: 'Vendor Bulk Upload', href: '/vendors/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Staff',
    icon: FiUsers,
    children: [
      { name: 'Staff Registration', href: '/staff/registration', icon: FiUserPlus },
      { name: 'Staff Verification', href: '/staff/verification', icon: FiCheckCircle },
      { name: 'Staff Profile Management', href: '/staff/profile-management', icon: FiEdit },
      { name: 'Staff Roles & Permissions', href: '/staff/roles-permissions', icon: FiKey },
      { name: 'Staff Attendance', href: '/staff/attendance', icon: FiClock },
      { name: 'Staff Payroll', href: '/staff/payroll', icon: FiDollarSign },
      { name: 'Staff Documents', href: '/staff/documents', icon: FiBook },
      { name: 'Staff Communication', href: '/staff/communication', icon: FiMail },
      { name: 'Staff Activity Log', href: '/staff/activity-log', icon: FiActivity },
      { name: 'Staff Bulk Upload', href: '/staff/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Security',
    icon: FiShield,
    children: [
      { name: 'Security Personnel Management', href: '/security/personnel', icon: FiUsers },
      { name: 'Security Schedule Management', href: '/security/schedule', icon: FiCalendar },
      { name: 'Security Incident Reporting', href: '/security/incidents', icon: FiAlertTriangle },
      { name: 'Security Patrol Management', href: '/security/patrol', icon: FiEye },
      { name: 'Security Access Control', href: '/security/access-control', icon: FiKey },
      { name: 'Security Communication', href: '/security/communication', icon: FiMail },
      { name: 'Security Activity Log', href: '/security/activity-log', icon: FiActivity },
      { name: 'Security Roles and Permissions', href: '/security/roles-permissions', icon: FiLock },
      { name: 'Security Bulk Upload', href: '/security/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Facilities',
    icon: FiGrid,
    children: [
      { name: 'Facility Booking', href: '/facilities/booking', icon: FiCalendar },
      { name: 'Facility Management', href: '/facilities/management', icon: FiSettings },
      { name: 'Facility Maintenance', href: '/facilities/maintenance', icon: FiTool },
      { name: 'Facility Usage Reports', href: '/facilities/usage-reports', icon: FiBarChart2 },
      { name: 'Facility Feedback', href: '/facilities/feedback', icon: FiStar },
      { name: 'Facility Communication', href: '/facilities/communication', icon: FiMail },
      { name: 'Facility Activity Log', href: '/facilities/activity-log', icon: FiActivity },
      { name: 'Facility Roles and Permissions', href: '/facilities/roles-permissions', icon: FiKey },
      { name: 'Facility Bulk Upload', href: '/facilities/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Events',
    icon: FiCalendar,
    children: [
      { name: 'Event Creation', href: '/admin/events/creation', icon: FiEdit },
      { name: 'Event Management', href: '/admin/events/management', icon: FiSettings },
      { name: 'Event Invitations', href: '/admin/events/invitations', icon: FiMail },
      { name: 'Event RSVPs', href: '/admin/events/rsvps', icon: FiCheckCircle },
      { name: 'Event Reminders', href: '/admin/events/reminders', icon: FiBell },
      { name: 'Event Feedback', href: '/admin/events/feedback', icon: FiStar },
      { name: 'Event Communication', href: '/admin/events/communication', icon: FiMail },
      { name: 'Event Activity Log', href: '/admin/events/activity-log', icon: FiActivity },
      { name: 'Event Roles and Permissions', href: '/admin/events/roles-permissions', icon: FiKey },
      { name: 'Event Bulk Upload', href: '/admin/events/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Notices',
    icon: FiFileText,
    children: [
      { name: 'Notice Creation', href: '/admin/notices/creation', icon: FiEdit },
      { name: 'Notice Management', href: '/admin/notices/management', icon: FiSettings },
      { name: 'Notice Distribution', href: '/admin/notices/distribution', icon: FiMail },
      { name: 'Notice Acknowledgements', href: '/admin/notices/acknowledgements', icon: FiCheckCircle },
      { name: 'Notice Reminders', href: '/admin/notices/reminders', icon: FiBell },
      { name: 'Notice Feedback', href: '/admin/notices/feedback', icon: FiStar },
      { name: 'Notice Communication', href: '/admin/notices/communication', icon: FiMail },
      { name: 'Notice Activity Log', href: '/admin/notices/activity-log', icon: FiActivity },
      { name: 'Notice Roles and Permissions', href: '/admin/notices/roles-permissions', icon: FiKey },
      { name: 'Notice Bulk Upload', href: '/admin/notices/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Documents',
    icon: FiBook,
    children: [
      { name: 'Document Upload', href: '/admin/documents/upload', icon: FiUpload },
      { name: 'Document Management', href: '/admin/documents/management', icon: FiSettings },
      { name: 'Document Sharing', href: '/admin/documents/sharing', icon: FiMail },
      { name: 'Document Access Control', href: '/admin/documents/access-control', icon: FiKey },
      { name: 'Document Feedback', href: '/admin/documents/feedback', icon: FiStar },
      { name: 'Document Communication', href: '/admin/documents/communication', icon: FiMail },
      { name: 'Document Activity Log', href: '/admin/documents/activity-log', icon: FiActivity },
      { name: 'Document Roles and Permissions', href: '/admin/documents/roles-permissions', icon: FiKey },
      { name: 'Document Bulk Upload', href: '/admin/documents/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Forms & Surveys',
    icon: FiClipboard,
    children: [
      { name: 'Form Creation', href: '/admin/forms/creation', icon: FiEdit },
      { name: 'Form Management', href: '/admin/forms/management', icon: FiSettings },
      { name: 'Form Distribution', href: '/admin/forms/distribution', icon: FiMail },
      { name: 'Form Responses', href: '/admin/forms/responses', icon: FiCheckCircle },
      { name: 'Survey Creation', href: '/admin/surveys/creation', icon: FiEdit },
      { name: 'Survey Management', href: '/admin/surveys/management', icon: FiSettings },
      { name: 'Survey Distribution', href: '/admin/surveys/distribution', icon: FiMail },
      { name: 'Survey Responses', href: '/admin/surveys/responses', icon: FiCheckCircle },
      { name: 'Forms and Surveys Feedback', href: '/admin/forms-surveys/feedback', icon: FiStar },
      { name: 'Forms and Surveys Communication', href: '/admin/forms-surveys/communication', icon: FiMail },
      { name: 'Forms and Surveys Activity Log', href: '/admin/forms-surveys/activity-log', icon: FiActivity },
      { name: 'Forms and Surveys Roles and Permissions', href: '/admin/forms-surveys/roles-permissions', icon: FiKey },
      { name: 'Forms and Surveys Bulk Upload', href: '/admin/forms-surveys/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Maintenance',
    icon: FiTool,
    children: [
      { name: 'Maintenance Request Management', href: '/admin/maintenance/requests', icon: FiClipboard },
      { name: 'Maintenance Schedule Management', href: '/admin/maintenance/schedule', icon: FiCalendar },
      { name: 'Maintenance Staff Assignment', href: '/admin/maintenance/staff', icon: FiUsers },
      { name: 'Maintenance Status Tracking', href: '/admin/maintenance/tracking', icon: FiActivity },
      { name: 'Maintenance Feedback', href: '/admin/maintenance/feedback', icon: FiStar },
      { name: 'Maintenance Communication', href: '/admin/maintenance/communication', icon: FiMail },
      { name: 'Maintenance Activity Log', href: '/admin/maintenance/activity-log', icon: FiActivity },
      { name: 'Maintenance Roles and Permissions', href: '/admin/maintenance/roles-permissions', icon: FiKey },
      { name: 'Maintenance Bulk Upload', href: '/admin/maintenance/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Parking',
    icon: FiTruck,
    children: [
      { name: 'Parking Slot Management', href: '/admin/parking/slots', icon: FiGrid },
      { name: 'Parking Allocation', href: '/admin/parking/allocation', icon: FiUsers },
      { name: 'Parking Payments', href: '/admin/parking/payments', icon: FiCreditCard },
      { name: 'Parking Violations', href: '/admin/parking/violations', icon: FiAlertTriangle },
      { name: 'Parking Feedback', href: '/admin/parking/feedback', icon: FiStar },
      { name: 'Parking Communication', href: '/admin/parking/communication', icon: FiMail },
      { name: 'Parking Activity Log', href: '/admin/parking/activity-log', icon: FiActivity },
      { name: 'Parking Roles and Permissions', href: '/admin/parking/roles-permissions', icon: FiKey },
      { name: 'Parking Bulk Upload', href: '/admin/parking/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Inventory',
    icon: FiArchive,
    children: [
      { name: 'Inventory Item Management', href: '/admin/inventory/items', icon: FiPackage },
      { name: 'Inventory Stock Management', href: '/admin/inventory/stock', icon: FiDatabase },
      { name: 'Inventory Supplier Management', href: '/admin/inventory/suppliers', icon: FiUsers },
      { name: 'Inventory Orders', href: '/admin/inventory/orders', icon: FiClipboard },
      { name: 'Inventory Feedback', href: '/admin/inventory/feedback', icon: FiStar },
      { name: 'Inventory Communication', href: '/admin/inventory/communication', icon: FiMail },
      { name: 'Inventory Activity Log', href: '/admin/inventory/activity-log', icon: FiActivity },
      { name: 'Inventory Roles and Permissions', href: '/admin/inventory/roles-permissions', icon: FiKey },
      { name: 'Inventory Bulk Upload', href: '/admin/inventory/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Sustainability',
    icon: FiTarget,
    children: [
      { name: 'Sustainability Initiative Management', href: '/admin/sustainability/initiatives', icon: FiTarget },
      { name: 'Sustainability Goals Tracking', href: '/admin/sustainability/goals', icon: FiTrendingUp },
      { name: 'Sustainability Events', href: '/admin/sustainability/events', icon: FiCalendar },
      { name: 'Sustainability Feedback', href: '/admin/sustainability/feedback', icon: FiStar },
      { name: 'Sustainability Communication', href: '/admin/sustainability/communication', icon: FiMail },
      { name: 'Sustainability Activity Log', href: '/admin/sustainability/activity-log', icon: FiActivity },
      { name: 'Sustainability Roles and Permissions', href: '/admin/sustainability/roles-permissions', icon: FiKey },
      { name: 'Sustainability Bulk Upload', href: '/admin/sustainability/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Legal & Compliance',
    icon: FiShield,
    children: [
      { name: 'Legal Document Management', href: '/admin/legal/documents', icon: FiBook },
      { name: 'Compliance Tracking', href: '/admin/legal/compliance', icon: FiCheckCircle },
      { name: 'Legal Notices', href: '/admin/legal/notices', icon: FiFileText },
      { name: 'Compliance Audits', href: '/admin/legal/audits', icon: FiEye },
      { name: 'Legal Feedback', href: '/admin/legal/feedback', icon: FiStar },
      { name: 'Legal Communication', href: '/admin/legal/communication', icon: FiMail },
      { name: 'Legal Activity Log', href: '/admin/legal/activity-log', icon: FiActivity },
      { name: 'Legal Roles and Permissions', href: '/admin/legal/roles-permissions', icon: FiKey },
      { name: 'Legal Bulk Upload', href: '/admin/legal/bulk-upload', icon: FiUpload },
    ]
  }
];

// Continue with Finance and other admin sections...
const adminNavItems2: NavItemType[] = [
  {
    name: 'Finance',
    icon: FiDollarSign,
    children: [
      { name: 'Expense Tracking', href: '/admin/finance/expenses', icon: FiTrendingUp },
      { name: 'Budget Management', href: '/admin/finance/budget', icon: FiPieChart },
      { name: 'Payments Processing', href: '/admin/finance/payments', icon: FiCreditCard },
      { name: 'Tax Management', href: '/admin/finance/tax', icon: FiFileText },
      { name: 'Audit Management', href: '/admin/finance/audit', icon: FiEye },
      { name: 'Fund Management', href: '/admin/finance/funds', icon: FiDollarSign },
      { name: 'Invoicing', href: '/admin/finance/invoicing', icon: FiFileText },
      { name: 'Vendor Payments', href: '/admin/finance/vendor-payments', icon: FiCreditCard },
      { name: 'Investments', href: '/admin/finance/investments', icon: FiTrendingUp },
      { name: 'Loans', href: '/admin/finance/loans', icon: FiDollarSign },
      { name: 'Membership Fees', href: '/admin/finance/membership-fees', icon: FiUsers },
      { name: 'Financial Announcements', href: '/admin/finance/announcements', icon: FiBell },
      { name: 'Financial Calendar', href: '/admin/finance/calendar', icon: FiCalendar },
      { name: 'Feedback and Suggestions', href: '/admin/finance/feedback', icon: FiStar },
      { name: 'Financial Documents', href: '/admin/finance/documents', icon: FiBook },
      { name: 'Financial Events', href: '/admin/finance/events', icon: FiCalendar },
      { name: 'Financial Forms', href: '/admin/finance/forms', icon: FiEdit },
      { name: 'Financial Surveys', href: '/admin/finance/surveys', icon: FiClipboard },
      { name: 'Financial Polls', href: '/admin/finance/polls', icon: FiCheckSquare },
      { name: 'Financial Notices', href: '/admin/finance/notices', icon: FiFileText },
      { name: 'Financial Transactions', href: '/admin/finance/transactions', icon: FiDollarSign },
      { name: 'Financial Reports', href: '/admin/finance/reports', icon: FiBarChart2 },
      { name: 'Legal and Compliance', href: '/admin/finance/legal', icon: FiShield },
    ]
  },
  {
    name: 'Reports',
    icon: FiPieChart,
    children: [
      { name: 'Society Reports', href: '/admin/reports/society', icon: FiMapPin },
      { name: 'Member Reports', href: '/admin/reports/members', icon: FiUsers },
      { name: 'Vendor Reports', href: '/admin/reports/vendors', icon: FiPackage },
      { name: 'Staff Reports', href: '/admin/reports/staff', icon: FiUsers },
      { name: 'Security Reports', href: '/admin/reports/security', icon: FiShield },
      { name: 'Facility Reports', href: '/admin/reports/facilities', icon: FiGrid },
      { name: 'Event Reports', href: '/admin/reports/events', icon: FiCalendar },
      { name: 'Notice Reports', href: '/admin/reports/notices', icon: FiFileText },
      { name: 'Document Reports', href: '/admin/reports/documents', icon: FiBook },
      { name: 'Forms and Surveys Reports', href: '/admin/reports/forms-surveys', icon: FiClipboard },
      { name: 'Maintenance Reports', href: '/admin/reports/maintenance', icon: FiTool },
      { name: 'Parking Reports', href: '/admin/reports/parking', icon: FiTruck },
      { name: 'Inventory Reports', href: '/admin/reports/inventory', icon: FiArchive },
      { name: 'Sustainability Reports', href: '/admin/reports/sustainability', icon: FiTarget },
      { name: 'Legal and Compliance Reports', href: '/admin/reports/legal', icon: FiShield },
      { name: 'Finance Reports', href: '/admin/reports/finance', icon: FiDollarSign },
    ]
  },
  {
    name: 'Analytics',
    icon: FiBarChart2,
    children: [
      { name: 'Society Analytics', href: '/admin/analytics/society', icon: FiMapPin },
      { name: 'Member Analytics', href: '/admin/analytics/members', icon: FiUsers },
      { name: 'Vendor Analytics', href: '/admin/analytics/vendors', icon: FiPackage },
      { name: 'Staff Analytics', href: '/admin/analytics/staff', icon: FiUsers },
      { name: 'Security Analytics', href: '/admin/analytics/security', icon: FiShield },
      { name: 'Facility Analytics', href: '/admin/analytics/facilities', icon: FiGrid },
      { name: 'Event Analytics', href: '/admin/analytics/events', icon: FiCalendar },
      { name: 'Notice Analytics', href: '/admin/analytics/notices', icon: FiFileText },
      { name: 'Document Analytics', href: '/admin/analytics/documents', icon: FiBook },
      { name: 'Forms and Surveys Analytics', href: '/admin/analytics/forms-surveys', icon: FiClipboard },
      { name: 'Maintenance Analytics', href: '/admin/analytics/maintenance', icon: FiTool },
      { name: 'Parking Analytics', href: '/admin/analytics/parking', icon: FiTruck },
      { name: 'Inventory Analytics', href: '/admin/analytics/inventory', icon: FiArchive },
      { name: 'Sustainability Analytics', href: '/admin/analytics/sustainability', icon: FiTarget },
      { name: 'Legal and Compliance Analytics', href: '/admin/analytics/legal', icon: FiShield },
      { name: 'Finance Analytics', href: '/admin/analytics/finance', icon: FiDollarSign },
    ]
  },
  {
    name: 'User Management',
    icon: FiUserCheck,
    children: [
      { name: 'User Registration', href: '/admin/users/registration', icon: FiUserPlus },
      { name: 'User Verification', href: '/admin/users/verification', icon: FiCheckCircle },
      { name: 'User Profile Management', href: '/admin/users/profile-management', icon: FiEdit },
      { name: 'User Roles & Permissions', href: '/admin/users/roles-permissions', icon: FiKey },
      { name: 'User Activity Log', href: '/admin/users/activity-log', icon: FiActivity },
      { name: 'User Communication', href: '/admin/users/communication', icon: FiMail },
      { name: 'User Bulk Upload', href: '/admin/users/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Role Management',
    icon: FiKey,
    children: [
      { name: 'Create Roles', href: '/admin/roles/create', icon: FiEdit },
      { name: 'Assign Permissions', href: '/admin/roles/permissions', icon: FiKey },
      { name: 'Manage Users', href: '/admin/roles/manage-users', icon: FiUsers },
    ]
  },
  {
    name: 'Settings',
    icon: FiSettings,
    children: [
      { name: 'System Settings', href: '/admin/settings/system', icon: FiSettings },
      { name: 'Notification Settings', href: '/admin/settings/notifications', icon: FiBell },
      { name: 'Payment Settings', href: '/admin/settings/payments', icon: FiCreditCard },
      { name: 'Security Settings', href: '/admin/settings/security', icon: FiShield },
      { name: 'Privacy Settings', href: '/admin/settings/privacy', icon: FiLock },
      { name: 'Backup Settings', href: '/admin/settings/backup', icon: FiHardDrive },
      { name: 'Restore Settings', href: '/admin/settings/restore', icon: FiRefreshCw },
      { name: 'API Access', href: '/admin/settings/api', icon: FiGlobe },
      { name: 'Data Export', href: '/admin/settings/export', icon: FiDownload },
      { name: 'Data Import', href: '/admin/settings/import', icon: FiUpload },
      { name: 'Integration Settings', href: '/admin/settings/integrations', icon: FiWifi },
      { name: 'Customization Settings', href: '/admin/settings/customization', icon: FiSliders },
      { name: 'Audit Log', href: '/admin/settings/audit-log', icon: FiActivity },
      { name: 'Logout', href: '/logout', icon: FiUserX },
    ]
  },
  {
    name: 'Audit Logs',
    icon: FiActivity,
    children: [
      { name: 'View Audit Logs', href: '/admin/audit/view', icon: FiEye },
      { name: 'Search Audit Logs', href: '/admin/audit/search', icon: FiTrendingUp },
      { name: 'Filter Audit Logs', href: '/admin/audit/filter', icon: FiSliders },
      { name: 'Export Audit Logs', href: '/admin/audit/export', icon: FiDownload },
      { name: 'Delete Audit Logs', href: '/admin/audit/delete', icon: FiUserX },
    ]
  },
  {
    name: 'Support Tickets',
    icon: FiLifeBuoy,
    children: [
      { name: 'View Support Tickets', href: '/admin/support/view', icon: FiEye },
      { name: 'Create Support Ticket', href: '/admin/support/create', icon: FiEdit },
      { name: 'Manage Support Tickets', href: '/admin/support/manage', icon: FiSettings },
      { name: 'Support Ticket Communication', href: '/admin/support/communication', icon: FiMail },
      { name: 'Support Ticket Activity Log', href: '/admin/support/activity-log', icon: FiActivity },
    ]
  },
  {
    name: 'Announcements',
    icon: FiBell,
    children: [
      { name: 'Announcement Creation', href: '/admin/announcements/creation', icon: FiEdit },
      { name: 'Announcement Management', href: '/admin/announcements/management', icon: FiSettings },
      { name: 'Announcement Distribution', href: '/admin/announcements/distribution', icon: FiMail },
      { name: 'Announcement Acknowledgements', href: '/admin/announcements/acknowledgements', icon: FiCheckCircle },
      { name: 'Announcement Reminders', href: '/admin/announcements/reminders', icon: FiBell },
      { name: 'Announcement Feedback', href: '/admin/announcements/feedback', icon: FiStar },
      { name: 'Announcement Communication', href: '/admin/announcements/communication', icon: FiMail },
      { name: 'Announcement Activity Log', href: '/admin/announcements/activity-log', icon: FiActivity },
      { name: 'Announcement Roles and Permissions', href: '/admin/announcements/roles-permissions', icon: FiKey },
      { name: 'Announcement Bulk Upload', href: '/admin/announcements/bulk-upload', icon: FiUpload },
    ]
  },
  {
    name: 'Feedback',
    icon: FiStar,
    children: [
      { name: 'Feedback Collection', href: '/admin/feedback/collection', icon: FiStar },
      { name: 'Feedback Management', href: '/admin/feedback/management', icon: FiSettings },
      { name: 'Feedback Analysis', href: '/admin/feedback/analysis', icon: FiBarChart2 },
      { name: 'Feedback Communication', href: '/admin/feedback/communication', icon: FiMail },
      { name: 'Feedback Activity Log', href: '/admin/feedback/activity-log', icon: FiActivity },
      { name: 'Feedback Roles and Permissions', href: '/admin/feedback/roles-permissions', icon: FiKey },
      { name: 'Feedback Bulk Upload', href: '/admin/feedback/bulk-upload', icon: FiUpload },
    ]
  }
];

// PLATFORM-ADMIN (Super-Admin) Navigation
const platformAdminNavItems: NavItemType[] = [
  { 
    name: 'Society Onboarding', 
    icon: FiUserPlus,
    children: [
      { name: 'Society Registration', href: '/society-registration', icon: FiUserPlus },
      { name: 'Society Verification', href: '/society-verification', icon: FiCheckCircle },
      { name: 'Society Profile Management', href: '/society-profile-management', icon: FiEdit },
      { name: 'Society Settings', href: '/society-settings', icon: FiSettings },
      { name: 'Society Amenities', href: '/society-amenities', icon: FiGrid },
      { name: 'Society Parking', href: '/society-parking', icon: FiTruck },
      { name: 'Society Units', href: '/society-units', icon: FiLayers },
      { name: 'Society Members', href: '/society-members', icon: FiUsers },
      { name: 'Bulk Upload', href: '/bulk-upload', icon: FiUpload },
    ]
  },
  { name: 'Analytics', href: '/platform/analytics', icon: FiBarChart2 },
  { name: 'Reports', href: '/platform/reports', icon: FiPieChart },
  { name: 'User Management', href: '/platform/users', icon: FiUserCheck },
  {
    name: 'Role Management',
    icon: FiKey,
    children: [
      { name: 'Create Roles', href: '/platform/roles/create', icon: FiEdit },
      { name: 'Assign Permissions', href: '/platform/roles/permissions', icon: FiKey },
      { name: 'Manage Users', href: '/platform/roles/manage-users', icon: FiUsers },
    ]
  },
  { name: 'System Settings', href: '/platform/settings', icon: FiSettings },
  {
    name: 'Audit Logs',
    icon: FiActivity,
    children: [
      { name: 'View Audit Logs', href: '/platform/audit/view', icon: FiEye },
      { name: 'Search Audit Logs', href: '/platform/audit/search', icon: FiTrendingUp },
      { name: 'Filter Audit Logs', href: '/platform/audit/filter', icon: FiSliders },
      { name: 'Export Audit Logs', href: '/platform/audit/export', icon: FiDownload },
      { name: 'Delete Audit Logs', href: '/platform/audit/delete', icon: FiUserX },
    ]
  },
  {
    name: 'Support Tickets',
    icon: FiLifeBuoy,
    children: [
      { name: 'View Support Tickets', href: '/platform/support/view', icon: FiEye },
      { name: 'Create Support Ticket', href: '/platform/support/create', icon: FiEdit },
      { name: 'Manage Support Tickets', href: '/platform/support/manage', icon: FiSettings },
      { name: 'Support Ticket Communication', href: '/platform/support/communication', icon: FiMail },
      { name: 'Support Ticket Activity Log', href: '/platform/support/activity-log', icon: FiActivity },
    ]
  },
  {
    name: 'Announcements',
    icon: FiBell,
    children: [
      { name: 'Announcement Creation', href: '/platform/announcements/creation', icon: FiEdit },
    ]
  },
  { name: 'System Health', href: '/platform/system-health', icon: FiMonitor },
  { name: 'Maintenance Mode', href: '/platform/maintenance-mode', icon: FiTool },
  {
    name: 'Data Migration',
    icon: FiDatabase,
    children: [
      { name: 'Data Export', href: '/platform/migration/export', icon: FiDownload },
      { name: 'Data Import', href: '/platform/migration/import', icon: FiUpload },
    ]
  },
  {
    name: 'API Management',
    icon: FiGlobe,
    children: [
      { name: 'API Keys', href: '/platform/api/keys', icon: FiKey },
      { name: 'API Usage', href: '/platform/api/usage', icon: FiBarChart2 },
    ]
  },
  {
    name: 'Audit Management',
    icon: FiEye,
    children: [
      { name: 'Audit Scheduling', href: '/platform/audit-management/scheduling', icon: FiCalendar },
      { name: 'Audit Reports', href: '/platform/audit-management/reports', icon: FiFileText },
    ]
  },
  {
    name: 'Subscription Management',
    icon: FiCreditCard,
    children: [
      { name: 'Subscription Plans', href: '/platform/subscription/plans', icon: FiLayers },
      { name: 'Subscription Billing', href: '/platform/subscription/billing', icon: FiDollarSign },
    ]
  },
  {
    name: 'Billing Management',
    icon: FiDollarSign,
    children: [
      { name: 'Billing History', href: '/platform/billing/history', icon: FiClock },
    ]
  },
  {
    name: 'Notification Management',
    icon: FiBell,
    children: [
      { name: 'Notification Templates', href: '/platform/notifications/templates', icon: FiEdit },
      { name: 'Notification Logs', href: '/platform/notifications/logs', icon: FiActivity },
    ]
  },
  {
    name: 'Integration Management',
    icon: FiWifi,
    children: [
      { name: 'Third-Party Integrations', href: '/platform/integrations/third-party', icon: FiGlobe },
      { name: 'Integration Logs', href: '/platform/integrations/logs', icon: FiActivity },
    ]
  },
  {
    name: 'Security Management',
    icon: FiShield,
    children: [
      { name: 'Security Policies', href: '/platform/security/policies', icon: FiLock },
      { name: 'Security Incidents', href: '/platform/security/incidents', icon: FiAlertTriangle },
    ]
  },
  {
    name: 'Compliance Management',
    icon: FiCheckCircle,
    children: [
      { name: 'Compliance Policies', href: '/platform/compliance/policies', icon: FiFileText },
      { name: 'Compliance Reports', href: '/platform/compliance/reports', icon: FiBarChart2 },
    ]
  },
  {
    name: 'Platform Settings',
    icon: FiSliders,
    children: [
      { name: 'General Settings', href: '/platform/settings/general', icon: FiSettings },
      { name: 'Customization Settings', href: '/platform/settings/customization', icon: FiSliders },
    ]
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Society Onboarding']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isChildActive = (children: NavItemType[]) => {
    return children.some(child => child.href && location.pathname === child.href);
  };

  // Determine user role for navigation
  const getUserRole = () => {
    if (!user) return 'guest';
    // This is a simplified role check - you may need to adjust based on your actual role system
    if (user.occupation === 'Platform Admin' || user.occupation === 'Super Admin') return 'platform-admin';
    if (user.occupation === 'Admin' || user.occupation === 'Society Admin') return 'admin';
    return 'user';
  };

  const userRole = getUserRole();

  const renderNavItems = (items: NavItemType[]) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.includes(item.name);
      const hasActiveChild = hasChildren && isChildActive(item.children!);

      if (hasChildren) {
        return (
          <NavItem key={item.name}>
            <ParentNavItemLink 
              onClick={() => toggleExpanded(item.name)}
              hasActiveChild={hasActiveChild}
            >
              <IconWrapper>
                <item.icon />
              </IconWrapper>
              {item.name}
              <ExpandButton>
                {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </ExpandButton>
            </ParentNavItemLink>
            <SubNavList expanded={isExpanded}>
              {item.children?.map((child) => (
                <SubNavItem key={child.name}>
                  <SubNavItemLink
                    to={child.href!}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <IconWrapper>
                      <child.icon />
                    </IconWrapper>
                    {child.name}
                  </SubNavItemLink>
                </SubNavItem>
              ))}
            </SubNavList>
          </NavItem>
        );
      }

      return (
        <NavItem key={item.name}>
          <NavItemLink
            to={item.href!}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <IconWrapper>
              <item.icon />
            </IconWrapper>
            {item.name}
          </NavItemLink>
        </NavItem>
      );
    });
  };

  return (
    <SidebarContainer>
      <LogoSection>
        <LogoLink to="/dashboard">
          <LogoIcon>S</LogoIcon>
          <LogoText>Serenity</LogoText>
        </LogoLink>
      </LogoSection>

      <Navigation>
        <NavSection>
          <SectionTitle>Main</SectionTitle>
          <NavList>
            {renderNavItems(mainNavItems)}
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle>Analytics</SectionTitle>
          <NavList>
            {renderNavItems([])}
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle>Support</SectionTitle>
          <NavList>
            {renderNavItems([])}
          </NavList>
        </NavSection>
      </Navigation>

      <Footer>
        <FooterText>© 2025 Serenity</FooterText>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar;
