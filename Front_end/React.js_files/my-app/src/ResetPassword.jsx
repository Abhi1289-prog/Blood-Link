import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMessage } from './context/MessageContext';

function ResetPassword() {
  const { showMessage } = useMessage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Extract token & userId from URL query (e.g., ?token=abc123&userId=xyz)
useEffect(() => {
  const query = new URLSearchParams(location.search);
  const tokenFromUrl = query.get('token')?.trim();
  const userIdFromUrl = query.get('userId')?.trim() || query.get('id')?.trim();

  if (!tokenFromUrl || !userIdFromUrl) {
    showMessage("Missing or invalid reset link.", 'error');
    return;
  }

  setResetToken(tokenFromUrl);
  setUserId(userIdFromUrl);

  console.log("✅ Verifying token:", tokenFromUrl, userIdFromUrl);

  const verifyToken = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/verify-pass-reset-token', {
        token: tokenFromUrl,
        userId: userIdFromUrl,
      });
      showMessage(res.data.message || "Token is valid. You can now reset your password.", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || '❌ Invalid or expired reset link.', 'error');
    }
  };

  verifyToken();
}, [location]);




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('❌ Passwords do not match!', 'error');
      return;
    }

  try {
    console.log("🔒 Reset request payload:", { token: resetToken, userId, newPassword });

    const res = await axios.post('http://localhost:5000/api/user/reset-password', {
      token: resetToken,
      userId,
      newpassword: newPassword,
    });

    showMessage(res.data.message || '✅ Password reset successfully!', 'success');
    setNewPassword('');
    setConfirmPassword('');
    navigate('/LoginRegister');
  } catch (error) {
    console.error('Reset password error:', error);
    showMessage(error.response?.data?.error || 'Something went wrong. Please try again.', 'error');
  }
  };

  return (
    <div style={{...styles.container, backgroundColor:"whitesmoke"}} >
      <h2 style={{ color: 'red' }}>Reset Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          disabled={!newPassword || !confirmPassword}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor:'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default ResetPassword;
