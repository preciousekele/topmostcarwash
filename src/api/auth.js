import { api } from './index';

// Mock data for testing
const MOCK_USERS = [
  {
    id: 1,
    email: 'preshekele@gmail.com',
    password: 'Presh123!',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    role: 'user'
  }
];

// Mock API delay to simulate network request
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials) => {
    // Simulate network delay
    await mockDelay(1500);
    
    const { email, password } = credentials;
    
    // Find user in mock data
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Return mock success response
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: `mock_token_${user.id}_${Date.now()}`
      },
      message: 'Login successful'
    };
  },
  
  register: async (userData) => {
    await mockDelay(1000);
    // Mock registration - always succeeds
    return {
      success: true,
      data: {
        user: {
          id: Date.now(),
          ...userData
        }
      },
      message: 'Registration successful'
    };
  },
  
  logout: async () => {
    await mockDelay(500);
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },
  
  refreshToken: async () => {
    await mockDelay(500);
    return {
      success: true,
      data: {
        token: `refreshed_token_${Date.now()}`
      }
    };
  },
  
  forgotPassword: async (email) => {
    await mockDelay(1000);
    return {
      success: true,
      message: 'Password reset email sent'
    };
  },
  
  resetPassword: async (token, password) => {
    await mockDelay(1000);
    return {
      success: true,
      message: 'Password reset successful'
    };
  }
};