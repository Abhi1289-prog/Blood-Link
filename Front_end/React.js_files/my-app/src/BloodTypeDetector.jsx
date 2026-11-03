import React, { useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaTint, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import './BloodTypeDetector.css';

const BloodTypeDetector = () => {
  const [scannerStatus, setScannerStatus] = useState('idle');
  const [fingerprint, setFingerprint] = useState(null);
  const [bloodType, setBloodType] = useState(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setScannerStatus("error");
      setErrorMessage("Please upload a valid image file.");
      return;
    }

    setScannerStatus("scanning");
    setFingerprint(null);
    setBloodType(null);
    setProcessingStage(1);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", file); // 🔥 This automatically sends `originalname` to backend

    try {
      console.log(file);
      const response = await axios.post(
        "http://localhost:5000/api/model/BloodTypeDetector",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProcessingStage(2);
      setFingerprint({ image: URL.createObjectURL(file), quality: 100 });
      setBloodType(response.data.predicted_label || "Unknown");
      setScannerStatus("success");
    } catch (err) {
      console.error(err);
      setScannerStatus("error");
      setErrorMessage("Failed to connect to prediction server.");
    }
  };

  const renderFingerprintPattern = () => {
    if (!fingerprint?.image) return null;
    return <img src={fingerprint.image} alt="Fingerprint" className="mt-4 w-48 border" />;
  };

  return (
    <div className="blood-type-detector" style={{ minHeight: "100vh" }}>
      <div className="detector-container">
        <h1 className="detector-title">Blood Type Detection via Fingerprint Image</h1>

        <div className="scanner-section">
          <div className={`scanner-box ${scannerStatus}`}>
            {scannerStatus === 'idle' && <p>Upload a fingerprint image to begin.</p>}

            {scannerStatus === 'scanning' && (
              <div className="scanner-text">
                <p>Scanning image...</p>
                <FaSpinner className="spinner" size={24} />
              </div>
            )}

            {fingerprint && renderFingerprintPattern()}

            {scannerStatus === 'success' && bloodType && (
              <div className="result-container">
                <FaCheck size={32} className="success-icon" />
                <div className="blood-type-result">
                  <FaTint className="blood-icon" size={24} />
                  <span className="blood-type">{bloodType}</span>
                </div>
                <p className="result-text">
                  Blood type successfully predicted.
                </p>
              </div>
            )}

            {scannerStatus === 'error' && (
              <div className="error-container">
                <FaExclamationTriangle size={40} className="error-icon" />
                <p className="error-message">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="controls" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <label htmlFor="imageUpload">Upload Fingerprint Image</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={scannerStatus === "scanning"}
          />

          {(scannerStatus === "success" || scannerStatus === "error") && (
            <button onClick={() => setScannerStatus("idle")} className="reset-button">
              Reset
            </button>
          )}
        </div>
      </div>

      <button className="back" onClick={() => navigate(-1)} style={{ width: "8%" }}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
};

export default BloodTypeDetector;
