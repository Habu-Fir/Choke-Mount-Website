// src/types/index.ts

// ============================================================
// 🎭 USER ROLES - Complete System
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'gallery_admin'
  | 'news_admin'
  | 'history_admin'
  | 'entertainment_admin'
  | 'health_admin'
  | 'technology_admin'
  | 'vacancy_admin'
  | 'viewer';

// ============================================================
// 📂 POST CATEGORIES
// ============================================================

export type PostCategory =
  | 'news'
  | 'history'
  | 'entertainment'
  | 'health'
  | 'technology'
  | 'vacancy'
  | 'gallery';

// ============================================================
// 🖼️ GALLERY CATEGORIES
// ============================================================

export type GalleryCategory =
  | 'nature'
  | 'culture'
  | 'cuisine'
  | 'investment'
  | 'event'
  | 'general'
  | 'news'
  | 'history'
  | 'entertainment'
  | 'health'
  | 'technology'
  | 'vacancy';

// ============================================================
// 🔐 USER PERMISSIONS
// ============================================================

export interface UserPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
  mustChangePassword?: boolean;  // ← Add this
  isTemporaryPassword?: boolean; // ← Add this
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

// ============================================================
// 👤 USER INTERFACE (Frontend)
// ============================================================

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  permissions: UserPermissions;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 📝 POST INTERFACE (Frontend)
// ============================================================

export interface Post {
  _id: string;
  id?: string;
  title: string;
  localTitle?: string;
  category: PostCategory;
  content: string;
  localContent?: string;
  author: string;
  localAuthor?: string;
  authorPhoto?: string;
  imageUrl?: string;
  imagePath?: string;
  videoUrl?: string;
  duration?: string;
  tags?: string[];
  isPublished: boolean;
  publishedBy: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  views: number;
  likes: number;
  shareCount: number;
  scheduledPublish?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 📰 ARTICLE INTERFACE (Legacy compatibility)
// ============================================================

export interface Article {
  _id: string;
  id?: string;
  title: string;
  localTitle?: string;
  category: 'news' | 'history' | 'interview' | 'video';
  content: string;
  localContent?: string;
  author: string;
  localAuthor?: string;
  authorPhoto?: string;
  date?: string;
  imageUrl?: string;
  imagePath?: string;
  videoUrl?: string;
  duration?: string;
  publishedBy: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 🖼️ GALLERY INTERFACE (Frontend)
// ============================================================

export interface GalleryItem {
  _id: string;
  id?: string;
  title: string;
  category: GalleryCategory;
  url: string;
  imagePath?: string;
  description?: string;
  uploadedBy?: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  tags?: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 📅 EVENT INTERFACE (Frontend)
// ============================================================

export interface EventItem {
  _id: string;
  id?: string;
  title: string;
  localTitle?: string;
  date: number;
  month: string;
  ethiopianDateStr?: string;
  category: 'cultural' | 'market' | 'holiday' | 'investment';
  description: string;
  location: string;
  time: string;
  organizer: string;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 💼 INVESTMENT INTERFACE (Frontend)
// ============================================================

export interface Investment {
  _id: string;
  id?: string;
  companyName: string;
  investorName: string;
  sector: string;
  email: string;
  phone: string;
  proposedBudget: string;
  proposalBrief: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedBy?: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 🏔️ LANDMARK INTERFACE (Frontend)
// ============================================================

export interface Landmark {
  _id: string;
  id?: string;
  name: string;
  localName: string;
  description: string;
  history: string;
  category: 'nature' | 'culture' | 'sacred' | 'admin';
  coordinates: {
    x: number;
    y: number;
  };
  image: string;
  elevation?: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 💼 VACANCY INTERFACE (Frontend)
// ============================================================

export interface Vacancy {
  _id: string;
  id?: string;
  title: string;
  localTitle?: string;
  type: 'job' | 'product' | 'house' | 'phone' | 'vehicle' | 'other';
  category: 'vacancy';
  companyName?: string;
  location?: string;
  price?: string;
  contactInfo?: string;
  description: string;
  localDescription?: string;
  imageUrl?: string;
  imagePath?: string;
  isPublished: boolean;
  publishedBy: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
  views: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 💬 CHAT MESSAGE INTERFACE
// ============================================================

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ============================================================
// 📋 REQUEST TYPES
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
}

export interface CreatePostRequest {
  title: string;
  localTitle?: string;
  category: PostCategory;
  content: string;
  localContent?: string;
  author: string;
  localAuthor?: string;
  authorPhoto?: string;
  imageUrl?: string;
  videoUrl?: string;
  duration?: string;
  tags?: string[];
  isPublished?: boolean;
  scheduledPublish?: string;
}

export interface CreateGalleryRequest {
  title: string;
  category: GalleryCategory;
  url?: string;
  imagePath?: string;
  description?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface CreateEventRequest {
  title: string;
  localTitle?: string;
  date: number;
  month: string;
  ethiopianDateStr?: string;
  category: 'cultural' | 'market' | 'holiday' | 'investment';
  description: string;
  location: string;
  time: string;
  organizer: string;
  isPopular?: boolean;
}

export interface CreateInvestmentRequest {
  companyName: string;
  investorName: string;
  sector: string;
  email: string;
  phone: string;
  proposedBudget: string;
  proposalBrief: string;
}

// ============================================================
// 📤 RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  pages?: number;
  currentPage?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    permissions: UserPermissions;
    createdAt: string;
  };
}

// ============================================================
// 📊 DASHBOARD STATS
// ============================================================

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalGallery: number;
  postsByCategory: {
    news: number;
    history: number;
    entertainment: number;
    health: number;
    technology: number;
    vacancy: number;
    gallery: number;
  };
  recentActivity: {
    user: string;
    action: string;
    timestamp: string;
  }[];
  pendingPosts: number;
  scheduledPosts: number;
}

export interface InvestmentStats {
  total: number;
  pending: number;
  reviewing: number;
  approved: number;
  rejected: number;
  sectorStats: {
    sector: string;
    count: number;
    totalBudget: number;
  }[];
  recent: Investment[];
}

// ============================================================
// 🔗 ROLE TO CATEGORY MAPPING
// ============================================================

export const ROLE_TO_CATEGORY: Record<UserRole, PostCategory[]> = {
  super_admin: ['news', 'history', 'entertainment', 'health', 'technology', 'vacancy', 'gallery'],
  gallery_admin: ['gallery'],
  news_admin: ['news'],
  history_admin: ['history'],
  entertainment_admin: ['entertainment'],
  health_admin: ['health'],
  technology_admin: ['technology'],
  vacancy_admin: ['vacancy'],
  viewer: [],
};

// ============================================================
// 🏷️ ROLE LABELS
// ============================================================

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  gallery_admin: 'Gallery Admin',
  news_admin: 'News Admin',
  history_admin: 'History Admin',
  entertainment_admin: 'Entertainment Admin',
  health_admin: 'Health Admin',
  technology_admin: 'Technology Admin',
  vacancy_admin: 'Vacancy Admin',
  viewer: 'Viewer',
};

// ============================================================
// 🏷️ CATEGORY LABELS
// ============================================================

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  news: 'News',
  history: 'History',
  entertainment: 'Entertainment',
  health: 'Health',
  technology: 'Technology',
  vacancy: 'Vacancy',
  gallery: 'Gallery',
};

// ============================================================
// 📝 ROLE DESCRIPTIONS
// ============================================================

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: '👑 Full access to all features, content categories, and user management.',
  gallery_admin: '📸 Can upload, edit, and manage photos in the gallery.',
  news_admin: '📰 Can create, edit, publish, and manage news articles.',
  history_admin: '📜 Can create, edit, publish, and manage historical content.',
  entertainment_admin: '🎭 Can create, edit, publish, and manage entertainment content.',
  health_admin: '🏥 Can create, edit, publish, and manage health-related content.',
  technology_admin: '💻 Can create, edit, publish, and manage technology content.',
  vacancy_admin: '💼 Can post, edit, and manage jobs, products, houses, and other listings.',
  viewer: '👀 Read-only access to all public content.',
};

// ============================================================
// 🔧 PERMISSION HELPERS
// ============================================================

export const getDefaultPermissions = (role: UserRole): UserPermissions => {
  const roleString = role as string;
  const isAdmin = roleString !== 'viewer';
  const isSuperAdmin = roleString === 'super_admin';

  return {
    canCreate: isAdmin || isSuperAdmin,
    canEdit: isAdmin || isSuperAdmin,
    canDelete: isAdmin || isSuperAdmin,
    canPublish: isAdmin || isSuperAdmin,
    canManageUsers: isSuperAdmin,
    canViewAnalytics: isSuperAdmin,
  };
};

export const canUserManageCategory = (userRole: UserRole, category: PostCategory): boolean => {
  if (userRole === 'super_admin') return true;
  const allowedCategories = ROLE_TO_CATEGORY[userRole] || [];
  return allowedCategories.includes(category);
};

export const isAdminRole = (role: UserRole): boolean => {
  const adminRoles: UserRole[] = [
    'super_admin',
    'gallery_admin',
    'news_admin',
    'history_admin',
    'entertainment_admin',
    'health_admin',
    'technology_admin',
    'vacancy_admin'
  ];
  return adminRoles.includes(role);
};

export const isSuperAdminRole = (role: UserRole): boolean => {
  return role === 'super_admin';
};

export const getCategoryLabel = (category: PostCategory): string => {
  return CATEGORY_LABELS[category] || category;
};

export const getRoleLabel = (role: UserRole): string => {
  return ROLE_LABELS[role] || role;
};

// In src/types/index.ts - add these interfaces
export interface InvestorSector {
  id: string;
  name: string;
  localName?: string;
  description: string;
  localDescription?: string;
  demand: 'Critical' | 'High' | 'Moderate';
  localDemand?: string;
  minimumCapital: string;
  localMinimumCapital?: string;
  growth: string;
  localGrowth?: string;
  incentives: string[];
  localIncentives?: string[];
  contactPerson: string;
  localContactPerson?: string;
}

export interface InvestorRegistration {
  id: string;
  companyName: string;
  investorName: string;
  sectorId: string;
  email: string;
  phone: string;
  proposedBudget: string;
  proposalBrief: string;
  registeredAt: string;
  status: 'Pre-Approved' | 'Under Review' | 'Pending Verification';
}