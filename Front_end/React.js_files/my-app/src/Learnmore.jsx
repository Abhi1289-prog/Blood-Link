import React, { useEffect } from 'react';
import './Learnmore.css';
import { useTranslation } from './TranslationContext';

const Learnmore = () => {
  const { currentLanguage, translateWholePage } = useTranslation();

  useEffect(() => {
    if (currentLanguage && currentLanguage !== 'en') {
      translateWholePage(currentLanguage); // ✅ Pass the current language explicitly
    }
  }, [currentLanguage, translateWholePage]);

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='mains'>
      <h1 style={{ color: 'Red' }}>Blood Donation Precautions</h1>

      <div className="containers">
        <h2 className="container-h2">1. Eligibility Check</h2>
        <p className="container-p">
          Age: Ensure you meet the minimum age requirement (usually 16 or 17 years old, depending on local regulations).
        </p>

        <h2 className="container-h2">2. Hydration</h2>
        <p className="container-p">Drink Plenty of Water: Hydrate well before your donation.</p>

        <h2 className="container-h2">3. Nutrition</h2>
        <p className="container-p">Eat a Healthy Meal: Have a balanced meal a few hours before donating.</p>

        <h2 className="container-h2">4. Avoid Alcohol and Caffeine</h2>
        <p className="container-p">Limit Alcohol: Avoid alcohol for at least 24 hours before donating.</p>

        <h2 className="container-h2">5. Medications and Health Conditions</h2>
        <p className="container-p">Consult with a Healthcare Provider: If you are on medication or have a chronic health condition.</p>

        <h2 className="container-h2">6. Rest and Sleep</h2>
        <p className="container-p">Get Adequate Rest: Ensure you have had a good night's sleep before your donation day.</p>

        <h2 className="container-h2">7. Clothing</h2>
        <p className="container-p">Wear Appropriate Clothing: Choose a shirt with sleeves that can be easily rolled up.</p>

        <h2 className="container-h2">8. Inform the Staff</h2>
        <p className="container-p">Communicate Any Concerns: Inform the blood donation staff about any medical conditions.</p>

        <h2 className="container-h2">9. Post-Donation Care</h2>
        <p className="container-p">Plan for Recovery: After donating, take a few minutes to rest and enjoy a snack.</p>

        <button
          onClick={handleBackClick}
          className="cta-button2"
          style={{ width: '20%', alignItems: 'center', backgroundColor: 'red' }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Learnmore;
