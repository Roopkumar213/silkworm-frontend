import React, { useState, useEffect } from 'react';
import Result from  "./Components/Result"
// At the top of App.js, before your component

// ============================================
// API Configuration
// ============================================
const API_BASE_URL = 'https://silkworm-backend.onrender.com';

// ============================================
  const SignUp = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setAlert(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAlert({ type: 'success', message: 'Registration successful! Redirecting to login...' });
        setTimeout(() => onNavigate('login'), 1500);
      } else {
        setAlert({ type: 'error', message: data.message || 'Registration failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(-45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .signup-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.6s ease;
        }

        .signup-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .signup-subtitle {
          font-size: 16px;
          color: #718096;
          margin: 0 0 32px 0;
          text-align: center;
        }

        .alert {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          animation: fadeInUp 0.4s ease;
        }

        .alert-success {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .alert-error {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          animation: shake 0.4s ease;
        }

        .form-group {
          position: relative;
          margin-bottom: 28px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 16px 16px 16px 16px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-input.has-error {
          border-color: #f5576c;
          animation: shake 0.4s ease;
        }

        .form-input.has-error:focus {
          box-shadow: 0 0 0 4px rgba(245, 87, 108, 0.1);
        }

        .floating-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #a0aec0;
          pointer-events: none;
          transition: all 0.3s ease;
          background: white;
          padding: 0 4px;
        }

        .form-input:focus ~ .floating-label,
        .form-input:not(:placeholder-shown) ~ .floating-label {
          top: 0;
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
        }

        .form-input.has-error:focus ~ .floating-label,
        .form-input.has-error:not(:placeholder-shown) ~ .floating-label {
          color: #f5576c;
        }

        .error-message {
          color: #f5576c;
          font-size: 13px;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .error-message::before {
          content: '⚠';
          font-size: 14px;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .auth-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #718096;
        }

        .link-button {
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .link-button::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .link-button:hover::after {
          width: 100%;
        }

        .link-button:hover {
          color: #764ba2;
        }

        @media (max-width: 640px) {
          .signup-card {
            padding: 32px 24px;
          }

          .signup-title {
            font-size: 28px;
          }

          .signup-subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join our silkworm farming community</p>
          
          {alert && (
            <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {alert.message}
            </div>
          )}
          
          <div>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">Full Name</label>
              </div>
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">Email</label>
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`form-input ${errors.mobile ? 'has-error' : ''}`}
                  placeholder=" "
                  maxLength="10"
                />
                <label className="floating-label">Mobile Number</label>
              </div>
              {errors.mobile && <div className="error-message">{errors.mobile}</div>}
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'has-error' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">Password</label>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">Confirm Password</label>
              </div>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
          
          <div className="auth-link">
            Already have an account?{' '}
            <span className="link-button" onClick={() => onNavigate('login')}>
              Login here
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// Login Component
// ============================================
const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setAlert(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
  onLogin(data.data.token, data.data.user);
      } else {
        setAlert({ type: 'error', message: data.message || 'Login failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes rotateLoader {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6);
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: fadeIn 2s ease;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 50px 45px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35), 0 10px 25px rgba(0, 0, 0, 0.2);
          animation: slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 28px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .login-card:hover::before {
          opacity: 0.3;
        }

        .login-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px 0;
          text-align: center;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0 0 36px 0;
          text-align: center;
          font-weight: 500;
        }

        .alert-banner {
          padding: 18px 22px;
          border-radius: 14px;
          margin-bottom: 26px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: shakeError 0.5s ease, fadeIn 0.3s ease;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .alert-banner::before {
          content: '⚠';
          font-size: 20px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .form-group {
          position: relative;
          margin-bottom: 30px;
        }

        .input-container {
          position: relative;
        }

        .login-input {
          width: 100%;
          padding: 18px 18px;
          font-size: 16px;
          border: 2.5px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          font-family: inherit;
        }

        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.12);
          transform: translateY(-1px);
        }

        .login-input.input-error {
          border-color: #ef4444;
          animation: shakeError 0.5s ease;
        }

        .login-input.input-error:focus {
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.12);
        }

        .floating-label {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #94a3b8;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          padding: 0 6px;
          font-weight: 500;
        }

        .login-input:focus ~ .floating-label,
        .login-input:not(:placeholder-shown) ~ .floating-label {
          top: 0;
          font-size: 13px;
          color: #3b82f6;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .login-input.input-error:focus ~ .floating-label,
        .login-input.input-error:not(:placeholder-shown) ~ .floating-label {
          color: #ef4444;
        }

        .error-text {
          color: #ef4444;
          font-size: 13px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          animation: fadeIn 0.3s ease;
        }

        .error-text::before {
          content: '✕';
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
        }

        .login-button {
          width: 100%;
          padding: 18px;
          font-size: 17px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
          letter-spacing: 0.3px;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .login-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:active {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
        }

        .login-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
        }

        .login-button:disabled:hover {
          transform: none;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: rotateLoader 0.7s linear infinite;
          margin-right: 10px;
          vertical-align: middle;
        }

        .auth-link-container {
          text-align: center;
          margin-top: 28px;
          font-size: 15px;
          color: #64748b;
          font-weight: 500;
        }

        .signup-link {
          color: #3b82f6;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
        }

        .signup-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2.5px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .signup-link:hover {
          color: #8b5cf6;
          transform: translateX(2px);
        }

        .signup-link:hover::after {
          width: 100%;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 38px 28px;
            border-radius: 24px;
          }

          .login-title {
            font-size: 30px;
          }

          .login-subtitle {
            font-size: 14px;
            margin-bottom: 30px;
          }

          .login-input {
            padding: 16px;
            font-size: 15px;
          }

          .login-button {
            padding: 16px;
            font-size: 16px;
          }

          .form-group {
            margin-bottom: 26px;
          }
        }

        @media (max-width: 400px) {
          .login-card {
            padding: 32px 22px;
          }

          .login-title {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Login to monitor your silkworm health</p>
          
          {alert && (
            <div className="alert-banner">
              {alert.message}
            </div>
          )}
          
          <div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`login-input ${errors.mobile ? 'input-error' : ''}`}
                  placeholder=" "
                  maxLength="10"
                />
                <label className="floating-label">Mobile Number</label>
              </div>
              {errors.mobile && <div className="error-text">{errors.mobile}</div>}
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`login-input ${errors.password ? 'input-error' : ''}`}
                  placeholder=" "
                />
                <label className="floating-label">Password</label>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>
            
            <button
              onClick={handleSubmit}
              className="login-button"
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <div className="auth-link-container">
            Don't have an account?{' '}
            <span className="signup-link" onClick={() => onNavigate('signup')}>
              Sign up here
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// Farmer Dashboard Component
// ============================================

const FarmerDashboard = ({ user, onLogout }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [history, setHistory] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) addImages(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) addImages(files);
  };

  const addImages = (files) => {
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setImages(prev => [...prev, ...newImages]);
    setAlert(null);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const analyzeImages = async () => {
    if (images.length === 0) {
      setAlert({ type: 'error', message: 'Please upload at least one image' });
      return;
    }

    setLoading(true);
    setAlert(null);
    setResults([]);

    try {
      const formData = new FormData();
      images.forEach((img) => {
        formData.append('files', img.file);
      });

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/upload/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const predictions = data.predictions || [];
        setResults(predictions);
        setAlert({ type: 'success', message: 'Analysis completed successfully!' });
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          imageCount: images.length,
          results: predictions,
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 10));
      } else {
        setAlert({ type: 'error', message: data.message || 'Analysis failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const renderAnalyzeTab = () => (
    <>
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <div>
          <h2 className="welcome-title">Welcome back, {user?.name || 'Farmer'}!</h2>
          <p className="welcome-text">
            Upload images of your silkworms to get instant AI-powered health analysis
          </p>
        </div>
      </div>

      <div className="analysis-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Real-Time Health Analysis</h2>
            <p className="card-subtitle">
              Upload one or more images for immediate disease detection
            </p>
          </div>
        </div>

        {alert && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span className="alert-icon">{alert.type === 'success' ? '✓' : '⚠'}</span>
            {alert.message}
          </div>
        )}

        <div
          className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <div className="dropzone-content">
            <div className="dropzone-icon">📤</div>
            <div className="dropzone-text">Drag & Drop Images Here</div>
            <div className="dropzone-subtext">or click to browse (PNG, JPG, JPEG)</div>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {images.length > 0 && (
          <div className="uploaded-grid">
            {images.map(img => (
              <div key={img.id} className="image-card">
                <img src={img.preview} alt="Upload" className="image-preview" />
                <button className="remove-btn" onClick={() => removeImage(img.id)}>
                  <span>×</span>
                </button>
                <div className="image-overlay">
                  <span className="image-status">Ready</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <button
            className={`analyze-btn ${loading ? 'btn-loading' : ''}`}
            onClick={analyzeImages}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Images...
              </>
            ) : (
              <>
                <span className="btn-icon">🔬</span>
                Analyze {images.length} Image{images.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h3 className="results-title">
              <span className="results-icon">📊</span>
              Analysis Results
            </h3>
            <div className="results-grid">
              {results.map((result, index) => (
                <div key={index} className="result-card">
                  <div className="result-image-container">
                    {images[index] && (
                      <img
                        src={images[index].preview}
                        alt={`Result ${index + 1}`}
                        className="result-image"
                      />
                    )}
                  </div>
                  <div className="result-content">
                    <div className="result-header">
                      <span className={`result-label ${result.label === 'Healthy' ? 'label-healthy' : 'label-disease'}`}>
                        {result.label || 'Unknown'}
                      </span>
                      <span className="result-badge">#{index + 1}</span>
                    </div>
                    <div className="confidence-section">
                      <div className="confidence-label">
                        <span>Confidence</span>
                        <span className="confidence-value">
                          {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${result.confidence ? result.confidence * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                     <Result results={results} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );


  const renderHistoryTab = () => (
    <div className="history-section">
      <div className="section-header">
        <h2 className="section-title">Analysis History</h2>
        <p className="section-subtitle">View your recent silkworm health assessments</p>
      </div>
      
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 className="empty-title">No History Yet</h3>
          <p className="empty-text">Your analysis history will appear here once you start analyzing images</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-header">
                <span className="history-date">📅 {item.date}</span>
                <span className="history-count">{item.imageCount} images</span>
              </div>
              <div className="history-results">
                {item.results.map((result, idx) => (
                  <div key={idx} className="history-result-item">
                    <span className={`history-label ${result.label === 'Healthy' ? 'label-healthy' : 'label-disease'}`}>
                      {result.label}
                    </span>
                    <span className="history-confidence">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGuidelinesTab = () => (
    <div className="guidelines-section">
      <div className="section-header">
        <h2 className="section-title">Health Guidelines</h2>
        <p className="section-subtitle">Best practices for silkworm care and disease prevention</p>
      </div>
      
      <div className="guidelines-grid">
        <div className="guideline-card">
          <div className="guideline-icon">🌡️</div>
          <h3 className="guideline-title">Temperature Control</h3>
          <p className="guideline-text">Maintain temperature between 23-28°C for optimal silkworm health and growth</p>
        </div>
        
        <div className="guideline-card">
          <div className="guideline-icon">💧</div>
          <h3 className="guideline-title">Humidity Management</h3>
          <p className="guideline-text">Keep humidity levels at 70-85% to prevent dehydration and disease</p>
        </div>
        
        <div className="guideline-card">
          <div className="guideline-icon">🍃</div>
          <h3 className="guideline-title">Fresh Mulberry Leaves</h3>
          <p className="guideline-text">Feed only fresh, clean mulberry leaves. Remove old leaves regularly</p>
        </div>
        
        <div className="guideline-card">
          <div className="guideline-icon">🧹</div>
          <h3 className="guideline-title">Hygiene & Cleanliness</h3>
          <p className="guideline-text">Clean rearing trays daily and disinfect equipment to prevent infections</p>
        </div>
        
        <div className="guideline-card">
          <div className="guideline-icon">👁️</div>
          <h3 className="guideline-title">Regular Monitoring</h3>
          <p className="guideline-text">Check silkworms daily for signs of disease or abnormal behavior</p>
        </div>
        
        <div className="guideline-card">
          <div className="guideline-icon">🚫</div>
          <h3 className="guideline-title">Isolation Protocol</h3>
          <p className="guideline-text">Immediately isolate sick silkworms to prevent disease spread</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          background: ${darkMode ? '#0f172a' : '#f8fafc'};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: background 0.3s ease;
        }

        .navbar {
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background 0.3s ease;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 800;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-tab {
          padding: 10px 20px;
          border: none;
          background: ${darkMode ? 'transparent' : 'transparent'};
          color: ${darkMode ? '#94a3b8' : '#64748b'};
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-tab:hover {
          background: ${darkMode ? '#334155' : '#f1f5f9'};
          color: ${darkMode ? '#ffffff' : '#1e293b'};
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle {
          width: 44px;
          height: 44px;
          border: none;
          background: ${darkMode ? '#334155' : '#f1f5f9'};
          color: ${darkMode ? '#fbbf24' : '#64748b'};
          border-radius: 10px;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          transform: scale(1.05);
          background: ${darkMode ? '#475569' : '#e2e8f0'};
        }

        .logout-btn {
          padding: 10px 20px;
          border: none;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .mobile-menu-btn {
          display: none;
          width: 44px;
          height: 44px;
          border: none;
          background: ${darkMode ? '#334155' : '#f1f5f9'};
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          border-radius: 10px;
          cursor: pointer;
          font-size: 20px;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 16px;
          flex-direction: column;
          gap: 8px;
          z-index: 99;
        }

        .mobile-menu.show {
          display: flex;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .welcome-card {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          padding: 32px;
          border-radius: 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
          animation: slideIn 0.5s ease;
        }

        .welcome-icon {
          font-size: 56px;
          animation: wave 2s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .welcome-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .analysis-card {
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          padding: 32px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: slideIn 0.6s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 800;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 15px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .alert {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideIn 0.4s ease;
        }

        .alert-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .alert-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .alert-icon {
          font-size: 18px;
          font-weight: bold;
        }

        .dropzone {
          border: 3px dashed ${darkMode ? '#475569' : '#cbd5e1'};
          border-radius: 16px;
          padding: 60px 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${darkMode ? '#0f172a' : '#f8fafc'};
        }

        .dropzone:hover {
          border-color: #3b82f6;
          background: ${darkMode ? '#1e293b' : '#eff6ff'};
          transform: translateY(-2px);
        }

        .dropzone-active {
          border-color: #3b82f6;
          background: ${darkMode ? '#1e293b' : '#eff6ff'};
          transform: scale(1.02);
        }

        .dropzone-content {
          pointer-events: none;
        }

        .dropzone-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .dropzone-text {
          font-size: 20px;
          font-weight: 700;
          color: ${darkMode ? '#e2e8f0' : '#1e293b'};
          margin-bottom: 8px;
        }

        .dropzone-subtext {
          font-size: 14px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .uploaded-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .image-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 1;
          background: ${darkMode ? '#334155' : '#f1f5f9'};
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border-radius: 8px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s ease;
        }

        .image-card:hover .remove-btn {
          opacity: 1;
        }

        .remove-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .image-card:hover .image-overlay {
          opacity: 1;
        }

        .image-status {
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .analyze-btn {
          width: 100%;
          padding: 18px;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-size: 17px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }

        .analyze-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
        }

        .analyze-btn:active {
          transform: translateY(-1px);
        }

        .btn-loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .btn-loading:hover {
          transform: none;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }

        .btn-icon {
          font-size: 20px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .results-section {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 2px solid ${darkMode ? '#334155' : '#e2e8f0'};
        }

        .results-title {
          font-size: 22px;
          font-weight: 800;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .results-icon {
          font-size: 28px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .result-card {
          background: ${darkMode ? '#0f172a' : '#f8fafc'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease;
        }

        .result-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .result-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: ${darkMode ? '#1e293b' : '#e2e8f0'};
        }

        .result-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .result-content {
          padding: 20px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .result-label {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .label-healthy {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .label-disease {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .result-badge {
          background: ${darkMode ? '#334155' : '#e2e8f0'};
          color: ${darkMode ? '#e2e8f0' : '#64748b'};
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .confidence-section {
          margin-top: 16px;
        }

        .confidence-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .confidence-value {
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          font-size: 14px;
          font-weight: 800;
        }

        .confidence-bar {
          height: 8px;
          background: ${darkMode ? '#334155' : '#e2e8f0'};
          border-radius: 4px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .history-section, .guidelines-section {
          animation: slideIn 0.5s ease;
        }

        .section-header {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 800;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 16px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: ${darkMode ? '#e2e8f0' : '#1e293b'};
          margin-bottom: 12px;
        }

        .empty-text {
          font-size: 16px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .history-card {
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease;
        }

        .history-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 2px solid ${darkMode ? '#334155' : '#e2e8f0'};
        }

        .history-date {
          font-size: 14px;
          font-weight: 600;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }

        .history-count {
          background: ${darkMode ? '#334155' : '#f1f5f9'};
          color: ${darkMode ? '#e2e8f0' : '#475569'};
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .history-results {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: ${darkMode ? '#0f172a' : '#f8fafc'};
          border-radius: 8px;
        }

        .history-label {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
        }

        .history-confidence {
          font-size: 14px;
          font-weight: 800;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
        }

        .guidelines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .guideline-card {
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease;
          text-align: center;
        }

        .guideline-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .guideline-icon {
          font-size: 56px;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }

        .guideline-card:nth-child(2) .guideline-icon {
          animation-delay: 0.5s;
        }

        .guideline-card:nth-child(3) .guideline-icon {
          animation-delay: 1s;
        }

        .guideline-card:nth-child(4) .guideline-icon {
          animation-delay: 1.5s;
        }

        .guideline-card:nth-child(5) .guideline-icon {
          animation-delay: 2s;
        }

        .guideline-card:nth-child(6) .guideline-icon {
          animation-delay: 2.5s;
        }

        .guideline-title {
          font-size: 18px;
          font-weight: 700;
          color: ${darkMode ? '#ffffff' : '#1e293b'};
          margin-bottom: 12px;
        }

        .guideline-text {
          font-size: 14px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .nav-actions {
            gap: 8px;
          }

          .results-grid, .history-grid, .guidelines-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .nav-container {
            padding: 0 16px;
            height: 64px;
          }

          .nav-brand {
            font-size: 20px;
          }

          .main-content {
            padding: 20px 16px;
          }

          .welcome-card {
            padding: 24px;
            flex-direction: column;
            text-align: center;
          }

          .welcome-icon {
            font-size: 48px;
          }

          .welcome-title {
            font-size: 24px;
          }

          .welcome-text {
            font-size: 14px;
          }

          .analysis-card {
            padding: 24px 20px;
          }

          .card-title {
            font-size: 20px;
          }

          .dropzone {
            padding: 40px 20px;
          }

          .dropzone-icon {
            font-size: 48px;
          }

          .dropzone-text {
            font-size: 18px;
          }

          .uploaded-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
          }

          .logout-btn {
            padding: 8px 16px;
            font-size: 14px;
          }

          .theme-toggle {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
        }
          .empty-state {
          text-align: center;
          padding: 80px 32px;
          background: ${darkMode ? '#1e293b' : '#ffffff'};
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          animation: slideIn 0.5s ease;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: ${darkMode ? '#e2e8f0' : '#1e293b'};
          margin-bottom: 12px;
        }

        .empty-text {
          font-size: 16px;
          color: ${darkMode ? '#94a3b8' : '#64748b'};
        }
      `}</style>

      <div className="dashboard">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              🐛 SERI CARE
            </div>
            
            <div className="nav-links">
              <button 
                className={`nav-tab ${activeTab === 'analyze' ? 'active' : ''}`}
                onClick={() => setActiveTab('analyze')}
              >
                🔬 Analyze
              </button>
              <button 
                className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📊 History
              </button>
              <button 
                className={`nav-tab ${activeTab === 'guidelines' ? 'active' : ''}`}
                onClick={() => setActiveTab('guidelines')}
              >
                📚 Guidelines
              </button>
            </div>

            <div className="nav-actions">
              <button 
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
              <button 
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                ☰
              </button>
            </div>
          </div>

          <div className={`mobile-menu ${showMobileMenu ? 'show' : ''}`}>
            <button 
              className={`nav-tab ${activeTab === 'analyze' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analyze');
                setShowMobileMenu(false);
              }}
            >
              🔬 Analyze
            </button>
            <button 
              className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('history');
                setShowMobileMenu(false);
              }}
            >
              📊 History
            </button>
            <button 
              className={`nav-tab ${activeTab === 'guidelines' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('guidelines');
                setShowMobileMenu(false);
              }}
            >
              📚 Guidelines
            </button>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'analyze' && renderAnalyzeTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'guidelines' && renderGuidelinesTab()}
        </main>
      </div>
    </>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('userData');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setCurrentView('login');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <>
      {currentView === 'signup' && <SignUp onNavigate={handleNavigate} />}
      {currentView === 'login' && <Login onNavigate={handleNavigate} onLogin={handleLogin} />}
      {currentView === 'dashboard' && <FarmerDashboard user={user} onLogout={handleLogout} />}
    </>
  );
}



export default App;
