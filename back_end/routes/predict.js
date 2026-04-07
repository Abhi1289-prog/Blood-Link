const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { handlePrediction} = require('../controller/predict');
const upload = multer({ dest: 'uploads/' });

router.post('/BloodTypeDetector', upload.single('image'), async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    req.body.image = base64Image;
    fs.unlinkSync(filePath);

    await handlePrediction(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
