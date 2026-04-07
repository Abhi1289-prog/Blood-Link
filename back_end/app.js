const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db'); // This now auto-connects when the module loads

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/persondetail', require('./routes/persondetail'));
app.use('/api/form', require('./routes/blooddonationform'));
app.use('/api/bookslot', require('./routes/slot'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/history', require('./routes/history'));
app.use('/api/reciptent', require('./routes/requestform'));
app.use('/api/model', require('./routes/predict'));
// app.use('/api/partner', require('./routes/partner'));

// 404 and error handling
const { handelNotFound } = require('./utils/helper');
const errorHandler = require('./middelwares/errorhandel');
app.use(handelNotFound);
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

