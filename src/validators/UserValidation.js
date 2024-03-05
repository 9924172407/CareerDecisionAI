const { check } = require("express-validator");

const registrationRules = [
  check("name").trim().notEmpty().withMessage("name is required"),
  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid e-mail address"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than 8"),
];

const loginRules = [
  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid e-mail address"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password Length must be 8 "),
];

const forgotPasswordRules = [
  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid e-mail address"),
];

const updatePasswordRules = [
  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid e-mail address"),
  check("token")
    .isLength({ min: 1 })
    .trim()
    .withMessage("token can be specified "),

    check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password Length must be 8 "),
];

const changePasswordRules = [
  check("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("oldPassword Password is Required")
    .isLength({ min: 8 })
    .withMessage("oldPassword Length must be 8"),
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage("newPassword Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password Length must be 8"),
];
const userValidation = {
  registrationRules,
  loginRules,
  forgotPasswordRules,
  updatePasswordRules,
  changePasswordRules,
};

module.exports = userValidation;
