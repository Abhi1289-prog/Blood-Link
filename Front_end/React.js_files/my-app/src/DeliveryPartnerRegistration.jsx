import React, { useState, useEffect } from "react";

const DeliveryPartnerRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    gmail: "",
    phone: "",
    college: "",
    idFront: null,
    idBack: null,
  });

  // OTP verification states
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  
  // Timer states
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const [canResendEmailOTP, setCanResendEmailOTP] = useState(true);
  const [canResendPhoneOTP, setCanResendPhoneOTP] = useState(true);

  // Timer effects
  useEffect(() => {
    let interval;
    if (emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer(prev => prev - 1);
      }, 1000);
    } else if (emailResendTimer === 0) {
      setCanResendEmailOTP(true);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);

  useEffect(() => {
    let interval;
    if (phoneResendTimer > 0) {
      interval = setInterval(() => {
        setPhoneResendTimer(prev => prev - 1);
      }, 1000);
    } else if (phoneResendTimer === 0) {
      setCanResendPhoneOTP(true);
    }
    return () => clearInterval(interval);
  }, [phoneResendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset verification if email or phone is changed
    if (name === 'gmail' && emailVerified) {
      setEmailVerified(false);
      setShowEmailOTP(false);
      setEmailOTP("");
    }
    if (name === 'phone' && phoneVerified) {
      setPhoneVerified(false);
      setShowPhoneOTP(false);
      setPhoneOTP("");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const sendEmailOTP = () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const newOTP = generateOTP();
    setGeneratedEmailOTP(newOTP);
    setShowEmailOTP(true);
    setCanResendEmailOTP(false);
    setEmailResendTimer(60);
    setEmailOTP('');

    console.log(`Email OTP for ${email}: ${newOTP}`);
  };

   const sendPhoneOTP = () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const newOTP = generateOTP();
    setGeneratedPhoneOTP(newOTP);
    setShowPhoneOTP(true);
    setCanResendPhoneOTP(false);
    setPhoneResendTimer(60);
    setPhoneOTP('');

    console.log(`Phone OTP for ${phone}: ${newOTP}`);
  };
  const verifyEmailOTP = () => {
    if (emailOTP === generatedEmailOTP) {
      setEmailVerified(true);
      alert("Email verified successfully!");
      setShowEmailOTP(false);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const verifyPhoneOTP = () => {
    if (phoneOTP === generatedPhoneOTP) {
      setPhoneVerified(true);
      alert("Phone number verified successfully!");
      setShowPhoneOTP(false);
    } else {
      alert("Invalid OTP. Please try again.");
    }
};
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailVerified || !phoneVerified) {
      alert("Please verify both email and phone number before submitting");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("gmail", formData.gmail);
    submissionData.append("phone", formData.phone);
    submissionData.append("college", formData.college);
    submissionData.append("idFront", formData.idFront);
    submissionData.append("idBack", formData.idBack);

    fetch("http://localhost:3001/api/register-delivery", {
      method: "POST",
      body: submissionData,
    })
      .then(res => res.json())
      .then(data => alert("Registration successful!"))
      .catch(err => alert("Error submitting form"));
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Delivery Partner Registration</h2>
          <p style={styles.subtitle}>Join our network of trusted medical delivery partners</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="gmail"
              required
              value={formData.gmail}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email address"
            />
            <div style={styles.verificationRow}>
              {emailVerified && <span style={styles.verifiedText}>✓ Verified</span>}
              {!emailVerified && !showEmailOTP && (
                <button 
                  type="button" 
                  onClick={sendEmailOTP} 
                  style={styles.otpButton}
                  disabled={!formData.gmail}
                >
                  Send OTP
                </button>
              )}
            </div>
            {showEmailOTP && !emailVerified && (
              <div style={styles.otpSection}>
                <label style={styles.label}>Enter Email OTP</label>
                <input 
                  type="text" 
                  value={emailOTP} 
                  onChange={(e) => setEmailOTP(e.target.value)} 
                  style={styles.otpInput}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <div style={styles.otpButtonGroup}>
                  <button 
                    type="button" 
                    onClick={verifyEmailOTP} 
                    style={styles.verifyButton}
                    disabled={!emailOTP}
                  >
                    Verify OTP
                  </button>
                  <button 
                    type="button" 
                    onClick={sendEmailOTP} 
                    style={styles.resendButton}
                    disabled={!canResendEmailOTP}
                  >
                    {canResendEmailOTP ? 'Resend OTP' : `Resend in ${emailResendTimer}s`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter 10-digit phone number"
            />
            <div style={styles.verificationRow}>
              {phoneVerified && <span style={styles.verifiedText}>✓ Verified</span>}
              {!phoneVerified && !showPhoneOTP && (
                <button 
                  type="button" 
                  onClick={sendPhoneOTP} 
                  style={styles.otpButton}
                  disabled={!formData.phone}
                >
                  Send OTP
                </button>
              )}
            </div>
            {showPhoneOTP && !phoneVerified && (
              <div style={styles.otpSection}>
                <label style={styles.label}>Enter Phone OTP</label>
                <input 
                  type="text" 
                  value={phoneOTP} 
                  onChange={(e) => setPhoneOTP(e.target.value)} 
                  style={styles.otpInput}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <div style={styles.otpButtonGroup}>
                  <button 
                    type="button" 
                    onClick={verifyPhoneOTP} 
                    style={styles.verifyButton}
                    disabled={!phoneOTP}
                  >
                    Verify OTP
                  </button>
                  <button 
                    type="button" 
                    onClick={sendPhoneOTP} 
                    style={styles.resendButton}
                    disabled={!canResendPhoneOTP}
                  >
                    {canResendPhoneOTP ? 'Resend OTP' : `Resend in ${phoneResendTimer}s`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Medical College Name</label>
            <input
              type="text"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your medical college name"
            />
          </div>

          <div style={styles.fileSection}>
            <h3 style={styles.sectionTitle}>College ID Verification</h3>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>College ID Card (Front)</label>
              <div style={styles.fileInputWrapper}>
                <input
                  type="file"
                  name="idFront"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  id="idFront"
                />
                <label htmlFor="idFront" style={styles.fileLabel}>
                  {formData.idFront ? formData.idFront.name : "Choose file..."}
                </label>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>College ID Card (Back)</label>
              <div style={styles.fileInputWrapper}>
                <input
                  type="file"
                  name="idBack"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  id="idBack"
                />
                <label htmlFor="idBack" style={styles.fileLabel}>
                  {formData.idBack ? formData.idBack.name : "Choose file..."}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Register as Delivery Partner
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    animation: "slideIn 0.5s ease-out",
  },
  header: {
    background: "linear-gradient(135deg, rgb(254, 41, 41) 0%, rgb(228, 0, 0) 100%)",
    padding: "30px",
    textAlign: "center",
    color: "white",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: "600",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "0",
    fontSize: "16px",
    opacity: "0.9",
    fontWeight: "300",
  },
  form: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  input: {
    padding: "16px",
    fontSize: "16px",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
    outline: "none",
    fontFamily: "inherit",
  },
  verificationContainer: {
    position: "relative",
  },
  verificationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  otpButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  otpSection: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "12px",
    border: "1px solid #e9ecef",
  },
  otpInput: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    outline: "none",
    marginBottom: "16px",
    textAlign: "center",
    letterSpacing: "2px",
    fontWeight: "600",
  },
  otpButtonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  verifyButton: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
  resendButton: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    backgroundColor: "white",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
  fileSection: {
    backgroundColor: "#f8f9fa",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  fileInputWrapper: {
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
    width: "100%",
  },
  fileInput: {
    position: "absolute",
    left: "-9999px",
  },
  fileLabel: {
    display: "block",
    padding: "16px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    border: "2px dashed #ddd",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#666",
  },
  submitButton: {
    padding: "18px 32px",
    fontSize: "18px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, rgb(237, 93, 32) 0%, rgb(248, 33, 0) 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "16px",
    boxShadow: "0 4px 15px rgba(248, 33, 0, 0.3)",
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  input:focus {
    border-color: #007bff !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
  }
  
  label[for]:hover {
    border-color: #007bff !important;
    background-color: #f8fff8 !important;
    color: #007bff !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-1px) !important;
    opacity: 0.9;
  }
  
  button:active {
    transform: translateY(0) !important;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default DeliveryPartnerRegistration;