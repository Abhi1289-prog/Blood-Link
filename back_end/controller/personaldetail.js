const PersonalDetails = require('../models/persondetail');
const user = require('../models/user');
const geocodeLocation = require('../utils/geocode');
exports.details = async (req, res) => {
    try {
      const { address, officeaddress,age,gender ,bloodgroup} = req.body;
      const user_id = req.user.id; // ✅ from token
  
      const existing = await PersonalDetails.findOne({ user: user_id });
      if (existing) {
        return res.status(400).json({ message: 'Personal details already exist for this user' });
      }
      const coords = await geocodeLocation(address);
      const personalDetailData = {
        user: user_id,
        address,
        officeaddress,
        age,
        gender,
        bloodgroup
      };

      // Only add location if geocoding was successful
      if (coords) {
        personalDetailData.location = {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude]
        };
      }

      const personalDetail = new PersonalDetails(personalDetailData);
  
      await personalDetail.save();
      await user.findByIdAndUpdate(user_id, { hasPersonalDetails: true });
      res.status(201).json({ message: 'Personal details saved successfully'});
    } catch (error) {
      res.status(500).json({ message: 'Error saving personal details', error: error.message });
    }
  };
  exports.checkeligible=async(req,res)=>{
   try {
    const user_id = req.user.id;
    const details = await PersonalDetails.findOne({ user: user_id });

    if (!details) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    const check = req.body.check;

    details.iseligible = !!check; 
    await details.save();

    res.status(201).json({
      message: check ? 'You are eligible to donate blood' : 'You are not eligible to donate blood',
       details: { iseligible: details.iseligible }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking eligibility', error: error.message });
  }
  };
  
 exports.profile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const details = await PersonalDetails.findOne({ user: user_id }).populate('user', 'name username phone_number email'); 

    if (!details) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    res.status(200).json({
      message: 'Personal details sent successfully',
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error sending personal details',
      error: error.message,
    });
  }
};
