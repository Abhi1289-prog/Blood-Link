import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import './PreBloodGroupForm.css';
import axios from "axios";
import { useUser } from './context/Usercontext';
import { useMessage } from './context/MessageContext';

const PreBloodGroupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    currentAddress: '',
    workAddress: '',
    age: '',
    gender: '',
    bloodGroup: ''
  });
  const { showMessage } = useMessage();
  const [isEmployee, setIsEmployee] = useState(false);
  const navigate = useNavigate();


  const { setUserData } = useUser(); 

  useEffect(() => {
  const name = localStorage.getItem('name') || 'Guest User';
  const phone = localStorage.getItem('phone') || 'N/A';
  const email = localStorage.getItem('email') || 'N/A';
  setUserData({ name, phone, email });
    setFormData(prev => ({
    ...prev,
    name,
    phone,
    email,
  }));
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setIsEmployee(prev => !prev);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const { currentAddress, workAddress, age, gender, bloodGroup } = formData;

    if (!currentAddress || !age || !gender || !bloodGroup || (isEmployee && !workAddress)) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }
    try {
      await axios.post(
  'http://localhost:5000/api/persondetail/PreBloodGroupForm',
  {
    address: currentAddress,
    officeaddress: isEmployee ? workAddress : '',
    age: parseInt(age),
    gender,
    bloodgroup: bloodGroup
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
);
      showMessage('Personal details submitted successfully.', 'success');

        const profileResponse = await axios.post(
      "http://localhost:5000/api/persondetail/profile",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = profileResponse.data.data;
    const {
      address,
      age: profileAge,
      gender: profileGender,
      bloodgroup,
      officeaddress,
    } = data;
    localStorage.setItem('address',address);
    localStorage.setItem('age',profileAge);
    localStorage.setItem('gender',profileGender);
    localStorage.setItem('bloodgroup',bloodgroup);
    localStorage.setItem('officeaddress',officeaddress);
    setUserData({
      address,
      age: profileAge,
      gender: profileGender,
      bloodgroup,
      officeaddress,
    });
    navigate('/donor-and-receiptent');
    } catch (error) {
      console.error('Submission failed:', error);
      const validationErrors = error.response?.data?.errors
        ?.map(({ path, param, msg }) => `${path || param}: ${msg}`)
        .join(', ');
      showMessage(
        validationErrors || error.response?.data?.message || 'Failed to submit details.',
        'error'
      );
    }
  };

  return (
    <div>
    <div className="container5">
   <h2 className="header" style={{ color: "red", margin: "0 auto", textAlign: "center",width:"70%" }}>
  User Information Form
</h2>


      <div style={{ marginBottom: '20px', color: "black" }}>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Email:</strong> {formData.email}</p>
      </div>

      <form className="form1" onSubmit={handleNext}>
        <textarea
          name="currentAddress"
          placeholder="Residential Address"
          className="input1"
          value={formData.currentAddress}
          onChange={handleChange}
          required
        />

        <label className="checkbox-label" style={{ color: 'black' }}>
          <input
            type="checkbox"
            checked={isEmployee}
            onChange={handleCheckboxChange}
          />{' '}
          Employee
        </label>

        {isEmployee && (
          <textarea
            name="workAddress"
            placeholder="Workplace Address"
            className="input1"
            value={formData.workAddress}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="number"
          name="age"
          placeholder="Age"
          className="input1"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          className="select1"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="bloodGroup"
          className="select1"
          value={formData.bloodGroup}
          onChange={handleChange}
          
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px',width:"40%", margin: "0 auto", textAlign: "center"}}>
          <button
            type="submit"
            className="cta-button"
            style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' , margin: "0 auto"}}
          >
            Next
          </button>
        </div>
      </form>

     
    </div>
     <button className='back' onClick={() => navigate(-1)} style={{ width: "8%" }}>
        <IoMdArrowRoundBack /> Back
      </button>
    </div>
  );
};

export default PreBloodGroupForm;
