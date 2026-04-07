const { check, validationResult } = require("express-validator");

exports.validatePersonalDetail = [
  check("address")
    .trim()
    .notEmpty()
    .withMessage("Address is missing"),

  check("officeaddress")
    .trim()
    .notEmpty()
    .withMessage("Office address is missing"),

  check("age")
    .trim()
    .notEmpty()
    .withMessage("Age is missing")
    .isInt({ min: 18, max: 65 })
    .withMessage("Age must be between 18 and 65"),


  check("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "others"])
    .withMessage("Gender must be male, female or others"),


    check("bloodgroup")
    .trim()
    .notEmpty()
    .withMessage("Blood group is missing")
    .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .withMessage("Invalid blood group"),
];


exports.validateinfo = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(400).json({
    message: "Validation failed",
    errors: errors.array(),
  });
};
