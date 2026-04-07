const express=require('express');
const {feedback}=require('../controller/feedback');
const { authenticateToken} = require('../middelwares/auth');
const router=express.Router();
router.post('/DonorFeedback',authenticateToken,feedback);
router.post('/RecipientFeedback',authenticateToken,feedback);
module.exports=router;