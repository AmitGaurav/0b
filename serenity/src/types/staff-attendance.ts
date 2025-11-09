// Staff Attendance Types for Serenity UI

import { StaffRole, Department, StaffStatus } from './staff';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
  HOLIDAY = 'HOLIDAY'
}

export enum AttendanceActionType {
  MARK_PRESENT = 'MARK_PRESENT',
  MARK_ABSENT = 'MARK_ABSENT',
  MARK_LATE = 'MARK_LATE',
  MARK_HALF_DAY = 'MARK_HALF_DAY',
  MARK_LEAVE = 'MARK_LEAVE',
  DELETE = 'DELETE'
}

export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum AttendanceSortField {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ROLE = 'ROLE',
  DEPARTMENT = 'DEPARTMENT',
  DATE_OF_JOINING = 'DATE_OF_JOINING',
  ATTENDANCE_STATUS = 'ATTENDANCE_STATUS',
  CHECK_IN_TIME = 'CHECK_IN_TIME',
  CHECK_OUT_TIME = 'CHECK_OUT_TIME'
}

export interface StaffAttendance {
  id: number;
  staffId: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: Department;
  dateOfJoining: Date;
  profilePicture?: string;
  status: StaffStatus;
  attendanceStatus: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours?: number;
  breakTime?: number;
  overtimeHours?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  markedBy?: string;
}

export interface AttendanceSearchFilters {
  searchTerm: string;
  role?: StaffRole;
  department?: Department;
  attendanceStatus?: AttendanceStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceSortOptions {
  field: AttendanceSortField;
  direction: SortDirection;
}

export interface BulkAttendanceAction {
  type: AttendanceActionType;
  staffIds: number[];
  notes?: string;
  time?: Date;
}

export interface AttendanceExportOptions {
  format: ExportFormat;
  fields: AttendanceExportField[];
  includeFilters: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export enum AttendanceExportField {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ROLE = 'ROLE',
  DEPARTMENT = 'DEPARTMENT',
  DATE_OF_JOINING = 'DATE_OF_JOINING',
  ATTENDANCE_STATUS = 'ATTENDANCE_STATUS',
  CHECK_IN_TIME = 'CHECK_IN_TIME',
  CHECK_OUT_TIME = 'CHECK_OUT_TIME',
  WORKING_HOURS = 'WORKING_HOURS',
  OVERTIME_HOURS = 'OVERTIME_HOURS',
  NOTES = 'NOTES',
  DATE = 'DATE'
}

export interface AttendancePaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

export interface AttendanceFormData {
  attendanceStatus: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  date: string;
}

export interface AttendanceModalMode {
  type: 'view' | 'edit' | 'add';
  data?: StaffAttendance;
}

export interface AttendanceStats {
  totalStaff: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  attendanceRate: number;
}

// Notification types
export interface AttendanceNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Permission types for attendance management
export enum AttendancePermission {
  VIEW_ATTENDANCE = 'VIEW_ATTENDANCE',
  MARK_ATTENDANCE = 'MARK_ATTENDANCE',
  EDIT_ATTENDANCE = 'EDIT_ATTENDANCE',
  DELETE_ATTENDANCE = 'DELETE_ATTENDANCE',
  BULK_ATTENDANCE_ACTION = 'BULK_ATTENDANCE_ACTION',
  EXPORT_ATTENDANCE = 'EXPORT_ATTENDANCE',
  VIEW_ATTENDANCE_REPORTS = 'VIEW_ATTENDANCE_REPORTS'
}