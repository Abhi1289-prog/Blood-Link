const express = require('express');
const  {authenticateToken} = require('../middelwares/auth');
const {bookslot}=require('../controller/slot');
const router = express.Router();
router.post('/BookDonationSlot',authenticateToken,bookslot);
module.exports = router;