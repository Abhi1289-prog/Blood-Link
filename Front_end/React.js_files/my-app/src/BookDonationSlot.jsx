import React, { useState } from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useNavigate } from 'react-router-dom';
import './BookDonationSlot.css';
import { useMessage } from './context/MessageContext';

const BookDonationSlot = () => {
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [address, setAddress] = useState("");
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slotDate || !slotTime || !address) {
      showMessage("Please fill all required fields.", 'error');
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Replace if using different token storage

      const response = await axios.post(
        "http://localhost:5000/api/bookslot/BookDonationSlot", // your backend slot route
        {
          date: slotDate,
          time: slotTime,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showMessage(response.data.message || "Slot booked successfully!", 'success');
      // Reset form
      setSlotDate("");
      setSlotTime("");
      setAddress("");
    } catch (error) {
      console.error("Slot booking failed:", error);
      showMessage(
        error.response?.data?.message || "Failed to book slot. Please try again.",
        'error'
      );
    }
  };

  return (
    <div className="book-slot-containers">
      <form onSubmit={handleSubmit} className="book-slot-form">
        <h2 className="book-slot-title">Book a Blood Donation Slot</h2>

        {/* Date */}
        <div>
          <label className="book-slot-form2-label2">Choose a Date:</label>
          <input
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            className="book-slot-input"
            style={{width:"95%"}}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="book-slot-form2-label2">Choose a Time:</label>
          <input
            type="time"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
            className="book-slot-input"
            style={{width:"95%"}}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="book-slot-form2-label2">Your Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="book-slot-textarea"
            style={{width:"95%"}}
            rows={3}
            required
          />
        </div>

        <button type="submit" className="book-slot-button">
          Book Slot
        </button>
      </form>
      <button className="back" onClick={() => navigate(-1)} style={{ width: "8%" }}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
};

export default BookDonationSlot;
