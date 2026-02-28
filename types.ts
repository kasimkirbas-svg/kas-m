export enum UserRole {
  GUEST = 'GUEST',
  SUBSCRIBER = 'SUBSCRIBER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  STANDART = 'STANDART',
  GOLD = 'GOLD',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  remainingDownloads: number | 'UNLIMITED';
  companyName?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isActive?: boolean;
  password?: string;
  isBanned?: boolean;
  banReason?: string;
  banExpiresAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  price: number;
  currency: string;
  downloadLimit: number | 'UNLIMITED';
  downloadsThisMonth: number;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  isPremium: boolean;
  monthlyLimit?: number; // null veya UNLIMITED ise sınırsız
  fields: DocumentField[];
  content?: string; // HTML content for rich templates
  backgroundImage?: string; // Base64 encoded background image for visual templates
  layout?: { width: number; height: number }; // Dimensions of the background image
  photoCapacity?: number; // 10-15 örneği için
}

export interface DocumentField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'list' | 'number' | 'email' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select/list types
  position?: { x: number; y: number; width: number; height: number }; // Position for visual templates
}

export interface DocumentPhoto {
  id: string;
  base64: string;
  uploadedAt: string;
}

export interface GeneratedDocument {
  id: string;
  userId: string;
  templateId: string;
  data: Record<string, any>;
  photos: DocumentPhoto[];
  createdAt: string;
  generatedAt?: string;
  status: 'DRAFT' | 'COMPLETED' | 'DOWNLOADED';
  companyName: string;
  preparedBy: string;
  additionalNotes?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  planType: SubscriptionPlan;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  period: string; // "Ocak 2026" gibi
  downloadLink?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  templateCount: number;
}

export interface NavItem {
  label: string;
  view: string;
  icon: any;
}