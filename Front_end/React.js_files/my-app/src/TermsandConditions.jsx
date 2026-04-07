import React from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import {  useNavigate } from 'react-router-dom';
function TermsAndConditions() {
    const navigate = useNavigate();
  return (
    <div style={styles.containerd}>
      <h1 style={{textAlign:"center",color:"red" , textDecoration:"underline"}}>Terms and Conditions - BloodLink</h1>
    

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
        <p style={{textAlign:"left"}}>
          The fingerprint data is processed locally or via secure encrypted transmission and is not stored on our servers beyond the initial session. While this technology is advanced, users must understand that biometric results are for guidance and should be confirmed at a certified lab or hospital.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>4. Account Registration & Security</h2>
        <ul>
          <li style={{textAlign:"left"}}>Users must create an account with accurate personal and contact details.</li>
          <li style={{textAlign:"left"}}>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
          <li style={{textAlign:"left"}}>Unauthorized access or attempted breach of other accounts is strictly prohibited.</li>
        </ul>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>5. Use of Web Services</h2>
        <ul>
          <li style={{textAlign:"left"}}>You agree not to use the website for any illegal, harmful, or unethical activities.</li>
          <li style={{textAlign:"left"}}>You must not attempt to reverse-engineer, hack, disable, or disrupt the platform’s services.</li>
          <li style={{textAlign:"left"}}>Excessive or automated data scraping is prohibited and may lead to termination of access.</li>
        </ul>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>6. Blood Donation and Health Guidelines</h2>
        <p style={{textAlign:"left"}}>
          Donors must be medically eligible to donate blood and must not hide any health conditions that may impact the safety of the donation. BloodLink does not perform any medical examination and is not liable for any consequences resulting from undisclosed health issues.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>7. Data Privacy & Protection</h2>
        <p style={{textAlign:"left"}}>
          We value your privacy. BloodLink follows best practices to ensure your data is protected. Personal information is never shared without consent and is only used for connection purposes on the platform.
        </p>
        <p style={{textAlign:"left"}}>
          Fingerprint scans are not permanently stored. Our systems comply with global data protection standards (including GDPR where applicable).
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>8. Communication and Notifications</h2>
        <p style={{textAlign:"left"}}>
          BloodLink may send important notifications via email, SMS, or in-app messaging related to donation requests, account activity, or platform updates. You may opt out of non-essential messages in your account settings.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>9. Third-Party Services</h2>
        <p style={{textAlign:"left"}}>
          Our application may integrate or link to third-party tools, APIs (e.g., fingerprint scanner), or services. BloodLink is not responsible for the privacy practices or content of such external services.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>10. Termination of Access</h2>
        <p style={{textAlign:"left"}}>
          We reserve the right to suspend or terminate your access to the platform at our discretion for violation of these terms, suspicious activity, or any attempt to misuse the platform.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>11. Disclaimer and Limitation of Liability</h2>
        <p style={{textAlign:"left"}}>
          BloodLink provides its services "as is" and makes no warranties regarding the accuracy, reliability, or medical validity of data displayed, including blood group detection via fingerprint scanning. We are not responsible for health outcomes, medical mismatches, or failed donations.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>12. Governing Law</h2>
        <p style={{textAlign:"left"}} >
          These terms shall be governed by and construed in accordance with the laws of your local jurisdiction. Any disputes arising shall be resolved under the legal framework applicable in your region.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>13. Updates to Terms</h2>
        <p style={{textAlign:"left"}}>
          BloodLink may update these Terms and Conditions periodically. Users will be notified of significant changes. Continued use of the service constitutes agreement with the revised terms.
        </p>
      </section>

     
            <section>
        <h2 style={{textAlign:"left"}}>14. System Availability and Maintenance</h2>
        <p style={{textAlign:"left"}}>
          While we strive to keep the BloodLink web application available at all times, we cannot guarantee continuous uptime. Scheduled maintenance or unexpected technical issues may temporarily interrupt service access. We will make reasonable efforts to notify users in advance of planned downtime.
        </p>
        <p style={{textAlign:"left"}}>
          BloodLink is not responsible for any loss or inconvenience caused by temporary outages or data unavailability.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>15. Accessibility</h2>
        <p style={{textAlign:"left"}}>
          We are committed to making BloodLink accessible to all users, including those with disabilities. If you encounter any accessibility issues or need assistance using our platform, please contact our support team.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>16. Acceptable User Behavior</h2>
        <p style={{textAlign:"left"}}>
          Users are expected to behave ethically and respectfully when using the BloodLink platform. Harassment, discrimination, hate speech, or inappropriate conduct towards other users is strictly prohibited and may result in suspension or termination of your account.
        </p>
      </section>

      <section style={{textAlign:"left"}}>
        <h2 style={{textAlign:"left"}}>17. Intellectual Property Rights</h2>
        <p style={{textAlign:"left"}}>
          All content on the BloodLink web application—including text, graphics, logos, icons, and software—is the property of BloodLink or its licensors and is protected by intellectual property laws. You may not reproduce, copy, or distribute any part of the platform without prior written consent.
        </p >
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>18. Feedback and Suggestions</h2>
        <p style={{textAlign:"left"}}>
          Any feedback, suggestions, or ideas you submit to BloodLink (e.g., for features or improvements) may be used by us without compensation or obligation to you. By submitting such content, you grant us a non-exclusive, worldwide, royalty-free right to use, modify, and incorporate it into our services.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>19. Fraud and Impersonation</h2>
        <p style={{textAlign:"left"}}>
          Creating fake profiles, impersonating another person, or using the platform for fraudulent purposes is a serious violation of these terms. Any such activity will result in immediate account termination and may be reported to legal authorities.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>20. Emergency Use Policy</h2>
        <p style={{textAlign:"left"}}>
          BloodLink is not intended for use in medical emergencies. If you are in a life-threatening situation, please call emergency services or visit a hospital immediately. Our platform facilitates donor-recipient connections but does not operate in real time for critical medical cases.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>21. Inactive Accounts</h2>
        <p style={{textAlign:"left"}}>
          Accounts that remain inactive for an extended period may be deactivated or removed. You will receive a notification via email before any such action is taken. You may reactivate your account by logging in again or contacting support.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>22. Geographic Limitations</h2>
        <p style={{textAlign:"left"}}>
          The availability of BloodLink services may vary based on location due to regional legal or operational constraints. Certain features, such as fingerprint scanning or live donor availability, may not be supported in all regions.
        </p>
      </section>

      <section>
        <h2 style={{textAlign:"left"}}>23. Third-Party Medical Advice</h2>
        <p style={{textAlign:"left"}}>
          BloodLink does not offer medical advice, diagnosis, or treatment. Any health information presented on the platform is general and must not be used as a substitute for consultation with qualified medical professionals.
        </p>
      </section>
       <p style={styles.footer}>
        By using BloodLink, you acknowledge and agree to these Terms and Conditions.
      </p>
      <button className='back-button' onClick={() => navigate("./")}>
              <IoMdArrowRoundBack style={{ marginRight: '5px' }} /> Back
            </button>
    </div>
  );
}

const styles = {
  containerd: {
    maxWidth: '900px',
    margin: 'auto',
    padding: '30px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    color:"black"
  },
  footer: {
    marginTop: '40px',
    fontWeight: 'bold',
    color: '#333',
    textAlign:"center"
  },
};

export default TermsAndConditions;
