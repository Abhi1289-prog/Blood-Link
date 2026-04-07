const express = require('express');
const {details, checkeligible, profile}=require('../controller/personaldetail');
const {authenticateToken} = require('../middelwares/auth');
const {validatePersonalDetail,validateinfo}=require('../middelwares/validateuserinfo');
const router = express.Router();
router.post('/PreBloodGroupForm',authenticateToken,validatePersonalDetail,validateinfo,details);
router.post('/check-eligible',authenticateToken,checkeligible);
router.post('/profile',authenticateToken,profile);
module.exports=router;