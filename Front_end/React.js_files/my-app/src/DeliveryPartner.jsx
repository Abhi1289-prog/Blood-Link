import React, { useState } from "react";
import {  useNavigate } from 'react-router-dom';
import "./DeliveryPartner.css";

const DeliveryPartner = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasDrivingLicense, setHasDrivingLicense] = useState(false);
  const [donorSlotBooked, setDonorSlotBooked] = useState(false);
  const [isBloodCollected, setIsBloodCollected] = useState(false);
  const [isBloodDelivered, setIsBloodDelivered] = useState(false);
  const [recipientRequest, setRecipientRequest] = useState(false);
  const [message, setMessage] = useState(""); // New state to handle feedback messages
 const navigate = useNavigate();


  // Handle Delivery Partner Registration
  const handleRegister = () => {
    if (!hasDrivingLicense) {
      setMessage("You need a valid driving license to register as a delivery partner.");
      return;
    }
    setIsRegistered(true);
    setMessage("Registration successful! You are now a delivery partner.");
  };

  // Handle Collection from Donor
  const handleCollectBlood = () => {
    if (!donorSlotBooked) {
      setMessage("No donor slot booked. Cannot collect blood.");
      return;
    }
    setIsBloodCollected(true);
    setMessage("Blood collected from donor successfully.");
  };

  // Handle Blood Delivery to Recipient
  const handleDeliverBlood = () => {
    if (!isBloodCollected) {
      setMessage("No blood collected yet. Cannot deliver.");
      return;
    }
    if (!recipientRequest) {
      setMessage("No recipient request available.");
      return;
    }
    setIsBloodDelivered(true);
    setMessage("Blood delivered to recipient successfully.");
  };

  return (
    <div className="delivery-partner-container">
      <h1 className="h14">Delivery Partner Dashboard</h1>

      {/* Feedback Message */}
      {message && (
        <div className="status-message">
          <p>{message}</p>
        </div>
      )}

      {/* Registration Form */}
      {!isRegistered ? (
        <div className="registration-form">
          <h3>Register as Delivery Partner</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={hasDrivingLicense}
                onChange={() => setHasDrivingLicense(!hasDrivingLicense)}
              />
              I have a valid driving license
            </label>
          </div>
          <button className="buttons" onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div className="status-message">
          <h3>Welcome, Delivery Partner</h3>
        </div>
      )}

      {/* Collect Blood Section */}
      {isRegistered && (
        <div className="collect-section">
          <h3>Collect Blood from Donor</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={donorSlotBooked}
                onChange={() => setDonorSlotBooked(!donorSlotBooked)}
              />
              Donor has booked a collection slot
            </label>
          </div>
          <button className="buttons" onClick={handleCollectBlood}>Collect Blood</button>
        </div>
      )}

      {/* Deliver Blood Section */}
      {isRegistered && (
        <div className="delivery-section">
          <h3>Deliver Blood to Recipient</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={recipientRequest}
                onChange={() => setRecipientRequest(!recipientRequest)}
              />
              Recipient has requested blood
            </label>
          </div>
          <button className="buttons" onClick={handleDeliverBlood}>Deliver Blood</button>
        </div>
      )}

      {/* Status Messages */}
      {isBloodCollected && !isBloodDelivered && (
        <div className="status-message">
          <p>Blood collected. Ready for delivery!</p>
        </div>
      )}
      {isBloodDelivered && (
        <div className="status-message">
          <p>Blood delivered to the recipient successfully.</p>
        </div>
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

export default DeliveryPartner;
