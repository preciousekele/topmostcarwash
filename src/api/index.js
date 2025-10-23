// src/api/index.js - Mock API setup
// Since we're using mock data, we don't need axios for now
// This is a placeholder for when you integrate with real API

export const api = {
  post: async (url, data) => {
    // This is just a placeholder since we're handling everything in auth.js
    // When you integrate with real API, replace this with actual axios instance
    console.log(`Mock API call to ${url} with data:`, data);
    return { data };
  }
};

// For future real API integration, uncomment and modify:
/*
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      const parsedStorage = JSON.parse(token);
      if (parsedStorage?.state?.token) {
        config.headers.Authorization = `Bearer ${parsedStorage.state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/