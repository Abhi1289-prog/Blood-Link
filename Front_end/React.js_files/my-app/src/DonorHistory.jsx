import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './DonorHistory.css';
import { FaDroplet } from "react-icons/fa6";

const DonorHistory = () => {
  const [donorHistory, setDonorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDurationFromToday = (dateString) => {
    const donationDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - donationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) return `${years} year(s) ago`;
    if (months > 0) return `${months} month(s) ago`;
    return `${days} day(s) ago`;
  };

  const fetchDonorHistory = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/history/DonorHistory',
        {}, // body is empty for this POST
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data;

      const formattedHistory = result.data.map((entry, index) => ({
        id: index + 1,
        date: entry.donated_date,
        location: entry.address,
      }));

      setDonorHistory(formattedHistory);
    } catch (error) {
      console.error(
        'Error fetching donor history:',
        error.response?.data?.message || error.message
      );
      setDonorHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorHistory();
  }, []);

  return (
    <div className="donor-history-container">
      <title><FaDroplet style={{color:"red"}}/> BloodLink</title>
      <h2>Donor History</h2>
      {loading ? (
        <p>Loading donor history...</p>
      ) : donorHistory.length > 0 ? (
        <table className="donor-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {donorHistory.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.location}</td>
                <td>{getDurationFromToday(entry.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donation history found.</p>
      )}
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

export default DonorHistory;
