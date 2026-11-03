import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { useUser } from './context/Usercontext';
import './LoginRegister.css';
import { useMessage } from './context/MessageContext';

const LoginRegister = () => {
  const { showMessage } = useMessage();
  const { setUserData } = useUser(); 
  const [action, setAction] = useState('');
  const [name, setName] = useState(localStorage.getItem('register_name') || '');
  const [password, setPassword] = useState(localStorage.getItem('register_password') || '');
  const [confirmPassword, setConfirmPassword] = useState(localStorage.getItem('register_confirmPassword') || '');
  const [userType, setUserType] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('register_phone') || '');
  const [username, setUsername] = useState(localStorage.getItem('register_username') || '');
  const [email, setEmail] = useState(localStorage.getItem('register_email') || '');
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  //const [generatedEmailOTP, setGeneratedEmailOTP] = useState('');
  const [generatedPhoneOTP, setGeneratedPhoneOTP] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [canResendEmailOTP, setCanResendEmailOTP] = useState(false);
  const [canResendPhoneOTP, setCanResendPhoneOTP] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(60);
  const [phoneResendTimer, setPhoneResendTimer] = useState(60);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showDeliveryPartnerReg, setShowDeliveryPartnerReg] = useState(false);
  const [deliveryFormData, setDeliveryFormData] = useState(() => {
  const saved = localStorage.getItem('deliveryFormData');
  return saved ? JSON.parse(saved) : {
    name: '',
    gmail: '',
    phone: '',
    college: '',
    idFront: null,
    idBack: null,
  };
});
const [dusername, dsetUsername] = useState(localStorage.getItem('delivery_username') || '');
const [dpassword, dsetPassword] = useState(localStorage.getItem('delivery_password') || '');
const [dconfirmPassword, dsetConfirmPassword] = useState(localStorage.getItem('delivery_confirmPassword') || '');
  const navigate = useNavigate();
  // Delivery Partner form states
  

  // Timer intervals
  useEffect(() => {
    let interval;
    if (emailResendTimer > 0 && !canResendEmailOTP) {
      interval = setInterval(() => {
        setEmailResendTimer(prev => {
          if (prev <= 1) {
            setCanResendEmailOTP(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer, canResendEmailOTP]);

  useEffect(() => {
    let interval;
    if (phoneResendTimer > 0 && !canResendPhoneOTP) {
      interval = setInterval(() => {
        setPhoneResendTimer(prev => {
          if (prev <= 1) {
            setCanResendPhoneOTP(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneResendTimer, canResendPhoneOTP]);

  const loginLink = () => {
    setAction('');
    setShowDeliveryPartnerReg(false);
    resetVerificationStates();
  };

  const registerLink = () => {
    if (!userType) {
      showMessage('Please select a user type before registering.', 'error');
      return;
    }

    if (userType === 'Delivery Partner') {
      setShowDeliveryPartnerReg(true);
      setAction('');
    } else if (userType === "Donor & Receiptent") {
      setAction('active');
      setShowDeliveryPartnerReg(false);
      resetVerificationStates();
    }
  };

  const resetVerificationStates = () => {
    setShowEmailOTP(false);
    setShowPhoneOTP(false);
    setEmailOTP('');
    setPhoneOTP('');
    setEmailVerified(false);
    setPhoneVerified(false);
    setCanResendEmailOTP(false);
    setCanResendPhoneOTP(false);
    setEmailResendTimer(60);
    setPhoneResendTimer(60);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    dsetConfirmPassword(val);
    setPasswordsMatch(val === password);
    localStorage.setItem('delivery_confirmPassword', e.target.value);
  };

   const handlePasswordChange = (e) => {
  dsetPassword(e.target.value);
  localStorage.setItem('delivery_password', e.target.value);
};
 const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendEmailOTP = async () => {
    if (!email) return alert("Enter email");
    try {
      await axios.post('http://localhost:5000/api/user/send-email-otp', { email });
      setShowEmailOTP(true);
      setCanResendEmailOTP(false);
      setEmailResendTimer(60);
      showMessage("Email OTP sent", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || "Error sending email OTP", 'error');
    }
  };
   const sendPhoneOTP = async () => {
    if (!phone.match(/^[0-9]{10}$/)) return alert("Enter valid phone number");
    const otp = generateOTP();
    setGeneratedPhoneOTP(otp);
    setShowPhoneOTP(true);
    setCanResendPhoneOTP(false);
    setPhoneResendTimer(60);
    try {
      await axios.post('http://localhost:5000/api/user/send-number-otp', { number: phone });
      console.log("Phone OTP sent");
    } catch (err) {
      showMessage(err.response?.data?.error || "Error sending phone OTP", 'error');
    }
  };

   const verifyEmailOTP = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/verify-email', { email, otp: emailOTP });
      setEmailVerified(true);
      setShowEmailOTP(false);
      showMessage("Email verified", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || "Invalid Email OTP", 'error');
    }
  };

 const verifyPhoneOTP = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/sms-otp', { number:phone, otp: phoneOTP });
      setPhoneVerified(true);
      setShowPhoneOTP(false);
      showMessage("Number verified", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || "Invalid SMS OTP", 'error');
    }
  };
   
   const ResendPhoneOTP = async () => {
    if (!phone.match(/^[0-9]{10}$/)) return alert("Enter valid phone number");
    const otp = generateOTP();
    setGeneratedPhoneOTP(otp);
    setShowPhoneOTP(true);
    setCanResendPhoneOTP(false);
    setPhoneResendTimer(60);
    try {
      await axios.post('http://localhost:5000/api/user/resend-sms-otp', { number: phone });
      console.log("Phone OTP sent");
    } catch (err) {
      showMessage(err.response?.data?.error || "Error sending phone OTP", 'error');
    }
  };
   const ResendEmailOTP = async () => {
   if (!email) return alert("Enter email");
    try {
      await axios.post('http://localhost:5000/api/user/resend-verification-token', { email });
      setShowEmailOTP(true);
      setCanResendEmailOTP(false);
      setEmailResendTimer(60);
      showMessage("Email OTP sent", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || "Error sending email OTP", 'error');
    }
  };
 const validateLogin = async (event) => {
  event.preventDefault();

  if (!username || !password || !userType) {
    showMessage("Please fill all required fields", 'error');
    return;
  }

try {
  const response = await axios.post("http://localhost:5000/api/user/signin", {
    username,
    password,
  });

  const user = response.data.user;

  if (!user.token) {
    console.error("❌ Token missing from user object:", user);
    showMessage("Login failed. Token missing.", 'error');
    return;
  }
const { name, email, phone_number: phone, Username, token, hasPersonalDetails } = user;

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("username", Username);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    console.log("✅ Token:", token);
    console.log("✅ User:", name);
    console.log('personal detail filled ',hasPersonalDetails);

    setUserData({
      name,
      email,
      phone,
      username,
      token,
      hasPersonalDetails,
    });


  if (userType === "Donor & Receiptent") {
    showMessage("✅ Donor & Recipient login successful!", 'success');
     
    if (!user.hasPersonalDetails)
      navigate("/PreBloodGroupForm");
    else {
  try {
    const profileResponse = await axios.post(
      "http://localhost:5000/api/persondetail/profile",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ fixed double space
        },
      }
    );

    const data = profileResponse.data.data;
    const {address,age,gender,bloodgroup,officeaddress}=data;
    localStorage.setItem('address',address);
    localStorage.setItem('age',age);
    localStorage.setItem('gender',gender);
    localStorage.setItem('bloodgroup',bloodgroup);
    localStorage.setItem('officeaddress',officeaddress);
    setUserData({
      address,
      age,
      gender,
      bloodgroup,
      officeaddress,
    });

    navigate("/donor-and-receiptent");
  } catch (error) {
    console.error("❌ Failed to fetch profile data:", error);

    // Optional: show user-friendly message
    showMessage(
      error.response?.data?.message ||
      "Failed to load profile data. Please try again.",
      'error'
    );
  }
}
  }
 else if (userType === "Delivery Partner") {
    console.log("✅ Delivery Partner login successful:", user);
    navigate("/DeliveryPartner");
  }
} catch (error) {
  console.error("❌ Login failed:", error);
  showMessage(error.response?.data?.error || "Login failed. Please try again.", 'error');
}
};


  const validateRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !username || !password || !confirmPassword) return showMessage("All fields required", 'error');
    if (!passwordsMatch) return showMessage("Passwords do not match", 'error');
    if (!emailVerified || !phoneVerified) return showMessage("Verify email and phone", 'error');
    if (!termsAccepted) return showMessage("Accept Terms and Conditions", 'error');

    try {
      await axios.post('http://localhost:5000/api/user/create', {
        name,
        email,
        password,
        phone_number: phone,
        username,
      });
      showMessage("Registration successful", 'success');
    } catch (err) {
      showMessage(err.response?.data?.error || "Registration failed", 'error');
    }
    localStorage.removeItem('register_name');
localStorage.removeItem('register_email');
localStorage.removeItem('register_phone');
localStorage.removeItem('register_username');
localStorage.removeItem('register_password');
localStorage.removeItem('register_confirmPassword');

  };

  // Delivery Partner form handlers
 const handleDeliveryChange = (e) => {
  const { name, value } = e.target;
  const updatedForm = { ...deliveryFormData, [name]: value };
  setDeliveryFormData(updatedForm);
  localStorage.setItem('deliveryFormData', JSON.stringify(updatedForm));
};


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDeliveryFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleDeliverySubmit = async (e) => {
  e.preventDefault();

  if (!emailVerified || !phoneVerified) {
    showMessage("Please verify your email and phone number before submitting.", 'error');
    return;
  }

  if (!passwordsMatch) {
    showMessage("Passwords do not match.", 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", deliveryFormData.name);
    formData.append("email", deliveryFormData.gmail);
    formData.append("password", password);
    formData.append("phone_number", deliveryFormData.phone);
    formData.append("username", username);
    formData.append("college", deliveryFormData.college);
    formData.append("idFront", deliveryFormData.idFront);
    formData.append("idBack", deliveryFormData.idBack);

   await axios.post(
      "http://localhost:5000/api/partner/register-delivery-partner",
      formData,
      {
        headers: {    
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showMessage("✅ Registration successful!", 'success');
    setShowDeliveryPartnerReg(false); // Redirect to login form
  } catch (error) {
    console.error("❌ Registration failed:", error);
    showMessage(error.response?.data?.error || "Failed to register. Please try again.", 'error');
  }
  localStorage.removeItem('deliveryFormData');
localStorage.removeItem('delivery_username');
localStorage.removeItem('delivery_password');
localStorage.removeItem('delivery_confirmPassword');

};
function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}


  if (showTerms) {
    return (
      <div>
      <div  className='form-container1'>
        <h1 style={{ textAlign: "center", color: "red", textDecoration: "underline" }}>Terms and Conditions - BloodLink</h1>
        <section>
          <h2 style={{textAlign:"left"}}>1. Overview</h2>
          <p style={{textAlign:"left"}}>
            BloodLink is a web-based application developed to facilitate the connection between blood donors and recipients. By registering on our platform, you acknowledge that you have read, understood, and agreed to abide by the following terms and conditions.
          </p>
        </section>
        
        <section>
          <h2 style={{textAlign:"left"}}>2. Platform Purpose</h2>
          <p style={{textAlign:"left"}}>
            BloodLink acts solely as a digital intermediary. We do not collect, store, or distribute blood. Our platform enables users to find compatible donors or recipients and connect with them through a secure interface.
          </p>
        </section>

        <section>
          <h2 style={{textAlign:"left"}}>3. Biometric Fingerprint Scanning</h2>
          <p style={{textAlign:"left"}}>
            BloodLink integrates a biometric fingerprint scanner designed to non-invasively detect a donor's blood group. This innovative feature enhances the user experience by eliminating the need for traditional blood sampling.
          </p>
        </section>

        <section>
          <h2 style={{textAlign:"left"}}>4. Account Registration & Security</h2>
          <ul>
            <li style={{textAlign:"left"}}>Users must create an account with accurate personal and contact details.</li>
            <li style={{textAlign:"left"}}>You are responsible for maintaining the confidentiality of your account credentials.</li>
          </ul>
        </section>

        <p >
          By using BloodLink, you acknowledge and agree to these Terms and Conditions.
        </p>
</div>
        <button className='back' style={{width:"100px"}} onClick={() => setShowTerms(false)}>
          <IoMdArrowRoundBack style={{ marginRight: '5px' }} /> Back
        </button>
      </div>
    );
  }

  if (showDeliveryPartnerReg) {
    return (
      <div className='deliveryContainer' style={{width:"100%"}}>
        <div>
          <div >
            <h2 >Delivery Partner Registration</h2>
            <p >Join our network of trusted medical delivery partners</p>
          </div>

          <form onSubmit={handleDeliverySubmit}>
            <div >
              <label >Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={deliveryFormData.name}
                onChange={handleDeliveryChange}
               
                placeholder="Enter your full name"
              />
            </div>

            <div >
              <label >Email Address</label>
              <input
                type="email"
                name="gmail"
                required
                value={deliveryFormData.gmail}
                onChange={handleDeliveryChange}
               
                placeholder="Enter your email address"
              />
              <div >
                {emailVerified && <span >✓ Verified</span>}
                {!emailVerified && !showEmailOTP && (
                  <button 
                    type="button" 
                    onClick={sendEmailOTP} 
style={{width: "30%", margin: "0 auto", display: "block" }}
className='cta-button'
                    disabled={!deliveryFormData.gmail}
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {showEmailOTP && !emailVerified && (
                <div >
                  <label >Enter Email OTP</label>
                  <input 
                    type="text" 
                    value={emailOTP} 
                    onChange={(e) => setEmailOTP(e.target.value)} 
                   
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                  <div >
                    <button 
                      type="button" 
                      onClick={verifyEmailOTP} 
                     style={{  width: "30%", margin: "0 auto", display: "block" }}
                      disabled={!emailOTP}
                    >
                      Verify OTP
                    </button>
                    <button 
                      type="button" 
                      onClick={ResendEmailOTP} 
                      style={{  width: "40%", margin: "0 auto", display: "block" }}
                      disabled={!canResendEmailOTP}
                    >
                      {canResendEmailOTP ? 'Resend OTP' : `Resend in ${emailResendTimer}s`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div >
              <label >Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                pattern="[0-9]{10}"
                value={deliveryFormData.phone}
                onChange={handleDeliveryChange}
               
                placeholder="Enter 10-digit phone number"
              />
              <div >
                {phoneVerified && <span>✓ Verified</span>}
                {!phoneVerified && !showPhoneOTP && (
                  <button 
                    type="button" 
                    onClick={sendPhoneOTP} 
                   style={{  width: "30%", margin: "0 auto", display: "block" }}
                    disabled={!deliveryFormData.phone}
                    className='btn'
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {showPhoneOTP && !phoneVerified && (
                <div>
                  <label >Enter Phone OTP</label>
                  <input 
                    type="text" 
                    value={phoneOTP} 
                    onChange={(e) => setPhoneOTP(e.target.value)} 
                   
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                  <div >
                    <button 
                      type="button" 
                      onClick={verifyPhoneOTP} 
                     style={{ width: "30%", margin: "0 auto", display: "block" }}
                      disabled={!phoneOTP}
                      className='btn'
                    >
                      Verify OTP
                    </button>
                    <button 
                      type="button" 
                      onClick={ResendPhoneOTP}
                     style={{width: "40%", margin: "0 auto", display: "block" }}
                      disabled={!canResendPhoneOTP}
                    >
                      {canResendPhoneOTP ? 'Resend OTP' : `Resend in ${phoneResendTimer}s`}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div >
              <label >Medical College Name</label>
              <input
                type="text"
                name="college"
                required
                value={deliveryFormData.college}
                onChange={handleDeliveryChange}
               
                placeholder="Enter your medical college name"
              />
            </div>
 <input placeholder="Username" className='username' value={dusername} onChange={(e) => {
  dsetUsername(e.target.value);
  localStorage.setItem('delivery_username', e.target.value);
}} required />

            <div >
              <h3 >College ID Verification</h3>
              
              <div  className='fileLabel' style={{display: "flex",justifyContent: "center",alignItems: "center",gap:"1em"}} >
                <label>College ID Card (Front)</label>
                <div>
                  <input
                    type="file"
                    name="idFront"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                  
                    id="idFront"
                  />
                  <label htmlFor="idFront"  >
                    {deliveryFormData.idFront ? deliveryFormData.idFront.name : "Choose file..."}
                  </label>
                </div>
              </div>

              <div className='fileLabel' style={{display: "flex",justifyContent: "center",alignItems: "center",gap:"1em"}}>
                <label  >College ID Card (Back)</label>
                <div >
                  <input
                    type="file"
                    name="idBack"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                  
                    id="idBack"
                  />

                  <label htmlFor="idBack" >
                    {deliveryFormData.idBack ? deliveryFormData.idBack.name : "Choose file..."}
                  </label>
                </div>
              </div>
            </div>
             <input type="password" placeholder="Password"   value={dpassword} onChange={handlePasswordChange} className='password-input' required /> 
        <input type="password" placeholder="Confirm Password"  style={{margin:"10px auto"}} value={dconfirmPassword} onChange={handleConfirmPasswordChange} required /> 
        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}

            <button type="submit" className='submitButton'>
              Register as Delivery Partner
            </button>
          </form>

         <div >
            <p style={{color:'black',alignContent:"center"}}>
              Already have an account?{" "}
              <Link 
                type="button"
                onClick={() => setShowDeliveryPartnerReg(false)}
                className='linkButton'
              >
                Login
              </Link>
            </p>
          </div>
         
        </div>
      </div>
    );
  }

  return (
    <div >
      <button className="back" onClick={() => navigate("/")} style={{width:"8%"}}>
              <IoMdArrowRoundBack /> Back
            </button>
      {/* LOGIN FORM */}
      <div className={`form-container1 ${action === '' ? '' : 'form-hidden'}`} style={{ width:"40%"}}>
        <form onSubmit={validateLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{margin:"0 auto"}} >
            {userType ? `Login as a ${userType}` : 'Login as a User'}
          </h1>

          <div >
            <label >Select User Type:</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px',margin:"10px auto" }}>
              <label  className='cta-button' style={{textAlign:"center"}}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="Donor & Receiptent" 
                  onChange={handleUserTypeChange} 
                 
                />
                Donor and Recipient
              </label>
              <label  className='cta-button'style={{textAlign:"center"}}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="Delivery Partner" 
                  onChange={handleUserTypeChange} 
          
                />
                Delivery Partner
              </label>
            </div>
          </div>

          <div className="inputRow">
          <label>Username:</label>
          <input
            type="text"
           
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
        
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input type="checkbox"  /> Remember me
          </label>
           <a
    href={userType === "DeliveryPartner" ? "/ForgotPassword2" : "/ForgotPassword"}
     style={{marginLeft: "auto",marginRight: 0,textAlign: "right"}}
  >
    Forgot password?
  </a>
        </div>

        <button type="submit" className='submitButton' >Login</button>
          <div className='registerLink'>
            <p>
              Don't have an account?{" "}
              <Link 
                type="button"
                onClick={registerLink}
               className='linkButton'
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* REGISTER FORM */}
      <div className={`form-container1 ${action === 'active' ? '' : 'form-hidden'}`} style={{width:"40%"}}>
        <form onSubmit={validateRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1  style={{ display: "block", margin: "0 auto" }}>Register as a User</h1>

         <input type="text" placeholder="Full Name"   value={name}onChange={(e) =>{  setName(e.target.value); localStorage.setItem('register_name', e.target.value);}} required />
        <input type='text' placeholder="Email"  value={email}onChange={(e) => {
  setEmail(e.target.value);
  setEmailVerified(false);
  localStorage.setItem('register_email', e.target.value);
}} required disabled={emailVerified} />
        {emailVerified ? <p style={{ color: "green" }}>✓ Email Verified</p> : (
          <>
            <button type="button" className='cta-button' style={{  width: "30%", margin: "10px auto", display: "block" }}  onClick={sendEmailOTP}>Send Email OTP</button>
            {showEmailOTP && (
              <div className="verificationOtpPanel">
                <label className="verificationOtpLabel" htmlFor="register-email-otp">Verification code</label>
                <input
                  id="register-email-otp"
                  className="verificationOtpInput"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  value={emailOTP}
                  onChange={e => setEmailOTP(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <div className="verificationOtpActions">
                  <button type="button" className="verificationVerifyButton" onClick={verifyEmailOTP} disabled={emailOTP.length !== 6}>Verify email</button>
                  <button type="button" className="verificationResendButton" onClick={ResendEmailOTP} disabled={!canResendEmailOTP}>
                  {canResendEmailOTP ? 'Resend OTP' : `Resend in ${emailResendTimer}s`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <input type="tel" placeholder="Phone Number"  value={phone} onChange={(e) => {
  setPhone(e.target.value);
  setPhoneVerified(false);
  localStorage.setItem('register_phone', e.target.value);
}}
 required disabled={phoneVerified} />
        {phoneVerified ? <p style={{ color: "green" }}>✓ Phone Verified</p> : (
          <>
            <button type="button" className='cta-button'  style={{width: "30%", margin: "10px auto", display: "block" }} onClick={sendPhoneOTP}>Send Phone OTP</button>
            {showPhoneOTP && (
              <div className="verificationOtpPanel">
                <label className="verificationOtpLabel" htmlFor="register-phone-otp">Verification code</label>
                <input
                  id="register-phone-otp"
                  className="verificationOtpInput"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  value={phoneOTP}
                  onChange={e => setPhoneOTP(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <div className="verificationOtpActions">
                  <button type="button" className="verificationVerifyButton" onClick={verifyPhoneOTP} disabled={phoneOTP.length !== 6}>Verify number</button>
                  <button type="button" className="verificationResendButton" onClick={ResendPhoneOTP} disabled={!canResendPhoneOTP}>
                  {canResendPhoneOTP ? 'Resend OTP' : `Resend in ${phoneResendTimer}s`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <input type='text' placeholder="Username"   value={username} onChange={(e) => {
  setUsername(e.target.value);
  localStorage.setItem('register_username', e.target.value);
}} required />
        <input type="password" placeholder="Password"   value={password} onChange={(e) => {
  setPassword(e.target.value);
  handlePasswordChange(e); // if needed
  localStorage.setItem('register_password', e.target.value);
}} required />
        <input type="password" placeholder="Confirm Password"   value={confirmPassword} onChange={(e) => {
  setConfirmPassword(e.target.value);
  handleConfirmPasswordChange(e); // if needed
  localStorage.setItem('register_confirmPassword', e.target.value);
}} required />
        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}

          <div >
            <label>
              <input 
                type="checkbox" 
                required 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
                
              />
              <div style={{margin: "auto 10px"}}>
              I agree to the{" "}
              <Link 
                type="button"
                onClick={() => setShowTerms(true)} 
                className='linkButton'
              >
                Terms and Conditions
              </Link>
              </div>
            </label>
          </div>

          <button type="submit" className=' submitButton'>Register</button>

          <div >
            <p>
              Already have an account?{" "}
              <Link 
                type="button"
                onClick={loginLink}
                className='linkButton'
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginRegister;