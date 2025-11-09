// Finance Module Types and Interfaces

export enum FinanceUserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum FinancePermission {
  VIEW = 'view',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  PROCESS = 'process',
  GENERATE = 'generate',
  APPROVE = 'approve',
  RESPOND = 'respond',
  PAY = 'pay'
}

export enum FinanceModuleType {
  EXPENSE_TRACKING = 'expense-tracking',
  BUDGET_MANAGEMENT = 'budget-management',
  PAYMENT_PROCESSING = 'payment-processing',
  FINANCIAL_REPORTING = 'financial-reporting',
  TAX_MANAGEMENT = 'tax-management',
  AUDIT_MANAGEMENT = 'audit-management',
  INVOICE_MANAGEMENT = 'invoice-management',
  VENDOR_PAYMENTS = 'vendor-payments',
  FUND_MANAGEMENT = 'fund-management',
  INVESTMENT_MANAGEMENT = 'investment-management',
  LOAN_MANAGEMENT = 'loan-management',
  MEMBERSHIP_FEES = 'membership-fees',
  FINANCIAL_CALENDAR = 'financial-calendar',
  DOCUMENT_CENTER = 'document-center',
  ANNOUNCEMENTS = 'announcements',
  FEEDBACK_SUGGESTIONS = 'feedback-suggestions',
  LEGAL_COMPLIANCE = 'legal-compliance'
}

export enum FinanceModuleCategory {
  TRACKING = 'tracking',
  MANAGEMENT = 'management',
  PROCESSING = 'processing',
  REPORTING = 'reporting',
  DOCUMENTS = 'documents',
  COMMUNICATION = 'communication'
}

export interface FinanceModule {
  id: FinanceModuleType;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: FinanceModuleCategory;
  color: string;
  isActive: boolean;
  permissions: {
    [key in FinanceUserRole]: FinancePermission[];
  };
}

// Permission check utility functions
export function canAccessFinanceModule(
  userRole: FinanceUserRole,
  module: FinanceModule
): boolean {
  const userPermissions = module.permissions[userRole];
  return userPermissions && userPermissions.length > 0;
}

export function hasFinancePermission(
  userRole: FinanceUserRole,
  module: FinanceModule,
  permission: FinancePermission
): boolean {
  const userPermissions = module.permissions[userRole];
  return userPermissions ? userPermissions.includes(permission) : false;
}

// Finance-specific interfaces
export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  attachments?: string[];
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'completed' | 'exceeded';
}

export interface PaymentItem {
  id: string;
  payerName: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'online';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  generatedDate: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  fileUrl?: string;
}

export interface TaxItem {
  id: string;
  taxType: string;
  taxYear: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  documents?: string[];
}

export interface AuditItem {
  id: string;
  auditType: string;
  auditDate: Date;
  auditorName: string;
  findings: string[];
  recommendations: string[];
  status: 'ongoing' | 'completed' | 'pending_review';
  reportUrl?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  recipientName: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface VendorPayment {
  id: string;
  vendorName: string;
  amount: number;
  paymentDate: Date;
  serviceDescription: string;
  invoiceNumber?: string;
  status: 'pending' | 'processed' | 'completed';
}

export interface FundItem {
  id: string;
  fundName: string;
  fundType: 'reserve' | 'maintenance' | 'development' | 'emergency';
  currentAmount: number;
  targetAmount: number;
  lastUpdated: Date;
  transactions: Array<{
    date: Date;
    amount: number;
    type: 'deposit' | 'withdrawal';
    description: string;
  }>;
}

export interface InvestmentItem {
  id: string;
  investmentName: string;
  investmentType: 'fixed_deposit' | 'mutual_fund' | 'bonds' | 'stocks';
  principalAmount: number;
  currentValue: number;
  maturityDate?: Date;
  interestRate?: number;
  status: 'active' | 'matured' | 'redeemed';
}

export interface LoanItem {
  id: string;
  loanType: string;
  principalAmount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  monthlyPayment: number;
  status: 'active' | 'completed' | 'defaulted';
}

export interface MembershipFee {
  id: string;
  memberName: string;
  membershipType: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  paymentHistory: Array<{
    date: Date;
    amount: number;
    paymentMethod: string;
  }>;
}

export interface FinancialEvent {
  id: string;
  title: string;
  eventType: 'payment_due' | 'budget_review' | 'audit_scheduled' | 'report_generation';
  date: Date;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  isRecurring: boolean;
  recurringPattern?: string;
}

export interface FinancialDocument {
  id: string;
  title: string;
  documentType: 'report' | 'statement' | 'receipt' | 'contract' | 'policy';
  uploadDate: Date;
  fileUrl: string;
  fileSize: number;
  category: string;
  accessLevel: 'public' | 'members' | 'admin_only';
}

export interface FinancialAnnouncement {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  isActive: boolean;
  attachments?: string[];
}

export interface FinancialFeedback {
  id: string;
  submitterName: string;
  submitterRole: FinanceUserRole;
  title: string;
  content: string;
  category: 'suggestion' | 'complaint' | 'inquiry' | 'compliment';
  submissionDate: Date;
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  adminResponse?: {
    respondedBy: string;
    responseDate: Date;
    response: string;
  };
}

export interface LegalComplianceItem {
  id: string;
  title: string;
  documentType: 'regulation' | 'policy' | 'procedure' | 'guideline';
  category: string;
  effectiveDate: Date;
  lastUpdated: Date;
  content: string;
  attachments?: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}