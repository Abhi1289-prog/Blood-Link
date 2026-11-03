import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import findBloodGroupImg from './images/OIp.jfif';
import fillFormImg from './images/th.jfif';
import bookSlotImg from './images/download.png';
import feedbackImg from './images/download (1).png';
import History from './images/History.jpg';
import './DonorPage.css';
import { useUser } from './context/Usercontext';
import axios from 'axios';


const DonorPage = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();
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
  return (
    <div className='page-wrapper' style={{minHeight:"100vh"}}>
      
      {/* Back button */}
      <button onClick={() => navigate('/donor-and-receiptent')} className="back">
        <FaArrowLeft /> Back
      </button>
      <div className="logout-wrapper">
        <button className="logoutbutton" onClick={handleLogout}>Log out</button>
      </div>
<div className="shift-left">
        <button onClick={() => navigate("/RecipientPage")} className='logoutbutton'>
          <span>Recipient</span>
        </button>
      </div>
       

      <div className="visible form-content">
            <h2 className="h2O" style={{ color: "black", textAlign: "center" }}>Welcome Donor</h2>
            <div className="container2" style={{ alignItems: "center" }}>
              <ul className="cta-list">
                <li><div className="component-box1"><Link to="/BloodTypeDetector" className="cta-button2"><img src={findBloodGroupImg} alt="Find Blood Group" /><span className="cta-label">Find Your Blood Group</span></Link></div></li>
                <li><div className="component-box1"><Link to="/BloodDonationForm" className="cta-button2"><img src={fillFormImg} alt="Fill The Form" /><span className="cta-label">Fill The Form</span></Link></div></li>
                <li><div className="component-box1"><Link to="/BookDonationSlot" className="cta-button2"><img src={bookSlotImg} alt="Book a Slot" /><span className="cta-label">Book a Slot</span></Link></div></li>
                <li><div className="component-box1"><Link to="/DonorFeedback" className="cta-button2"><img src={feedbackImg} alt="Feedback" /><span className="cta-label">Feedback</span></Link></div></li>
                <li><div className="component-box1"><Link to="/DonorHistory" className="cta-button2"><img src={History} alt="History" /><span className="cta-label">Donor History</span></Link></div></li>
              </ul>
            </div>
          </div>
          </div>
  );
};

export default DonorPage;
