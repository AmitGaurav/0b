// Staff Roles and Permissions Types for Serenity UI

export enum Permission {
  // User Management
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Staff Management
  VIEW_STAFF = 'VIEW_STAFF',
  CREATE_STAFF = 'CREATE_STAFF',
  EDIT_STAFF = 'EDIT_STAFF',
  DELETE_STAFF = 'DELETE_STAFF',
  VERIFY_STAFF = 'VERIFY_STAFF',
  
  // Society Management
  VIEW_SOCIETIES = 'VIEW_SOCIETIES',
  CREATE_SOCIETIES = 'CREATE_SOCIETIES',
  EDIT_SOCIETIES = 'EDIT_SOCIETIES',
  DELETE_SOCIETIES = 'DELETE_SOCIETIES',
  
  // Member Management
  VIEW_MEMBERS = 'VIEW_MEMBERS',
  CREATE_MEMBERS = 'CREATE_MEMBERS',
  EDIT_MEMBERS = 'EDIT_MEMBERS',
  DELETE_MEMBERS = 'DELETE_MEMBERS',
  VERIFY_MEMBERS = 'VERIFY_MEMBERS',
  
  // Financial Management
  VIEW_FINANCES = 'VIEW_FINANCES',
  MANAGE_FINANCES = 'MANAGE_FINANCES',
  APPROVE_TRANSACTIONS = 'APPROVE_TRANSACTIONS',
  
  // Settings Management
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_BACKUPS = 'MANAGE_BACKUPS'
}

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED'
}

export enum RoleType {
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM'
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  status: RoleStatus;
  type: RoleType;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  isDefault?: boolean;
  category?: string;
  color?: string;
  icon?: string;
}

export enum RoleSortField {
  NAME = 'name',
  DESCRIPTION = 'description',
  USER_COUNT = 'userCount',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum RoleBulkActionType {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  DUPLICATE = 'DUPLICATE'
}

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf'
}

export enum RoleModalMode {
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
  DUPLICATE = 'duplicate'
}

export interface RoleActivity {
  id: string;
  action: string;
  roleId: string;
  roleName: string;
  performedBy: string;
  timestamp: Date;
  details: {
    before?: Partial<StaffRole>;
    after?: Partial<StaffRole>;
    affectedUsers?: number;
    reason?: string;
  };
  ipAddress?: string;
  userAgent?: string;
}
