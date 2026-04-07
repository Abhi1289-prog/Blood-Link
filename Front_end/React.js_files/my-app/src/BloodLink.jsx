// BloodLink.jsx - Updated with full page translation and loading overlay
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiThMenu } from "react-icons/ti";
import './BloodLink.css';
import { useTranslation } from './TranslationContext';

const LanguageSelector = ({ onClose, onLanguageSelect, currentLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' }
  ];

  return (
    <div className="language-popup">
      <div className="language-modal">
        <h3 className="modal-title">Select Your Language</h3>
        <div className="language-grid">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageSelect(lang.code);
                onClose();
              }}
              className={lang.code === currentLanguage ? 'language-button selected' : 'language-button'}
            >
              <span className="flag-icon">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

const BloodLink = () => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const { currentLanguage, setLanguage, isTranslating } = useTranslation();

  const handleClickOutside = useCallback((event) => {
    if (isOpen && !event.target.closest('.menu-dropdown') && !event.target.closest('.menu-toggle')) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLanguageSelect = async (langCode) => {
    console.log(`Language selected: ${langCode}`);
    await setLanguage(langCode);
  };

  const displayLanguage = currentLanguage ? currentLanguage.toUpperCase() : 'EN';

  return (
    <div className={`bloodlink-container ${isLoaded ? 'fade-in' : ''}`}>
      <div className="blood-background"></div>

      <div className="main1">
        <header className="header" style={{width:"100%"}}>
          <h1 style={{width:"100%"}}> BloodLink: Your Blood Group & Donation Hub</h1>
          <div onClick={toggleMenu} className="menu-toggle">
            <TiThMenu />
          </div>
        </header>

        {isOpen && (
          <div className={`menu-dropdown ${isOpen ? 'show' : ''}`}>
            <ul className="menu-list">
              <li className="menu-item">
                <button onClick={() => setShowLanguagePopup(true)} className="menu-link">
                  🌐 Select Language ({displayLanguage})
                </button>
              </li>
              <li className="menu-item">
                <a href="#about" onClick={() => setIsOpen(false)} className="menu-link">
                  About
                </a>
              </li>
              <li className="menu-item">
                <a href="#contact" onClick={() => setIsOpen(false)} className="menu-link">
                  Contact
                </a>
              </li>
              <li className="menu-item">
                <button onClick={() => navigate('/Learnmore')} className="menu-link">
                  Learn more
                </button>
              </li>
              <li className="menu-item">
                <button className="cta-button" onClick={() => navigate('/LoginRegister')}>
                  Login / Register
                </button>
              </li>
            </ul>
          </div>
        )}

        {showLanguagePopup && (
          <LanguageSelector
            onClose={() => setShowLanguagePopup(false)}
            onLanguageSelect={handleLanguageSelect}
            currentLanguage={currentLanguage}
          />
        )}

        {isTranslating && (
          <div className="translating-overlay">
            <div className="translating-text">Translating...</div>
          </div>
        )}

        <div className="container">
          <section id="home" className="hero">
            <h2 className="section-title">
              Find Your Blood Type: A Resource for Donors and Recipients
            </h2>
            <p className="paragraph-text">
              Welcome to BloodLink! This platform is designed for both blood donors and those in need of blood. By knowing your blood type, you can help save lives or ensure you receive the right blood in emergencies.
            </p>
            <button className="cta-button" style={{ width: "20%" }} onClick={() => navigate('/LoginRegister')}>
              Login / Register
            </button>
          </section>

          <section id="about">
            <h2 className="section-title">About</h2>
            <p className="paragraph-text">
              BloodLink is dedicated to helping people find their blood type and encouraging blood donation. Our mission is to raise awareness about the importance of donating blood and to provide resources for those looking to donate.
            </p>
          </section>

          <section id="contact">
            <h2 className="section-title">Contact</h2>
            <p className="paragraph-text">
              If you have any questions or need assistance, feel free to reach out to us. You can contact us via email at support@bloodlink.com or call us at (123) 456-7890.
            </p>
            <p className="paragraph-text">
              Follow us on our social media channels for updates and news about blood donation drives and events.
            </p>
          </section>
        </div>

        <footer>
          <div className="footer-content" style={{width:"100%"}}>
            <div className="footer-logo">
              <h6>Blood Link</h6>
            </div>
            <div className="footer-links">
              <a href="/PrivacyPolicy">Privacy Policy</a>
              <a href="/TermsandConditions">Terms of Service</a>
              <a href="/FAQ">FAQ</a>
            </div>
            <p>&copy; 2025 BloodLink. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BloodLink;
