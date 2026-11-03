import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === '') {
      setError('Email is required');
      setMessage('');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/user/ForgetPassword', {email: email });
      setMessage(res.data.message);
      setError('');
      setEmail('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong!';
      setError(errorMsg);
      setMessage('');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="back"
        style={{ width: "8%" }}
      >
        ← Back
      </button>
    </div>
  );
};

export default ForgotPassword;
