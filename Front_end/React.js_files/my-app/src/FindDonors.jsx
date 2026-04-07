import React, { useState } from 'react';
import './FindDonors.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';
import { useMessage } from './context/MessageContext';
// Fix default marker icon path issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function FindDonors() {
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationMethod, setLocationMethod] = useState('');
  const { showMessage } = useMessage();
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setManualAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLoading(false);
          setError(null);
        },
        () => {
          setError('Unable to retrieve your location. Please enter your address manually.');
          setLoading(false);
          setLocationMethod('manual');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your address manually.');
      setLoading(false);
      setLocationMethod('manual');
    }
  };

  const handleAddressChange = (e) => {
    setManualAddress(e.target.value);
  };

  const selectLocationMethod = (method) => {
    setLocationMethod(method);
    if (method === 'live') {
      getCurrentLocation();
    }
  };

  const geocodeAddress = async () => {
    if (!manualAddress) {
      setError('Please enter an address');
      return null;
    }

    setLoading(true);
    try {
      // Mock geocoded location for demo
      const mockResponse = {
        results: [
          {
            geometry: {
              location: {
                lat: 34.0522,
                lng: -118.2437,
              },
            },
          },
        ],
      };

      const location = mockResponse.results[0].geometry.location;
      setUserLocation({ lat: location.lat, lng: location.lng });
      setLoading(false);
      return location;
    } catch {
      setError('Error geocoding address. Please try again.');
      setLoading(false);
      return null;
    }
  };
  const navigate = useNavigate();
  const findDonors = async () => {
    let location;

    if (locationMethod === 'live') {
      if (!userLocation) {
        getCurrentLocation();
        return;
      }
      location = userLocation;
    } else if (locationMethod === 'manual') {
      location = await geocodeAddress();
      if (!location) return;
    } else {
      setError('Please select a location method first');
      return;
    }

    setLoading(true);
   try {
  const response = await axios.post('http://localhost:5000/api/reciptent/FindDonors',
    {
      address: manualAddress,
      blood_type: bloodType,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  const apiDonors = response.data.data;

  const mappedDonors = apiDonors.map((donor, index) => ({
    id: index,
    name: donor.name,
    bloodType: bloodType,
    lastDonation: "Unknown",
    distance: "Within 5 km",
    location: {
      lat: donor.location[1], // latitude
      lng: donor.location[0], // longitude
    },
    available: "Unknown"
  }));

  setDonors(mappedDonors);
  setLoading(false);
} catch (error) {
  console.error(error);
  setError('Error finding donors. Please try again.');
  showMessage(error.response?.data?.message || "Failed to find donor.", 'error');
  setLoading(false);
}
};

      
  return (
    <div className="container">
      
      <h1 className="page-title">Blood Donor Finder</h1>
      <p className="subtitle">Find compatible blood donors near your location</p>

      <div className="location-panel">
        <h2 className="section-title">Your Location</h2>

        {/* Original location choice buttons - hidden by CSS but kept for functionality */}
        <div className="location-choice">
          <div className="choice-button-container">
            <button
              className={`choice-button ${locationMethod === 'live' ? 'active' : ''}`}
              onClick={() => selectLocationMethod('live')}
            >
              Use Live Location
            </button>
            <button
              className={`choice-button ${locationMethod === 'manual' ? 'active' : ''}`}
              onClick={() => selectLocationMethod('manual')}
            >
              Enter Address Manually
            </button>
          </div>
        </div>

        {/* Modified Google Maps-style UI - removed destination field */}
        <div className="maps-style-inputs">
          <div className="maps-input-container">
            <div className="maps-icon origin"></div>
            <input 
              type="text" 
              className="maps-input"
              placeholder="Choose starting point, or click on the map"
              onClick={() => selectLocationMethod('manual')}
              value={manualAddress}
              onChange={handleAddressChange}
            />
          </div>
          
          <div className="current-location-option" onClick={() => selectLocationMethod('live')}>
            <div className="current-location-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
              </svg>
            </div>
            Your location
          </div>
        </div>

        {/* Original address input - hidden by CSS */}
        {locationMethod === 'manual' && (
          <div className="address-input">
            <label htmlFor="address">Enter your address:</label>
            <input
              type="text"
              id="address"
              value={manualAddress}
              onChange={handleAddressChange}
              placeholder="123 Main St, City, State"
            />
          </div>
        )}

        {userLocation && (
          <div className="location-status">
            <p className="success-text">
              Location {locationMethod === 'live' ? 'detected' : 'set'}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="search-criteria">
          <h3 className="subsection-title">Required Blood Type</h3>

          <div className="blood-type-selector">
            <select
              id="bloodType"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
            >
              <option value="">Any blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <button
          onClick={findDonors}
          disabled={loading || !locationMethod}
          className="search-button"
          style={{width:"50%",justifyContent:"center", margin: "0 auto" , display:"block"}}
         
        >
          {loading ? 'Searching...' : 'Find Blood Donors'}
        </button>
      </div>

      <div className="map-container">
        {userLocation ? (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>
            {donors.map((donor) => (
              <Marker key={donor.id} position={donor.location}>
                <Popup>{donor.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p>Map will appear once your location is set</p>
        )}
      </div>

      <div className="results-panel">
        <h2 className="section-title">Nearby Blood Donors</h2>

        {donors.length > 0 ? (
          <div className="donor-list">
            {donors.map((donor) => (
              <div key={donor.id} className="donor-card">
                <h3 className="donor-name">{donor.name}</h3>
                <div className="donor-details">
                  <p><span className="label">Blood Type:</span> {donor.bloodType}</p>
                  <p><span className="label">Last Donated:</span> {donor.lastDonation}</p>
                  <p><span className="label">Distance:</span> {donor.distance} miles</p>
                 
                </div>
                <div className="donor-actions">
                  <button className="info-button">Request Donation</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">
            {loading ? 'Searching for blood donors...' : 'No blood donors found matching your criteria. Try modifying your blood type filter.'}
          </p>
        )}
      </div>
      <button
      onClick={() => navigate(-1)}
     className="back"
     style={{ width: "8%" }}
    >
      ← Back
    </button>
    <MapComponent/>
    </div>
  );
}

export default FindDonors;