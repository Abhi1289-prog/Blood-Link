import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import GPSPermissionPopup from './GPSPermissionPopup';
import axios from 'axios';

function Accept() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGPSPopup, setShowGPSPopup] = useState(false);
  const [gpsGranted, setGPSGranted] = useState(false);

  const location = useLocation();

  // Called after login success
  const handleLogin = async () => {
    setIsLoggedIn(true);

    // ✅ Get token and requestId from URL when needed
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const requestId = query.get('request_id');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reciptent/Accept', // Update if needed
        { token, request_id: requestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('donortoken')}`,
          },
        }
      );

      console.log('✅ Request accepted:', response.data.message);
      setShowGPSPopup(true);
    } catch (err) {
      console.error('❌ Failed to accept request:', err.response?.data?.message || err.message);
      alert('Request acceptance failed. You may have already accepted or link expired.');
    }
  };

  const handleGPSPermission = (granted) => {
    setShowGPSPopup(false);
    setGPSGranted(granted);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : showGPSPopup ? (
        <GPSPermissionPopup onRespond={handleGPSPermission} />
      ) : gpsGranted ? (
        <h2 style={{ textAlign: 'center', marginTop: '100px' }}>
          ✅ GPS access handled. You may close or continue.
        </h2>
      ) : (
        <h2 style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>
          ❌ GPS access denied. Unable to continue tracking.
        </h2>
      )}
    </div>
  );
}

export default Accept;
