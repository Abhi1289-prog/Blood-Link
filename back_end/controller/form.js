const personalDetails = require('../models/persondetail');
const User = require('../models/user');
const Form = require('../models/form');
const generateFormPDF = require('../utils/generatePDF');
const { getGridFSBucket } = require('../utils/gridfs');

exports.forminfo = async (req, res) => {
  try {
    const {
      current_illnesses,
      checkmedication,
      checkweight,
      checkfeel_well_today,
      checkeat_in_last_4_hours,
      checksleep,
      checknot_to_donate,
      checkalcohol_within_the_last24hours,
      checksmoked_within_lasthour,
      checkconsent,
      insurance_provider,
      policy_number
    } = req.body;

    const user_id = req.user.id;

    // ✔ Check user exists
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✔ Check personal details exist
    const person = await personalDetails.findOne({ user: user_id });
    if (!person) return res.status(404).json({ message: "Personal details not found" });

    // -----------------------------------------
    // ✔ Eligibility Check
    // -----------------------------------------
    if (person.iseligible) {
      if (current_illnesses !== 'NA')
        return res.status(400).json({ message: "You cannot donate while having any illness." });

      if (checkmedication)
        return res.status(400).json({ message: "You cannot donate while on medication." });

      if (!checkweight)
        return res.status(400).json({ message: "Minimum weight of 50 kg required." });

      if (!checkfeel_well_today)
        return res.status(400).json({ message: "You must feel well today." });

      if (!checkeat_in_last_4_hours)
        return res.status(400).json({ message: "Please eat at least 4 hours before donating." });

      if (!checksleep)
        return res.status(400).json({ message: "You must have slept well." });

      if (checknot_to_donate)
        return res.status(400).json({ message: "You selected NOT to donate." });

      if (checkalcohol_within_the_last24hours)
        return res.status(400).json({ message: "No alcohol allowed within the last 24 hours." });

      if (checksmoked_within_lasthour)
        return res.status(400).json({ message: "No smoking allowed within last hour." });

      if (!checkconsent)
        return res.status(400).json({ message: "Consent is required." });
    }

    // -----------------------------------------
    // Build form data (don't insert yet) and generate PDF
    // We'll upload the PDF first, then upsert the form with the PDF _id
    // -----------------------------------------
    const formData = {
      user: user_id,
      current_illnesses,
      checkmedication,
      checkweight,
      checkfeel_well_today,
      checkeat_in_last_4_hours,
      checksleep,
      checknot_to_donate,
      checkalcohol_within_the_last24hours,
      checksmoked_within_lasthour,
      checkconsent,
      insurance_provider,
      policy_number,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    const pdfBuffer = await generateFormPDF(formData, user, person);

    // -----------------------------------------
    // Upload PDF to GridFS, then upsert the Form with pdfFileId
    // -----------------------------------------
    const bucket = getGridFSBucket();
    const filename = `form_${user_id}_${Date.now()}.pdf`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: "application/pdf"
    });

    uploadStream.on("error", (err) => {
      console.error("PDF upload error:", err);
      return res.status(500).json({ message: "PDF upload failed" });
    });

    uploadStream.on("finish", async () => {
      try {
        const files = await bucket.find({ filename }).toArray();
        if (files.length === 0) {
          console.error("Uploaded file not found in GridFS");
          return res.status(500).json({ message: "Uploaded file not found" });
        }

        const fileId = files[0]._id;

        try {
          await Form.findOneAndUpdate(
            { user: user_id },
            { ...formData, pdfFileId: fileId },
            { upsert: true, new: true }
          );
        } catch (err) {
          // Handle rare race where two upserts try to insert simultaneously
          if (err && err.code === 11000) {
            await Form.findOneAndUpdate({ user: user_id }, { pdfFileId: fileId }, { new: true });
          } else {
            throw err;
          }
        }

        return res.status(201).json({ message: "Form submitted + PDF saved successfully" });
      } catch (err) {
        console.error("Error saving form with PDF ID:", err);
        return res.status(500).json({ message: "Error saving form" });
      }
    });

    // Write buffer to stream
    uploadStream.end(pdfBuffer);

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
