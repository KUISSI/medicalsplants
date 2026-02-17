export interface User {
  id: string;
  email: string;
  pseudo: string;
  firstname?:  string;
  lastname?: string;
  avatar?: string;
  phone?: string;
  role:  'USER' | 'PREMIUM' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?:  string;
}

export interface UserPage {
  content: User[];
  totalElements: number;
  totalPages:  number;
  size: number;
  number: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data:  {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
  timestamp: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface UpdateUserRequest {
  pseudo?:  string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  role?: 'USER' | 'PREMIUM' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}