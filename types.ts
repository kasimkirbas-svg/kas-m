export enum UserRole {
  GUEST = 'GUEST',
  SUBSCRIBER = 'SUBSCRIBER',
  ADMIN = 'ADMIN'
}

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
  companyName?: string;
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