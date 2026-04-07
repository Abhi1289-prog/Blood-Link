import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Tracking.css';
import axios from 'axios';

const donorIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const recipientIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Tracking = ({ requestId }) => {
  const [donorLocation, setDonorLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [error, setError] = useState(null);
  const [recipientLocation] = useState([12.9716, 77.5946]); // Default recipient location
  const center = donorLocation || recipientLocation;
  const fetchRoute = async (start, end) => {
    try {
      const apiKey = '5b3ce3597851110001cf6248dd969578506f4fa3932129fe8269a59e';
      const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: [start.slice().reverse(), end.slice().reverse()] // ORS uses [lng, lat]
        })
      });

      const data = await response.json();
      const coords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRouteCoords(coords);
    } catch (err) {
      console.error('Route fetch failed:', err);
      setError('Failed to fetch route.');
    }
  };

 useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/reciptent/get-location', {
        request_id: requestId
      });

      const { coordinates, status } = res.data;
      if (status !== 'pending') {
        clearInterval(interval);
        setError(`Tracking stopped: Request is marked as '${status}'.`);
        return;
      }

      const newLoc = [coordinates.lat, coordinates.lng];
      setDonorLocation(newLoc);
      setLocationHistory(prev => [...prev, newLoc]);
      fetchRoute(newLoc, recipientLocation);
    } catch (err) {
      console.error('Location fetch error:', err);
      setError('Unable to get donor location');
    }
  }, 5000);

  return () => clearInterval(interval); 
}, [requestId, recipientLocation]);

  return (
    <div className="tracking-wrapper">
      <div className="tracking-header">
        <div className="header-content">
          <h1>Donor Live Tracker</h1>
          <p>Recipient can monitor donor's real-time location and route</p>
        </div>
        {error && <div className="error-box">{error}</div>}
      </div>

      <div className="map-section">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="leaflet-map">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={recipientLocation} icon={recipientIcon}>
            <Popup>Recipient</Popup>
          </Marker>
          {donorLocation && (
            <Marker position={donorLocation} icon={donorIcon}>
              <Popup>Donor</Popup>
            </Marker>
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>

      <div className="info-panel">
        <div className="info-block">
          <h3>Donor Location</h3>
          {donorLocation ? (
            <>
              <p>Lat: {donorLocation[0].toFixed(6)}</p>
              <p>Lng: {donorLocation[1].toFixed(6)}</p>
            </>
          ) : (
            <p>Waiting for donor location...</p>
          )}
        </div>
        <div className="info-block">
          <h3>Route History</h3>
          <p>{locationHistory.length} updates</p>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
