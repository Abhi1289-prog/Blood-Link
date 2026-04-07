const {check,validationResult}=require("express-validator");
exports.userValidate = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing!"),

  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is missing!")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is invalid!"),

  check("phone_number")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone Number is missing")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be 10 digits")
    .isNumeric()
     .withMessage("Phone Number must contain only digits"),

  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is missing!"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!")
];

exports.numerValidation=[
    check("number")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone Number is missing")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be 10 digits")
    .isNumeric()
    .withMessage("Phone Number must contain only digits"),
];

exports.signInValidation=[
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is missing!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!")
];

exports.validatePassword=[
    check("newpassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!")
];

exports.validateEmail=[
    check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is missing!")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is invalid!")
]

exports.validate=(req,res,next)=>{
   const error= validationResult(req).array()
   if(error.length){
    return res.status(404).json({error:error[0].msg})
   }
   next();
}