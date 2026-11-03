import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translateWholePage = async (targetLang) => {
    const elements = document.querySelectorAll('h1, h2, h3, p, span, button, label, a, li, td, th');
    for (const element of elements) {
      const text = element.innerText.trim();
      if (text.length === 0) continue;

      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        const translated = data.responseData.translatedText;
        if (translated) {
          element.innerText = translated;
        }
      } catch (error) {
        console.error('Translation failed for:', text);
      }
    }
  };

  useEffect(() => {
    if (language !== 'en') {
      translateWholePage(language);
    }
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translateWholePage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
