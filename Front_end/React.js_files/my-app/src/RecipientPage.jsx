import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiFeedbackLine } from "react-icons/ri";
import { FaArrowLeft } from 'react-icons/fa';
import { MdBloodtype } from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import BloodStocks from './images/BloodStock.jpg';
import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending, MdCancel } from "react-icons/md";
import './DonorandReciptent.css';
import EmergencyButton from './EmergencyButton';
import axios from 'axios';
import { useUser } from './context/Usercontext';

const RecipientPage = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState("Pending");
   const { setUserData } = useUser();
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setShowPopup(false);

    try {
      await axios.post(`http://localhost:5000/api/reciptent/donor-status`, {
        status: newStatus,
      },
     {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  } );

      console.log("✅ Status updated successfully");
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };
  const handleLogout = async () => {
    // ✅ 1. Clear localStorage
    localStorage.clear(); // or remove specific keys
     try{
      const log = await axios.post(
        'http://localhost:5000/api/user/logout',
        {}, // body is empty for this POST
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(log.data);
    }catch(error){
      console.error("Error logging out:", error);
    }
    // ✅ 2. Reset context state
    setUserData(null); // or an empty object if your default is {}

    // ✅ 3. Navigate to login/register page
    navigate('/LoginRegister');
  };
  const renderIcon = () => {
    switch (status) {
      case "Pending":
        return <MdOutlinePending style={{ fontSize: "400%", color: "orange" }} />;
      case "Received":
        return <GrStatusGood style={{ fontSize: "400%", color: "green" }} />;
      case "Cancelled":
        return <MdCancel style={{ fontSize: "400%", color: "red" }} />;
      default:
        return null;
    }
  };

  return (
    <div className='page-wrapper' style={{ minHeight: "100vh" }}>
      <button onClick={() => navigate("/donor-and-receiptent")} className="back">
        <FaArrowLeft /> Back
      </button>

      <div className="logout-wrapper">
        <button className="logoutbutton" onClick={handleLogout}>Log out</button>
      </div>

      <div className="shift-left">
        <button onClick={() => navigate("/DonorPage")} className='logoutbutton'>
          <span>Donor</span>
        </button>
      </div>

      <h2 style={{ color: "black", textAlign: "center", marginBottom: "1rem" }}>Welcome Recipient</h2>

      <ul className="cta-list">
        <li>
          <div className="component-box1">
            <Link to="/RequestBlood" className="cta-button2" style={{ color: "red" }}>
              <MdBloodtype style={{ fontSize: "500%" }} /> Request Blood
            </Link>
          </div>
        </li>
        <li>
          <div className="component-box1">
            <Link to="/FindDonors" className="cta-button2" style={{ color: "red" }}>
              <SiOpenstreetmap style={{ fontSize: "500%" }} /> Find Donor
            </Link>
          </div>
        </li>
        <li>
          <div className="component-box1" >
            <Link to="/BloodStock" className="cta-button2" style={{ color: "red"}}>
              <img src={BloodStocks} alt="Blood Stock"  /> Check Blood Availability
            </Link>
          </div>
        </li>
        <li>
          <div className="component-box1">
            <Link to="/RecipientFeedback" className="cta-button2" style={{ color: "red" }}>
              <RiFeedbackLine style={{ fontSize: "500%" }} />
              <span className="cta-label">Feedback</span>
            </Link>
          </div>
        </li>
      </ul>

      <ul style={{ display: "flex", justifyContent: "center", gap: "2rem", listStyle: "none", padding: 0 }}>
        <li>
          <EmergencyButton />
        </li>
        <li>
          <button
            className="icon-button"
            style={{ backgroundColor: "transparent", display: "block", margin: "0 auto" }}
            onClick={() => setShowPopup(true)}
          >
            {renderIcon()}
          </button>
        </li>
      </ul>

      {showPopup && (
        <div className="popup-overlay" style={{ color: "black" }}>
          <div className="popup-box">
            <h3>Select Status</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label>
                <input
                  type="radio"
                  value="Pending"
                  checked={status === "Pending"}
                  onChange={handleStatusChange}
                /> Pending
              </label>
              <label>
                <input
                  type="radio"
                  value="Received"
                  checked={status === "Received"}
                  onChange={handleStatusChange}
                /> Received
              </label>
              <label>
                <input
                  type="radio"
                  value="Cancelled"
                  checked={status === "Cancelled"}
                  onChange={handleStatusChange}
                /> Cancelled
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientPage;
