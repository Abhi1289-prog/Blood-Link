import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './context/Usercontext';
import "./BloodDonationForm.css"; // Assuming your custom styles live here
import { useMessage } from './context/MessageContext';


const DonorEligibilityForm = () => {
  const { userData } = useUser();
  const { showMessage } = useMessage();
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      age: "",
      gender: "",
      mobile: "",
      email: "",
      address: "",
    },
    healthAssessment: {
      recentDonation: null,
      illnesses: "",
      onMedication: null,
      weightAbove50Kg: null,
      feelWell: null,
      recentMeal: null,
      goodSleep: null,
      previouslyRefused: null,
      alcoholConsumption: null,
      smoking: null,
    },
    consent: {
      hasConsented: false,
    },
    insuranceInfo: {
      provider: "",
      policyNumber: "",
    },
    slotBooking: {
      dateTime: "",
    },
  });
  
  const isFormComplete = (data) => {
  // Personal Info required fields
  const personal = data.personalInfo;
  if (!personal.fullName || !personal.age || !personal.gender || !personal.mobile || !personal.email || !personal.address)
    return false;

  const health = data.healthAssessment;
  for (let key in health) {
    if (health[key] === null || health[key] === "") return false;
  }

  if (!data.consent.hasConsented) return false;

  return true;
};
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
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

  setFormData((prev) => ({
    ...prev,
    personalInfo: {
      ...prev.personalInfo,
      fullName: name || "",
      age: age || "",
      gender:gender || "",
      mobile:phone || "",
      address:address || "",
      email:email || ""
    }
  }));
}, []);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormComplete(formData)) {
    showMessage("Please fill in all required fields.", 'error');
    return;
  }

  const iseligibility = localStorage.getItem('iseligibility');
  if (!iseligibility) {
    showMessage("You're not eligible to donate blood. Donate after 3 months.");
    return;
  }

  const payload = {
    current_illnesses: formData.healthAssessment.illnesses,
    checkmedication: formData.healthAssessment.onMedication,
    checkweight: formData.healthAssessment.weightAbove50Kg,
    checkfeel_well_today: formData.healthAssessment.feelWell,
    checkeat_in_last_4_hours: formData.healthAssessment.recentMeal,
    checksleep: formData.healthAssessment.goodSleep,
    checknot_to_donate: formData.healthAssessment.previouslyRefused,
    checkalcohol_within_the_last24hours: formData.healthAssessment.alcoholConsumption,
    checksmoked_within_lasthour: formData.healthAssessment.smoking,
    checkconsent: formData.consent.hasConsented,
    insurance_provider: formData.insuranceInfo.provider,
    policy_number: formData.insuranceInfo.policyNumber,
  };

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/api/form/BloodDonationForm',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      showMessage("Thank you!", 'success');
      navigate('/donor-confirmation');
    } else {
      showMessage(response.data.message || 'Something went wrong', 'error');
    }

  } catch (error) {
    showMessage('Error submitting form: ' + (error.response?.data?.message || error.message), 'error');
  }
};



  return (
    <div>
    <div className="form-container2">
      <title>🩸 BloodLink</title>

      <h2 className="form-title">Donor Eligibility Form</h2>
      <form onSubmit={handleSubmit} className="donor-form">

        {/* Personal Information */}
        <fieldset className="form-section" style={{width:"98%"}}>
          <legend>Personal Information</legend>
          <input className="form-input" type="text" placeholder="Full Name" value={formData.personalInfo.fullName} onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)} />
          <input className="form-input" type="number" placeholder="Age" value={formData.personalInfo.age} onChange={(e) => handleChange("personalInfo", "age", e.target.value)} />
          <label className="form-label">Gender:</label>
<div className="form-radio-group">
  <label>
    <input
      type="radio"
      name="gender"
      value="Male"
      checked={formData.personalInfo.gender === "Male"}
      onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
    />
      Male
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="Female"
      checked={formData.personalInfo.gender === "Female"}
      onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
    />
       Female
  </label>
  <label>
    <input
      type="radio"
      name="gender"
      value="Other"
      checked={formData.personalInfo.gender === "Other"}
      onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
    />
      Others
  </label>
</div>

          <input className="form-input" type="tel" placeholder="Mobile Number" value={formData.personalInfo.mobile} onChange={(e) => handleChange("personalInfo", "mobile", e.target.value)} />
          <input className="form-input" type="email" placeholder="Email" value={formData.personalInfo.email} onChange={(e) => handleChange("personalInfo", "email", e.target.value)} />
          <textarea className="form-input" placeholder="Address" value={formData.personalInfo.address} onChange={(e) => handleChange("personalInfo", "address", e.target.value)} />
        </fieldset>

        {/* Health Assessment */}
        <fieldset className="form-section" style={{width:"98%"}}>
          <legend>Health Assessment</legend>

          <label className="form-label">Have you donated blood in the last 3 months?</label>
          <div className="form-radio-group">
            <label><input type="radio" name="recentDonation" value="true" checked={formData.healthAssessment.recentDonation === false} onChange={() => handleChange("healthAssessment", "recentDonation", true)}/> Yes</label>
            <label><input type="radio" name="recentDonation" value="false" checked={formData.healthAssessment.recentDonation === true} onChange={() => handleChange("healthAssessment", "recentDonation", false)} /> No</label>
          </div>

          <label className="form-label">Do you have any current illnesses?</label>
          <textarea className="form-input" value={formData.healthAssessment.illnesses} onChange={(e) => handleChange("healthAssessment", "illnesses", e.target.value)} />

          <label className="form-label">Are you currently on any medication?</label>
          <div className="form-radio-group">
            <label><input type="radio" name="onMedication" value="true" checked={formData.healthAssessment.onMedication === true} onChange={() => handleChange("healthAssessment", "onMedication", true)} /> Yes</label>
            <label><input type="radio" name="onMedication" value="false" checked={formData.healthAssessment.onMedication === false} onChange={() => handleChange("healthAssessment", "onMedication", false)} /> No</label>
          </div>

          <label className="form-label">Is your weight above 50 kg?</label>
          <div className="form-radio-group">
            <label><input type="radio" name="weightAbove50Kg" value="true" checked={formData.healthAssessment.weightAbove50Kg === true} onChange={() => handleChange("healthAssessment", "weightAbove50Kg", true)} /> Yes</label>
            <label><input type="radio" name="weightAbove50Kg" value="false" checked={formData.healthAssessment.weightAbove50Kg === false} onChange={() => handleChange("healthAssessment", "weightAbove50Kg", false)} /> No</label>
          </div>

          <div className="flex items-center justify-between">
            <label>Do you feel well today?</label>
            <div className="form-radio-group">
              <label><input type="radio" name="feelWell" checked={formData.healthAssessment.feelWell === true} onChange={() => handleChange("healthAssessment", "feelWell", true)} /> Yes</label>
<label><input type="radio" name="feelWell" checked={formData.healthAssessment.feelWell === false} onChange={() => handleChange("healthAssessment", "feelWell", false)} /> No</label>

            </div>
          </div>

          <div className="flex items-center justify-between" style={{width:"98%"}}>
            <label>Did you have something to eat in the last 4 hours?</label>
            <div className="form-radio-group">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.recentMeal === true}
                  onChange={() => handleCheckboxChange('healthAssessment', 'recentMeal', true)}
                  className="mr-1" 
                /> 
                Yes
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.recentMeal === false}
                  onChange={() => handleCheckboxChange('healthAssessment', 'recentMeal', false)}
                  className="mr-1" 
                /> 
                No
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label>Did you sleep well last night?</label>
            <div className="form-radio-group">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.goodSleep === true}
                  onChange={() => handleCheckboxChange('healthAssessment', 'goodSleep', true)}
                  className="mr-1" 
                /> 
                Yes
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.goodSleep === false}
                  onChange={() => handleCheckboxChange('healthAssessment', 'goodSleep', false)}
                  className="mr-1" 
                /> 
                No
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label>Have you been refused as a blood donor, or told not to donate?</label>
            <div className="form-radio-group">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.previouslyRefused === true}
                  onChange={() => handleCheckboxChange('healthAssessment', 'previouslyRefused', true)}
                  className="mr-1" 
                /> 
                Yes
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.previouslyRefused === false}
                  onChange={() => handleCheckboxChange('healthAssessment', 'previouslyRefused', false)}
                  className="mr-1" 
                /> 
                No
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label>Have you consumed alcohol within the last 24 hours?</label>
            <div className="form-radio-group">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.alcoholConsumption === true}
                  onChange={()=> handleCheckboxChange('healthAssessment', 'alcoholConsumption', true)}
                  className="mr-1" 
                /> 
                Yes
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.alcoholConsumption === false}
                  onChange={() => handleCheckboxChange('healthAssessment', 'alcoholConsumption', false)}
                  className="mr-1" 
                /> 
                No
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label>Have you smoked within the last hour before donation?</label>
            <div className="form-radio-group">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.smoking === true}
                  onChange={() => handleCheckboxChange('healthAssessment', 'smoking', true)}
                  className="mr-1" 
                /> 
                Yes
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.healthAssessment.smoking === false}
                  onChange={() => handleCheckboxChange('healthAssessment', 'smoking', false)}
                  className="mr-1" 
                /> 
                No
              </label>
            </div>
          </div>
        </fieldset>

        {/* Consent */}
        <fieldset className="form-section" style={{width:"98%"}}>
          <legend>Consent</legend>
          <label>
            <input type="checkbox" checked={formData.consent.hasConsented} onChange={(e) => handleChange("consent", "hasConsented", e.target.checked)} /> I consent to donate blood and agree to the terms and conditions.
          </label>
        </fieldset>

        {/* Insurance Info */}
        <fieldset className="form-section" style={{width:"98%"}}>
          <legend>Insurance Information (Optional)</legend>
          <input className="form-input" type="text" placeholder="Insurance Provider" value={formData.insuranceInfo.provider} onChange={(e) => handleChange("insuranceInfo", "provider", e.target.value)} />
          <input className="form-input" type="text" placeholder="Policy Number" value={formData.insuranceInfo.policyNumber} onChange={(e) => handleChange("insuranceInfo", "policyNumber", e.target.value)} />
        </fieldset>

        <button type="submit" className="form-submit-btn">Submit</button>
      </form>
      </div>
      <button className="back" onClick={() => navigate(-1)} style={{width:"8%"}}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
};

export default DonorEligibilityForm;