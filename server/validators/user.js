const { check } = require("express-validator");

const userSignupValidator = [
  check("firstName").not().isEmpty().withMessage("First Name is required"),
  check("lastName").not().isEmpty().withMessage("Last Name is required"),
  check("email").isEmail().withMessage("valid email address is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 characters or more"),
  check("city").not().isEmpty().withMessage("City is required"),
  check("street").not().isEmpty().withMessage("Street is required"),
  check("identityNumber")
    .isLength({ min: 9, max: 9 })
    .withMessage("Identity Number is must have 9 digits"),
];

const userSigninValidator = [
  check("email").isEmail().withMessage("Email address Must be valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must have 6 characters or more"),
];
const userUpdateValidator = [

  check("city").not().isEmpty().withMessage("City is required"),
  check("street").not().isEmpty().withMessage("Street is required"),
  check("identityNumber")
    .isLength({ min: 9, max: 9 })
    .withMessage("Identity Number is must have 9 digits"),
];

module.exports = {
  userSignupValidator,
  userSigninValidator,
  userUpdateValidator
};
