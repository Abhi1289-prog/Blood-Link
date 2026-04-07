import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';

// Define the API URL - adjust this to match your backend URL
const API_URL = 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isResetPage, setIsResetPage] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for token and userId in URL when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const id = queryParams.get('id');
    
    if (token && id) {
      setResetToken(token);
      setUserId(id);
      setIsResetPage(true);
      // Verify token validity
      verifyResetToken(token, id);
    }
  }, [location]);
  
  // Verify reset token validity
  const verifyResetToken = async (token, userId) => {
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_URL}/user/verify-pass-reset-token`, { 
        token, 
        userId 
      });
      setIsLoading(false);
    } catch (err) {
      setError("Invalid or expired password reset link");
      setIsLoading(false);
    }
  };
  
  // Handle password changes
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordsMatch(value === confirmPassword);
  };
  
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === newPassword);
  };
  
  // Submit forgot password request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/user/forget-password`, { email });
      setSuccess(response.data.message || "Password reset link has been sent to your email.");
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link. Please try again.");
      setIsLoading(false);
    }
  };
  
  // Submit password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        password: newPassword,
        token: resetToken,
        userId: userId
      });
      
      setSuccess("Password has been reset successfully!");
      setIsLoading(false);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. Please try again.");
      setIsLoading(false);
    }
  };
  
  // Go back to login page
  const goBack = () => {
    navigate('/login');
  };
  
  return (
    <div className="password-reset-container" style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff'
    }}>
      {/* Back Button */}
      <button 
        className='back-button' 
        onClick={goBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: 'auto',
          padding: '10px 15px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#e74c3c',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontSize: '16px',
          border: 'none'
        }}
      >
        <IoMdArrowRoundBack style={{ marginRight: '5px' }} />Back
      </button>
      
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '24px'
      }}>
        {isResetPage ? 'Reset Your Password' : 'Forgot Password'}
      </h1>
      
      {/* Error Message */}
      {error && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}
      
      {/* Forgot Password Form */}
      {!isResetPage && (
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
      
      {/* Reset Password Form */}
      {isResetPage && (
        <form onSubmit={handleResetPassword}>
          {/* New Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="new-password" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              New Password:
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              disabled={isLoading}
              required
            />
            <p style={{
              marginTop: '5px',
              fontSize: '12px',
              color: '#666'
            }}>
              Password must be at least 6 characters long
            </p>
          </div>
          
          {/* Confirm Password Input */}
          <div style={{ marginBottom: '30px', position: 'relative' }}>
            <label htmlFor="confirm-password" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your new password"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '4px',
                border: `1px solid ${confirmPassword && !passwordsMatch ? '#e74c3c' : '#ddd'}`,
                fontSize: '16px'
              }}
              disabled={isLoading}
              required
            />
            
            {/* Password Match Indicator */}
            {confirmPassword && (
              <span style={{
                position: 'absolute',
                right: '10px',
                top: '43px',
                color: passwordsMatch ? 'green' : 'red',
                fontSize: '14px'
              }}>
                {passwordsMatch ? '✓' : '✗'}
              </span>
            )}
            
            {/* Password Match Message */}
            {confirmPassword && !passwordsMatch && (
              <p style={{
                marginTop: '5px',
                fontSize: '12px',
                color: '#e74c3c'
              }}>
                Passwords don't match
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !passwordsMatch || newPassword.length < 6}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: isLoading || !passwordsMatch || newPassword.length < 6 ? '#ccc' : '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading || !passwordsMatch || newPassword.length < 6 ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;