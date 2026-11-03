import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App';
import {TranslationProvider} from "./TranslationContext"

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
<TranslationProvider>
    <React.StrictMode>
        <App />
    </React.StrictMode>
    </TranslationProvider>
  );