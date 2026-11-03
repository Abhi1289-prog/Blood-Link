import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import bloodLogo from './images/blooddonation.png';
import bloodbank from './images/blood-bank.png';
import "./DonorandReciptent.css";
import { useUser } from './context/Usercontext';
import axios from 'axios';
import { useMessage } from './context/MessageContext';

const DonorandReciptent = () => {
  const [showDonorPopup, setShowDonorPopup] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { setUserData, userData } = useUser();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    profilePic: null,
    homeAddress: "",
    officeAddress: "",
    userType: "",
  });

  const { showMessage } = useMessage();

  const navigate = useNavigate();

  // Toggle profile modal
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

 useEffect(() => {
  const address = localStorage.getItem("address") || "";
  const age = localStorage.getItem("age") || "";
  const gender = localStorage.getItem("gender") || "";
  const bloodgroup = localStorage.getItem("bloodgroup") || "";
  const officeaddress = localStorage.getItem("officeaddress") || "";
  const name=localStorage.getItem('name');
  const email=localStorage.getItem('email');
  const phone=localStorage.getItem('phone');
  const username=localStorage.getItem('username');

  const userType = officeaddress ? "employee" : "Unemployee";

  setUserDetails({
    fullName:name,
    username,
    phone,
    email,
    homeAddress:address,
    officeAddress:officeaddress,
    userType
  });

  setFormData(prev => ({
    ...prev,
    name: name || 'Guest User',
    phone:phone || 'N/A',
    email: email || 'N/A',
    username: username || 'N/A',
    homeAddress:address || "",
    officeAddress:officeaddress || "",
    userType: userType,
  }));

  console.log("✅ DonorandReceiptent component rendered");
}, []);
  const handleLogout = () => {
    // ✅ 1. Clear localStorage
    localStorage.clear(); // or remove specific keys

    // ✅ 2. Reset context state
    setUserData(null); // or an empty object if your default is {}

    // ✅ 3. Navigate to login/register page
    navigate('/LoginRegister');
  };
  // Show popup instead of direct navigation
  const handleDonorClick = () => {
    setShowDonorPopup(true);
  };
  // Navigate after user selects eligibility
const handleEligibilitySelect = async (option) => {
  setShowDonorPopup(false); // Close popup

  try {
    const token = localStorage.getItem('token');
     if(!token){
       navigate("/LoginRegister");
       return;
     }
    const eligibilityResponse = await axios.post(
      'http://localhost:5000/api/persondetail/check-eligible',
      { check: option },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = eligibilityResponse.data.details;
    const {iseligibility}=data;
    localStorage.setItem('iseligibility',iseligibility);
    setUserData({
      iseligibility
    });

    showMessage(eligibilityResponse.data.message || "Eligibility checked", 'success');
  } catch (error) {
    showMessage('Error submitting form: ' + (error.response?.data?.message || error.message), 'error');
  }

  navigate("/DonorPage"); // Navigate after try/catch
};

  const handleRecipientClick = () => {
    navigate("/RecipientPage");
  };

  return (
    <div className="page-wrapper">
      {/* Profile Section */}
      <div className="profile-wrapper">
        <button className="profile-button" onClick={toggleProfile}>
          <FaUser style={{ width: "27px", height: "auto" }} />
        </button>
      </div>

      {isProfileOpen && (
  <div className="profile-modal">
    <h2>User Profile</h2>
    <div className="profile-preview-wrapper">
      {userDetails.profilePic ? (
        <img
          src={userDetails.profilePic}
          alt="Profile"
          className="profile-preview-large"
        />
      ) : (
        <div className="profile-placeholder">No Image</div>
      )}

      <div className="profile-info">
        <p><strong>Full Name:</strong> {userDetails.fullName}</p>
        <p><strong>Username:</strong> {userDetails.username}</p>
        <p><strong>Phone:</strong> {userDetails.phone}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p>
          <strong>Address:</strong> {userDetails.homeAddress}
          {userDetails.userType === "employee" && userDetails.officeAddress && (
            <span>, {userDetails.officeAddress}</span>
          )}
        </p>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={toggleProfile} style={{ width: "50%" }}>Close</button>
    </div>
  </div>
)}

      {/* Donor Eligibility Popup */}
      {showDonorPopup && (
        <div className="donor-popup-overlay">
          <div className="donor-popup">
            <h3>Donor Eligibility</h3>
            <p>Have you donated blood within the last 3 months?</p>
            <div className="donor-options">
              <label>
                <input
                  type="radio"
                  name="eligibility"
                  onClick={() => handleEligibilitySelect(false)}
                />
                Yes, within 3 months
              </label>
              <label>
                <input
                  type="radio"
                  name="eligibility"
                  onClick={() => handleEligibilitySelect(true)}
                />
                No, more than 3 months ago
              </label>
              <label>
                <input
                  type="radio"
                  name="eligibility"
                  onClick={() => handleEligibilitySelect(true)}
                />
                Never donated
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Log out button */}
      <div className="logout-wrapper">
        <button className="logoutbutton" onClick={handleLogout}>Log out</button>
      </div>

      {/* Main Donor/Recipient Buttons */}
      <div className="center-buttons-container">
        <div className="">
          <button className="role-btn circle-btn" onClick={handleDonorClick} style={{backgroundColor:"red"}}>
            <div className="logo-wrapper">
              <img src={bloodLogo} alt="Blood Donation Logo" className="logo-img" />
            </div>
            <span>Donor</span>
          </button>
        </div>
        <div className="">
          <button className="role-btn circle-btn" onClick={handleRecipientClick} style={{backgroundColor:"red"}}>
            <div className="logo-wrapper">
              <img src={bloodbank} alt="Blood Bank Logo" className="logo-img" />
            </div>
            <span>Recipient</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorandReciptent;
