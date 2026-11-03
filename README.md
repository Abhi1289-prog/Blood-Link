# Blood Link

Blood Link is a blood donation support system built with a Node.js/Express backend and a front-end layer containing static pages and a React-based application. The project connects donors, recipients, and partners while providing user registration, OTP verification, blood request handling, slot booking, donor history, feedback collection, and blood group prediction.

## Project Structure

- `back_end/` — Node.js API server
  - `app.js` — Express application entry point
  - `db.js` — MongoDB connection logic
  - `routes/` — API routes for user, person details, forms, slots, feedback, history, requests, prediction
  - `controller/` — request handlers and business logic
  - `models/` — Mongoose schemas and database models
  - `utils/` — helper utilities for mail, SMS, PDF generation, geocoding, and more
  - `model_final_savedmodel/`, `tfjs_model/` — saved machine learning model assets

- `Front_end/` — client files
  - HTML/CSS pages for donors, recipients, registration, login, etc.
  - `Front_end/my-app/` — React application source code and public files

## Features

- User registration and login with email and SMS OTP verification
- Password reset workflow
- Personal detail storage for donors and recipients
- Blood donation form submission
- Booking donation slots
- Donor history tracking
- Recipient request handling
- Feedback submission
- Blood type prediction using a saved ML model
- Email sending via Gmail OAuth2 and SMS via Fast2SMS

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance or Atlas cluster
- Gmail OAuth2 credentials for email sending
- Fast2SMS API key for SMS

## Setup

### Backend

1. Open a terminal in `back_end/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `back_end/` with the following values:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   CLIENT_ID=<your_gmail_oauth_client_id>
   CLIENT_SECRET=<your_gmail_oauth_client_secret>
   REDIRECT_URI=<your_gmail_oauth_redirect_uri>
   REFRESH_TOKEN=<your_gmail_oauth_refresh_token>
   EMAIL_USER=<your_gmail_address>
   SMS_API_KEY=<your_fast2sms_api_key>
   ```
4. Start the server:
   ```bash
   node app.js
   ```
5. The backend runs on `http://localhost:5000` by default.

### Frontend

The frontend contains both static HTML pages and a React app.

#### Static pages

- Open the HTML files directly in a browser, or serve them from a simple HTTP server if needed.

#### React app

1. Open a terminal in `Front_end/my-app/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. The development server typically opens at `http://localhost:3000`

## API Endpoints

- `POST /api/user/*` — registration, login, email/SMS OTP, password reset
- `POST /api/persondetail` — add or update personal details
- `POST /api/form` — submit blood donation forms
- `POST /api/bookslot` — book donation slots
- `POST /api/feedback` — submit feedback
- `GET /api/history` — view donor history
- `POST /api/reciptent` — create recipient requests
- `POST /api/model` — blood type prediction endpoint

## Notes

- The backend uses CORS with `http://localhost:3000` by default; update `back_end/app.js` if your frontend runs elsewhere.
- Email is sent using Gmail OAuth2 and requires a valid OAuth2 setup.
- SMS is sent using Fast2SMS; ensure your API key is valid and active.

## Contribution

- Add or update routes in `back_end/routes/`
- Add business logic in `back_end/controller/`
- Add new models in `back_end/models/`
- Update the frontend in `Front_end/` and `Front_end/my-app/`

## License

This repository does not currently include a license file.
