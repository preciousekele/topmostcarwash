import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';
import bgImg from '/bg.jpg';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { error, isLoading, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      // Navigation happens in the mutation's onSuccess
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={bgImg} alt="background" className="bg-image" />
        <div className="green-overlay"></div>
      </div>

      <div className="right-section">
        <div className="login-form-container">
          <div className="logo">
            <div className="logo-text">
              <h1 className="company-name-title">Top-Most Carwash</h1>
            </div>
          </div>

          <div className="login-content">
            <div className="login-header">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Please login to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
                {formErrors.email && (
                  <span className="field-error">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`password-form-input ${formErrors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                {formErrors.password && (
                  <span className="field-error">{formErrors.password}</span>
                )}
              </div>

              <div className="bottom-row">
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`verify-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;