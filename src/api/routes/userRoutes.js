const express = require("express");
const userController = require("../../controllers/UserController");
const catchValidationError = require("../../utils/catchValidationError");
const userValidation = require("../../validators/userValidation");
const router = express.Router();
router
  .route("/signup")
  .post(
    userValidation.registrationRules,
    catchValidationError(userController.register)
  );
router
  .route("/login")
  .post(userValidation.loginRules, catchValidationError(userController.login));
router
  .route("/forgot-password")
  .post(
    userValidation.forgotPasswordRules,
    catchValidationError(userController.sendForgotPasswordToken)
  );
router
  .route("/reset-password")
  .post(
    userValidation.updatePasswordRules,
    catchValidationError(userController.verifyTokenAndUpdatePassword)
  );
router
  .route("/change-password")
  .post(
    userValidation.changePasswordRules,
    catchValidationError(userController.changePassword)
  );
router.route("/logOut").post(catchValidationError(userController.logOutUser));

module.exports = router;
