import React, { useState} from 'react';
import axios from 'axios';
import './Login.css'; // Import the new CSS file

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null); // State for custom message
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Function to display custom message
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
    };

    // Function to close custom message
    const closeMessage = () => {
        setMessage(null);
        setMessageType('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            showMessage('Please enter both username and password.', 'error');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/user/signin', {
                username,
                password
            });

            const data = response.data;

            // Save token and user data
            localStorage.setItem('donortoken', data.user.token);

            // Optionally pass to parent
            if (onLogin) onLogin(data.user); 

            showMessage('Login successful!', 'success');
        } catch (err) {
            console.error('Login error:', err);
            const errorMsg =
                err.response?.data?.error || 'Login failed. Please try again.';
            showMessage(errorMsg, 'error');
        }
    };

    return (
        <div className="login-container">
            {/* Animated Background and Blood Drops */}
            <div className="blood-background"></div>
            <div className="blood-drops-container">
                <div className="blood-drop drop-1"></div>
                <div className="blood-drop drop-2"></div>
                <div className="blood-drop drop-3"></div>
                <div className="blood-drop drop-4"></div>
            </div>

            {/* Login Form */}
            <div className="login-form-container">
                <div className="login-header">
                    <div className="title-container">
                        <h2 className="login-title">Login</h2>
                        <div className="title-underline"></div>
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                  
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                   
                </div>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="login-button"
                >
                    <span className="button-text">Login</span>
                    <span className="button-icon">⚡</span>
                </button>

                <div className="login-footer"></div>
                <div className="blood-splatter"></div>
            </div>

            {/* Custom Message Box */}
            {message && (
                <div className={`message-box ${messageType}`}>
                    <p>{message}</p>
                    <button onClick={closeMessage}>OK</button>
                </div>
            )}
        </div>
    );
};

export default Login;