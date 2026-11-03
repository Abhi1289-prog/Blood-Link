const express = require('express');
const {authenticateToken} = require('../middelwares/auth');
const {bloodrequest,
     emergency,
      nearbyDonors,
        check_availability,
         request_status,
         acceptRequest,
         updateDonorLocation,
         getDonorLocation, 
        }=require('../controller/request');
const router = express.Router();
router.post('/RequestBlood',authenticateToken,bloodrequest);
router.post('/EmergencyButton',authenticateToken,emergency);
router.post('/FindDonors',authenticateToken,nearbyDonors);
router.post('/BloodStock',check_availability);
router.post('/donor-status',authenticateToken,request_status);
router.post('/Accept',authenticateToken,acceptRequest);
router.post('/update-location',authenticateToken,updateDonorLocation);
router.post('/get-location',authenticateToken,getDonorLocation);
module.exports = router;