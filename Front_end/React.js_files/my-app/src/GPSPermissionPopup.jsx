import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMessage } from './context/MessageContext';

const GPSPermissionPopup = ({ onRespond }) => {
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await axios.post('http://localhost:5000/api/reciptent/update-location', { 
            lat: latitude,
            lng: longitude,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('donortoken')}`,
            },
          });

          console.log("✅ Donor location updated successfully.");

          onRespond(true);
        } catch (err) {
          console.error("❌ Error updating donor location:", err.response?.data?.message || err.message);
          showMessage("Failed to send location. Please check your network or try again.", 'error');
          onRespond(false);
        }
      },
      (error) => {
        console.error("❌ GPS access denied or unavailable:", error.message);
        showMessage("Please allow GPS access to enable live tracking.", 'error');
        onRespond(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>Allow Location Access</h3>
        <p>This app needs your location to proceed. Do you allow GPS access?</p>
        <button style={styles.allow} onClick={handleAllow}>Allow</button>
        <button style={styles.deny} onClick={() => onRespond(false)}>Deny</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '300px'
  },
  allow: {
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  deny: {
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  }
};

export default GPSPermissionPopup;
