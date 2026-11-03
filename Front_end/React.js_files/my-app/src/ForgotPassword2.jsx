import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword2';
const ForgotPassword2 = () => {
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
      const response = await axios.post("http://localhost:5000/api/auth/forget-password2", {
        email,
      });

      setMessage(response.data.message);  // "Password reset link has been sent to your email."
      setError('');
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.error || "Something went wrong. Try again.");
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

          <button type="submit" className="submit-button" style={{backgroundColor:"red"}}>
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

export default ForgotPassword2;
