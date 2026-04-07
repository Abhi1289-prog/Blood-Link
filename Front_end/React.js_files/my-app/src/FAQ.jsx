import React, { useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: "What is BloodLink?",
    answer:
      "BloodLink is a web-based platform that connects voluntary blood donors with recipients in need of blood in a secure, easy, and reliable way.",
  },
  {
    question: "How does the fingerprint blood group detection work?",
    answer:
      "BloodLink uses a biometric fingerprint scanner to non-invasively detect your blood group. This method does not involve drawing blood and provides a safe, painless user experience.",
  },
  {
    question: "Is my personal and biometric data safe?",
    answer:
      "Yes. All personal and biometric data is securely handled and never stored beyond your session. BloodLink follows industry-standard security and privacy practices.",
  },
  {
    question: "Can I donate blood immediately after signing up?",
    answer:
      "No. You must first complete a basic eligibility verification. You’ll then be connected with a medical facility or organizer to schedule your donation.",
  },
  {
    question: "Does BloodLink guarantee blood availability?",
    answer:
      "No. BloodLink serves as a platform to connect users. We cannot guarantee the availability of donors or blood types at any given time.",
  },
  {
    question: "Is the service free?",
    answer:
      "Yes, BloodLink is completely free for both donors and recipients. There are no charges for using the platform.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes. You can request account deletion from your profile settings. All personal data will be removed according to our privacy policy.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
 const navigate = useNavigate();
  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Frequently Asked Questions (FAQs)</h2>
      {faqs.map((faq, index) => (
        <div key={index} style={styles.faqItem}>
          <div style={styles.question} onClick={() => toggleFAQ(index)}>
            {faq.question}
          </div>
          {activeIndex === index && (
            <div style={styles.answer}>{faq.answer}</div>
          )}
        </div>
      ))}
      <button className='back-button' onClick={() => navigate("/")}>
              <IoMdArrowRoundBack style={{ marginRight: '5px' }} /> Back
            </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  faqItem: {
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
    cursor: 'pointer',
  },
  question: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  answer: {
    marginTop: '8px',
    color: '#444',
  },
};

export default FAQ;
