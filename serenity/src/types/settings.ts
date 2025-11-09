// Types for Settings page enhancements
export interface CommunicationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  smsFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  pushFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  marketingEmails: boolean;
  systemAlerts: boolean;
  societyUpdates: boolean;
}

export interface NotificationSettings {
  emailNotifications: {
    enabled: boolean;
    announcements: boolean;
    maintenanceUpdates: boolean;
    paymentReminders: boolean;
    eventInvitations: boolean;
    emergencyAlerts: boolean;
  };
  smsNotifications: {
    enabled: boolean;
    emergencyOnly: boolean;
    paymentReminders: boolean;
    maintenanceUpdates: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    announcements: boolean;
    chatMessages: boolean;
    eventReminders: boolean;
    emergencyAlerts: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: string;
  paymentGateway: 'stripe' | 'razorpay' | 'paypal' | 'bank_transfer';
  autoPayEnabled: boolean;
  paymentReminders: boolean;
  paymentSchedule: 'monthly' | 'quarterly' | 'annually';
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'upi' | 'wallet';
  name: string;
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    passwordExpiry: number; // days
  };
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'email' | 'app' | 'none';
    backupCodes: string[];
  };
  accessControl: {
    sessionTimeout: number; // minutes
    allowMultipleSessions: boolean;
    ipWhitelist: string[];
    loginAttempts: number;
    lockoutDuration: number; // minutes
  };
  auditLog: {
    enabled: boolean;
    retentionPeriod: number; // days
  };
}

export interface PrivacySettings {
  dataRetention: {
    personalDataRetention: number; // years
    activityLogRetention: number; // years
    automaticDeletion: boolean;
  };
  dataSharing: {
    shareWithSociety: boolean;
    shareWithVendors: boolean;
    shareWithThirdParties: boolean;
    marketingConsent: boolean;
    analyticsConsent: boolean;
  };
  dataProtection: {
    encryptPersonalData: boolean;
    anonymizeData: boolean;
    dataPortabilityEnabled: boolean;
    rightToErasure: boolean;
  };
  visibility: {
    profileVisibility: 'public' | 'society_only' | 'private';
    contactInfoVisibility: 'public' | 'society_only' | 'private';
    activityVisibility: 'public' | 'society_only' | 'private';
  };
}

export interface SettingsData {
  communicationPreferences: CommunicationPreferences;
  notificationSettings: NotificationSettings;
  paymentSettings: PaymentSettings;
  securitySettings: SecuritySettings;
  privacySettings: PrivacySettings;
}