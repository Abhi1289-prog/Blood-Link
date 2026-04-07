// utils/geocode.js
const axios = require('axios');

async function geocodeLocation(locationText) {
 try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationText)}&format=json&limit=1`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'blood-link-app (saravanansaro.k123@gmail.com)'
      }
    });

    if (response.data.length === 0) return null;

    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    console.error("❌ Geocoding error:", error.message);
    return null;
  }
}

module.exports = geocodeLocation;
