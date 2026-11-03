import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import "./RequestBlood.css";
import { useMessage } from './context/MessageContext';

const RequestBlood = () => {
    const { showMessage } = useMessage();
    const navigate = useNavigate();
    const [requestDetails, setRequestDetails] = useState({
        patientName: "",
        bloodType: "",
        unitsNeeded: 1,
        hospitalName: "",
        hospitalAddress: "",
        requiredBy: "",
        contactName: "",
        contactPhone: "",
        urgencyLevel: "normal",
        medicalNotes: ""
    });
   
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
   useEffect(() => {
  const name = localStorage.getItem("name");
  const phone = localStorage.getItem("phone");

  if (name || phone) {
    setIsLoggedIn(true);
    setRequestDetails((prev) => ({
      ...prev,
      contactName: name || "",
      contactPhone: phone || ""
    }));
  } else {
    setIsLoggedIn(false);
  }
}, []);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestDetails({
            ...requestDetails,
            [name]: value
        });
    };
    
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token"); // Make sure token is stored after login

    const response = await axios.post(
      "http://localhost:5000/api/reciptent/RequestBlood", // 👈 match this with your backend route
      {
        patient_name: requestDetails.patientName,
        blood_type: requestDetails.bloodType,
        unit_needed: requestDetails.unitsNeeded,
        hospital_name: requestDetails.hospitalName,
        hospital_address: requestDetails.hospitalAddress,
        date: requestDetails.requiredBy,
        contact_name: requestDetails.contactName,
        contact_number: requestDetails.contactPhone
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Navigate to confirmation page with request details
    showMessage("You request is Sent to the Donor", 'success');

  } catch (error) {
    console.error("Error submitting blood request:", error.response?.data || error.message);
    showMessage("Failed to submit blood request. Please ensure all details are correct and try again.", 'error');
  }
};

if (!isLoggedIn) {
  navigate("/LoginRegister");
  return null;
}

    
    return (
        <div className="request-blood-container">
            <h2>Blood Donation Request</h2>
            <form onSubmit={handleSubmit}>
            
                <div className="form-section" style={{width:"97%"}}>
                    <h3>Patient Information</h3>
                    <input
                        type="text"
                        name="patientName"
                        placeholder="Patient Name"
                        value={requestDetails.patientName}
                        onChange={handleChange}
                        required
                    />
                    
                    <div className="select-container" >
                        <label htmlFor="bloodType">Blood Type Required:</label>
                        <select
                            id="bloodType"
                            name="bloodType"
                            value={requestDetails.bloodType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Blood Type</option>
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
                    
                    <div className="number-input">
                        <label htmlFor="unitsNeeded">Units Needed:</label>
                        <input
                            type="number"
                            id="unitsNeeded"
                            name="unitsNeeded"
                            min="1"
                            max="10"
                            value={requestDetails.unitsNeeded}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-section" style={{width:"97%"}}>
                    <h3>Hospital Information</h3>
                    <input
                        type="text"
                        name="hospitalName"
                        placeholder="Hospital Name"
                        value={requestDetails.hospitalName}
                        onChange={handleChange}
                        required
                    />
                    
                    <textarea
                        name="hospitalAddress"
                        placeholder="Hospital Address"
                        value={requestDetails.hospitalAddress}
                        onChange={handleChange}
                        required
                    />
                    
                    <div className="date-input">
                        <label htmlFor="requiredBy">Required By:</label>
                        <input
                            type="date"
                            id="requiredBy"
                            name="requiredBy"
                            value={requestDetails.requiredBy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-section" style={{width:"97%"}}>
                    <h3>Contact Information</h3>
                    <input
                        type="text"
                        name="contactName"
                        placeholder="Contact Person Name"
                        value={requestDetails.contactName}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="tel"
                        name="contactPhone"
                        placeholder="Contact Phone Number"
                        value={requestDetails.contactPhone}
                        onChange={handleChange}
                        required
                    />
                </div>
                
               
                <button type="submit" className="submit-button">Submit Request</button>
            </form>
            <button className="back" onClick={() => navigate(-1)} style={{width:"8%"}}>
        <IoMdArrowRoundBack /> Back
      </button>
        </div>
    );
};

export default RequestBlood;