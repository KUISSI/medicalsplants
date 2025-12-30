export interface User {
  id: string;
  email: string;
  pseudo: string;
  firstname?:  string;
  lastname?: string;
  avatar?: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  pseudo: string;
  firstname?: string;
  lastname?: string;
}

export interface AuthResponse {
  success: boolean;
  data:  {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
  message?: string;
  timestamp:  string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
