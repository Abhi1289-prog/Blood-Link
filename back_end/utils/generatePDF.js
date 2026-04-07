const PDFDocument = require("pdfkit");

function generateFormPDF(form, user, person) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const check = (value) => (value ? "✔ YES" : "✘ NO");

      doc.fontSize(20).text("Blood Donation Eligibility Form", { align: "center" });
      doc.moveDown(2);

      // PERSONAL INFO
      doc.fontSize(14).text("Personal Information");
      doc.moveDown(0.5);

      doc.fontSize(12)
        .text(`Name: ${user.name}`)
        .text(`Age: ${person.age}`)
        .text(`Gender: ${person.gender}`)
        .text(`Phone Number: ${user.phone_number}`)
        .text(`Email: ${user.email}`)
        .text(`Address: ${person.address}`)
        .moveDown(1);

      // HEALTH SECTION
      doc.fontSize(14).text("Health Assessment");
      doc.moveDown(0.5);

      doc.fontSize(12)
        .text(`Donated in last 3 months: ${check(person.iseligible)}`)
        .text(`Any illness: ${form.current_illnesses}`)
        .text(`Medication: ${check(form.checkmedication)}`)
        .text(`Weight above 50kg: ${check(form.checkweight)}`)
        .text(`Feeling well today: ${check(!form.checkfeel_well_today)}`)
        .text(`Ate in last 4 hours: ${check(form.checkeat_in_last_4_hours)}`)
        .text(`Slept well: ${check(form.checksleep)}`)
        .text(`Told not to donate: ${check(form.checknot_to_donate)}`)
        .text(`Alcohol in last 24 hrs: ${check(form.checkalcohol_within_the_last24hours)}`)
        .text(`Smoked in last hour: ${check(form.checksmoked_within_lasthour)}`)
        .moveDown(1);

      // CONSENT
      doc.fontSize(14).text("Consent");
      doc.fontSize(12).text(`Consent Given: ${check(form.checkconsent)}`);
      doc.moveDown(1);

      // INSURANCE
      doc.fontSize(14).text("Insurance Information");
      doc.fontSize(12)
        .text(`Insurance Provider: ${form.insurance_provider}`)
        .text(`Policy Number: ${form.policy_number}`);

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = generateFormPDF;
