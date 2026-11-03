const PersonalDetails = require('../models/persondetail');
const User = require('../models/user');
const Form = require('../models/form');
const Slot = require('../models/slot');
const geocodeLocation = require('../utils/geocode');

exports.bookslot = async (req, res) => {
  try {
    const { date, time, address } = req.body;
    const user_id = req.user.id;

    // 1. Check user exists
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Check if form exists and eligibility
    const form = await Form.findOne({ user: user_id });
    if (!form || !form.iseligible) {
      return res.status(400).json({ message: "Please complete the form first" });
    }

    // 3. Geocode address
    const coords = await geocodeLocation(address);

    // 4. Time validation and conversion to Date
    if (!time || typeof time !== 'string' || !time.includes(':')) {
      return res.status(400).json({ message: 'Invalid time format' });
    }

    const [hh, mm] = time.split(':');
    const hour = parseInt(hh, 10);
    const minute = parseInt(mm, 10);

    if (isNaN(hour) || isNaN(minute)) {
      return res.status(400).json({ message: 'Invalid time value' });
    }

    if (!((hour >= 9 && hour <= 12) || (hour >= 14 && hour <= 17))) {
      return res.status(400).json({
        message: "Select a time between 09:00–12:00 or 14:00–17:00 (Best time to donate)"
      });
    }

    // Create a Date object for the slot time using the provided `date`.
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date value' });
    }

    const timeObj = new Date(dateObj);
    timeObj.setHours(hour, minute, 0, 0);

    // 5. Save the slot
    const new_slot = new Slot({
      user: user_id,
      date,
      time: timeObj,
      address,
      location: coords
        ? {
            type: 'Point',
            coordinates: [coords.longitude, coords.latitude]
          }
        : undefined
    });

    await new_slot.save();

    return res.status(201).json({
      message: "Slot booked successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

