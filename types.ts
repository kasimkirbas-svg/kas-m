export enum UserRole {
  GUEST = 'GUEST',
  SUBSCRIBER = 'SUBSCRIBER',
  SUPPORT_ADMIN = 'SUPPORT_ADMIN',
  CONTENT_ADMIN = 'CONTENT_ADMIN',
  OWNER = 'OWNER'
}

export const ADMIN_ROLES = [UserRole.SUPPORT_ADMIN, UserRole.CONTENT_ADMIN, UserRole.OWNER] as const;
export const isAdminRole = (role: UserRole) => ADMIN_ROLES.includes(role as typeof ADMIN_ROLES[number]);

export enum SubscriptionPlan {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  remainingDownloads: number | 'UNLIMITED';
  accountType?: 'individual' | 'osgb';
  phone?: string;
  profession?: 'İSG Uzmanı' | 'İSG Teknikeri' | 'İşveren';
  companyName?: string;
  taxNumber?: string;
  taxOffice?: string;
  address?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  isPremium: boolean;
  fileUrl?: string;
  fields: DocumentField[];
}

export interface DocumentField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'list' | 'select';
  placeholder?: string;
  options?: string[];
  dependsOn?: { field: string; value: string };
  required?: boolean;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  data: Record<string, any>;
  photos: string[]; // Base64 strings
  createdAt: string;
  status: 'DRAFT' | 'COMPLETED';
}

export interface NavItem {
  label: string;
  view: string;
  icon: any;
}