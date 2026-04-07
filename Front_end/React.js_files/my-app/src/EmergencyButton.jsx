import { IoAlertCircle } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";

export default function EmergencyButton() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const triggerEmergency = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const response = await axios.post('http://localhost:5000/api/reciptent/EmergencyButton', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // adjust if you're using another auth system
        }
      });

      if (response.status === 200) {
        setFeedback("🚨 Emergency message sent to nearby donors.");
      }
    } catch (error) {
      console.error("Emergency trigger failed:", error.response?.data || error.message);
      setFeedback(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <button
        className="icon-button"
        onClick={triggerEmergency}
        disabled={loading}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer"
        }}
      >
        <IoAlertCircle style={{ fontSize: "400%", color: "Red" }} />
      </button>
      {loading && <p>Sending emergency alert...</p>}
      {feedback && <p style={{ color: feedback.startsWith("🚨") ? "green" : "red" }}>{feedback}</p>}
    </div>
  );
}
