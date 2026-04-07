const Slot = require("../models/slot");
const User = require("../models/user");

exports.historydetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user_id = req.user.id;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return all slots for the user (most recent first)
    const slots = await Slot.find({ user: user_id ,slot_confirm:true}).sort({ time: -1 });

    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: "History not found!" });
    }

    const data = slots.map(s => ({
      id: s._id,
      address: s.address,
      donated_date: s.completion_time,
    }));

    return res.status(200).json({ data });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch data!",
      error: error.message,
    });
  }
};
