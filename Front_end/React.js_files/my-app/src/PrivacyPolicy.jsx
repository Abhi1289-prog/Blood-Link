import React from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import {useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
  <div style={styles.containerr}>
      <h1 style={{textAlign:"center",color:"red" , textDecoration:"underline"}}>Privacy Policy – BloodLink</h1>
       <div >
      <section>
        <h2 style={{textAlign:"left"}}>1. Introduction</h2>
        <p style={{textAlign:"left"}}>
          BloodLink (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our web application and services.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>2. Information We Collect</h2>
        <p style={{textAlign:"left"}}>We may collect the following types of data:</p>
        <ul>
          <li style={{textAlign:"left"}}><strong>Personal Information:</strong> Name, phone number, email, address, and age.</li>
          <li style={{textAlign:"left"}}><strong>Biometric Data:</strong> Fingerprint scan used to detect blood group.</li>
          <li style={{textAlign:"left"}}><strong>Health Data:</strong> Blood type, donation eligibility, and history.</li>
          <li style={{textAlign:"left"}}><strong>Usage Data:</strong> IP address, browser type, pages visited, and session duration.</li>
        </ul>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>3. Use of Information</h2>
        <p style={{textAlign:"left"}}>We use your information to:</p>
        <ul style={{textAlign:"left"}}>
          <li style={{textAlign:"left"}}>Facilitate donor and recipient matching.</li>
          <li style={{textAlign:"left"}}>Provide non-invasive fingerprint blood group detection.</li>
          <li style={{textAlign:"left"}}>Improve our platform’s functionality and security.</li>
          <li style={{textAlign:"left"}}>Send notifications, reminders, or updates about your account or requests.</li>
        </ul>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>4. Biometric Data Handling</h2>
        <p style={{textAlign:"left"}}>
          Fingerprint scans are processed in real time and are not permanently stored. Blood group results are generated without drawing blood. Biometric data is encrypted and handled according to local data protection regulations.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>5. Data Sharing</h2>
        <p style={{textAlign:"left"}}>We do not sell, rent, or share your personal or biometric information with third parties except:</p>
        <ul >
          <li style={{textAlign:"left"}}>With your explicit consent.</li>
          <li style={{textAlign:"left"}}>To comply with legal obligations or court orders.</li>
          <li style={{textAlign:"left"}} >To trusted service providers assisting with platform operations (e.g., fingerprint SDKs).</li>
        </ul>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>6. Data Retention</h2>
        <p style={{textAlign:"left"}}>
          We retain your account and health data for as long as your account is active. Biometric scans are not stored after your session ends. You can request data deletion by contacting our support team.
        </p>
      </section>

      <section style={{textAlign:"left"}}>
        <h2 style={{textAlign:"left"}}>7. Your Rights</h2>
        <p style={{textAlign:"left"}}>You have the right to:</p>
        <ul >
          <li style={{textAlign:"left"}}>Access and update your personal information.</li>
          <li style={{textAlign:"left"}}>Withdraw consent to use your data.</li>
          <li style={{textAlign:"left"}}>Request deletion of your account and data.</li>
        </ul>
      </section>

      <section >
        <h2 style={{textAlign:"left"}}>8. Children’s Privacy</h2>
        <p style={{textAlign:"left"}}>
          BloodLink is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>9. Cookies and Tracking</h2>
        <p style={{textAlign:"left"}}>
          We may use cookies to improve user experience, store preferences, and collect anonymous usage statistics. You can manage cookies through your browser settings.
        </p>
      </section>

      <section >
        <h2 style={{textAlign:"left"}}>10. Security</h2>
        <p>
          We implement technical and organizational measures to protect your data. These include encryption, secure data transmission, and role-based access control.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>11. Changes to This Policy</h2>
        <p style={{textAlign:"left"}}>
          We may update this Privacy Policy occasionally. We’ll notify you of significant changes through email or platform notifications.
        </p>
      </section>

      <section >
        <h2 style={{textAlign:"left"}}>12. Contact Us</h2>
        <p style={{textAlign:"left"}}>
          If you have any questions about this Privacy Policy, please contact us at <strong>privacy@bloodlink.org</strong>.
        </p>
      </section>

      <p style={styles.footer}>
        By using BloodLink, you agree to the terms of this Privacy Policy.
      </p>
    </div>
    <button className='back-button' onClick={() => navigate("/")}>
            <IoMdArrowRoundBack style={{ marginRight: '5px' }} /> Back
          </button>
    </div>
  );
}

const styles = {
  containerr: {
    maxWidth: '900px',
    margin: 'auto',
    padding: '30px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    color:'Black',
    textAlign:'left'
  },
  footer: {
    marginTop: '40px',
    fontWeight: 'bold',
    color: '#333',
    textAlign:"left"
  },
};

export default PrivacyPolicy;
