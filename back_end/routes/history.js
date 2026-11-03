const express = require('express');
const  {authenticateToken} = require('../middelwares/auth');
const {historydetails}=require('../controller/history');
const router = express.Router();
router.post('/DonorHistory',authenticateToken,historydetails);
module.exports = router;