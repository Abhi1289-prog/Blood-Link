import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDroplet } from "react-icons/fa6";
import './DonorFeedback.css';
import { useMessage } from './context/MessageContext';

const DonorFeedback = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const getRatingLabel = (value) => {
    switch (value) {
      case 1: return "Very Poor";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "No Rating";
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!rating || !comments.trim()) {
    showMessage("Please provide a rating and some feedback.", 'error');
    return;
  }

  const feedbackData = {
    name: name || "Anonymous",
    rating: rating.toString(),
    user_type:"Donor",
    feedback: comments,
  };

  const token = localStorage.getItem("token"); // Replace with your token storage logic

  try {
    const response = await axios.post(
      'http://localhost:5000/api/feedback/DonorFeedback',
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    showMessage(response.data.message || "Feedback submitted successfully!", 'success');
    console.log("Feedback submitted:", response.data);

    // Reset form
    setName("");
    setRating(0);
    setHoveredRating(0);
    setComments("");
  } catch (error) {
    console.error("Submission error:", error);
    showMessage(error.response?.data?.message || "Failed to submit feedback.", 'error');
  }
};


  return (
    <div className="feedback-container">
      <title><FaDroplet style={{color:"red"}}/> BloodLink</title>
      <h2 className="feedback-title">Donor Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div>
          <label className="feedback-label">Your Name (optional):</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="feedback-input"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="feedback-label">Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${hoveredRating >= star || rating >= star ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="rating-label">
            {getRatingLabel(hoveredRating || rating)}
          </div>
        </div>

        <div>
          <label className="feedback-label">Your Feedback:</label>
          <textarea style={{width:"70%"}}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="feedback-textarea"
            rows={4}
            placeholder="Tell us about your experience..."
            required
          />
        </div>

        <button type="submit" className="feedback-button">Submit Feedback</button>
      </form>

      <button className="back" onClick={() => navigate(-1)} style={{ width: "8%" }}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
};

export default DonorFeedback;
