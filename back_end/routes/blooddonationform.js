const express = require('express');
const { forminfo } = require('../controller/form');
const { authenticateToken } = require('../middelwares/auth');

const router = express.Router();

router.post('/BloodDonationForm', authenticateToken, forminfo);

module.exports = router;
