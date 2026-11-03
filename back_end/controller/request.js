const Request = require('../models/request');
const PersonalDetails = require('../models/persondetail');
const User = require('../models/user');
const geocodeAddress = require('../utils/geocode');
const crypto = require('crypto');
const RequestToken = require('../models/requestToken');
const LiveLocation = require('../models/livelocation');
const { send_mail } = require('../utils/mail');

const BASE_ACCEPT_URL = process.env.BASE_ACCEPT_URL || 'http://localhost:3000/accept-request';
const BASE_TRACK_URL = process.env.BASE_TRACK_URL || 'http://localhost:3000/track-donor';


// ================= BLOOD COMPATIBILITY =================
const getCompatibleBloodGroups = (bloodType) => {
  switch (bloodType?.toUpperCase()) {
    case 'A+': return ['A+', 'A-', 'O+', 'O-'];
    case 'A-': return ['A-', 'O-'];
    case 'B+': return ['B+', 'B-', 'O+', 'O-'];
    case 'B-': return ['B-', 'O-'];
    case 'AB+': return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    case 'AB-': return ['AB-', 'A-', 'B-', 'O-'];
    case 'O+': return ['O+', 'O-'];
    case 'O-': return ['O-'];
    default: return [bloodType?.toUpperCase()];
  }
};


// ================= BLOOD REQUEST =================
exports.bloodrequest = async (req, res) => {
  try {
    const {
      patient_name,
      blood_type,
      unit_needed,
      hospital_name,
      hospital_address,
      date,
      contact_name
    } = req.body;

    if (!blood_type || !hospital_address) {
      return res.status(400).json({ message: "Blood type and hospital address required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const requestDetails = await Request.create({
      user: user._id,
      patient_name,
      blood_type: blood_type.toUpperCase(),
      unit_needed,
      hospital_name,
      hospital_address,
      date,
      contact_name,
      status: 'pending'
    });

    const token = crypto.randomBytes(16).toString('hex');

    await RequestToken.create({
      token,
      request_id: requestDetails._id,
      status: 'pending'
    });

    const hospitalCoords = await geocodeAddress(hospital_address);
    if (!hospitalCoords || hospitalCoords.latitude === undefined) {
      return res.status(400).json({ message: "Invalid hospital address" });
    }

    const compatibleGroups = getCompatibleBloodGroups(blood_type);

    const donors = await PersonalDetails.find({
      iseligible: true,
      bloodgroup: { $in: compatibleGroups },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [hospitalCoords.longitude, hospitalCoords.latitude]
          },
          $maxDistance: 5000
        }
      }
    }).populate('user', 'name email');

    const emails = donors.map(d => d.user?.email).filter(Boolean);

    const uri = `${BASE_ACCEPT_URL}?token=${token}&request_id=${requestDetails._id}`;

    const emailMessage = `Dear Donor,

We need ${blood_type} blood.

Compatible donors: ${compatibleGroups.join(', ')}

📍 ${hospital_name}, ${hospital_address}
🩸 Units: ${unit_needed}
📅 Date: ${date}
📞 Contact: ${contact_name}

👉 Accept: <a href="${uri}">Save Life</a>

— BloodLink`;

    if (emails.length > 0) {
      await send_mail(emails, "Blood Request", emailMessage);
    }

    return res.status(201).json({
      message: "Request created and emails sent",
      request_id: requestDetails._id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ================= EMERGENCY =================
exports.emergency = async (req, res) => {
  try {
    const userRequest = await Request.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!userRequest) return res.status(404).json({ message: "No request found" });

    const tokenDoc = await RequestToken.findOne({ request_id: userRequest._id });
    if (!tokenDoc || tokenDoc.status !== 'pending') {
      return res.status(400).json({ message: "Already fulfilled" });
    }

    const hospitalCoords = await geocodeAddress(userRequest.hospital_address);
    if (!hospitalCoords || hospitalCoords.latitude === undefined) {
      return res.status(400).json({ message: "Invalid hospital address" });
    }

    const compatibleGroups = getCompatibleBloodGroups(userRequest.blood_type);

    const donors = await PersonalDetails.find({
      iseligible: true,
      bloodgroup: { $in: compatibleGroups },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [hospitalCoords.longitude, hospitalCoords.latitude]
          },
          $maxDistance: 5000
        }
      }
    }).populate('user', 'email');

    const emails = donors.map(d => d.user?.email).filter(Boolean);

    const uri = `${BASE_ACCEPT_URL}?token=${tokenDoc.token}&request_id=${userRequest._id}`;

    const emailMessage = `🚨 Emergency 🚨

Need ${userRequest.blood_type} blood urgently

Compatible donors: ${compatibleGroups.join(', ')}

📍 ${userRequest.hospital_name}, ${userRequest.hospital_address}
📅 ${userRequest.date || 'ASAP'}

👉 Accept: <a href="${uri}">Save Life</a>

— BloodLink`;

    if (emails.length > 0) {
      await send_mail(emails, "Emergency Blood Request", emailMessage);
    }

    return res.status(200).json({ message: "Emergency emails sent" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ================= NEARBY DONORS =================
exports.nearbyDonors = async (req, res) => {
  try {
    const { address, blood_type } = req.body;

    if (!address || !blood_type) {
      return res.status(400).json({ message: "Address & blood type required" });
    }

    const hospitalCoords = await geocodeAddress(address);
    if (!hospitalCoords || hospitalCoords.latitude === undefined) {
      return res.status(400).json({ message: "Invalid address" });
    }

    const compatibleGroups = getCompatibleBloodGroups(blood_type);

    const donors = await PersonalDetails.find({
      iseligible: true,
      bloodgroup: { $in: compatibleGroups },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [hospitalCoords.longitude, hospitalCoords.latitude]
          },
          $maxDistance: 5000
        }
      }
    }).populate('user', 'name email');

    return res.status(200).json({
      message: "Donors fetched",
      data: donors
    });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching donors" });
  }
};


// ================= CHECK AVAILABILITY =================
exports.check_availability = async (req, res) => {
  try {
    const counts = await PersonalDetails.aggregate([
      { $match: { iseligible: true } },
      { $group: { _id: "$bloodgroup", count: { $sum: 1 } } }
    ]);

    const bloodGroups = ["A-", "A+", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const result = {};

    bloodGroups.forEach(group => {
      const found = counts.find(c => c._id === group);
      const key = group.replace('+', '_pos').replace('-', '_neg');
      result[key] = found ? found.count : 0;
    });

    return res.status(200).json({ data: result });

  } catch {
    return res.status(500).json({ message: "Error retrieving availability" });
  }
};


// ================= REQUEST STATUS =================
exports.request_status = async (req, res) => {
  try {
    const { status } = req.body;

    const requestDoc = await Request.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    if (!requestDoc) {
      return res.status(404).json({ message: "No request found" });
    }

    requestDoc.status = status;
    await requestDoc.save();

    return res.status(200).json({ message: "Status updated" });

  } catch {
    return res.status(500).json({ message: "Error updating status" });
  }
};


// ================= ACCEPT REQUEST =================
exports.acceptRequest = async (req, res) => {
  try {
    const { token, request_id } = req.body;

    const tokenDoc = await RequestToken.findOne({ token, request_id });

    if (!tokenDoc || tokenDoc.status !== 'pending') {
      return res.status(400).json({ message: "Invalid token" });
    }

    const requestDoc = await Request.findById(request_id);

    if (!requestDoc || requestDoc.accepted_by) {
      return res.status(400).json({ message: "Already accepted" });
    }

    requestDoc.accepted_by = req.user.id;
    requestDoc.status = 'assigned';
    tokenDoc.status = 'fulfilled';

    await requestDoc.save();
    await tokenDoc.save();

    const recipient = await User.findById(requestDoc.user);

    if (recipient?.email) {
      await send_mail(
        [recipient.email],
        "Donor Accepted",
        `Track donor: ${BASE_TRACK_URL}?request_id=${request_id}`
      );
    }

    return res.status(200).json({ message: "Request accepted" });

  } catch {
    return res.status(500).json({ message: "Error" });
  }
};


// ================= LOCATION =================
exports.updateDonorLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    await LiveLocation.findOneAndUpdate(
      { donor: req.user.id },
      { coordinates: [lng, lat], updatedAt: new Date() },
      { upsert: true }
    );

    return res.status(200).json({ message: "Location updated" });

  } catch {
    return res.status(500).json({ message: "Error" });
  }
};


exports.getDonorLocation = async (req, res) => {
  try {
    const { request_id } = req.body;

    const reqDoc = await Request.findById(request_id).populate('accepted_by');

    const loc = await LiveLocation.findOne({ donor: reqDoc.accepted_by._id });

    return res.status(200).json({
      lat: loc.coordinates[1],
      lng: loc.coordinates[0]
    });

  } catch {
    return res.status(500).json({ message: "Error" });
  }
};