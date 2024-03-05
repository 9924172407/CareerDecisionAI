const jwt = require("jsonwebtoken");
const { passport, jwtConfig } = require("../configs");
const UserService = require("../services/UserService");
const ExpressError = require("../utils/ExpressError");
const Helpers = require("../utils/helpers");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) {
    throw new ExpressError(
      "A user with the specified email is already registered",
      400
    );
  }

  const user = UserService.model({
    name,
    email,
    password,
  });

  UserService.register(user, password, (err, user) => {
    if (err) {
      return next(err);
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiry,
    });

    user._doc.token = token;

    delete user._doc.hash;
    delete user._doc.salt;

    res.apiResponse("User has successfully registered!", user);
  });
};

const login = async (req, res, next) => {
  passport.authenticate("user", (err, user, info) => {
    if (err || !user) {
      const error = new ExpressError(info.message, 401);
      return next(error);
    }

    req.login(user, { session: false }, (error) => {
      if (error) return next(error);

      const payload = { id: user._id };

      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiry,
      });

      user._doc.token = token;

      delete user._doc.hash;
      delete user._doc.salt;

      return res.apiResponse("Logged in user", user);
    });
  })(req, res, next);
};

const sendForgotPasswordToken = async (req, res) => {
  const email = req.body.email;
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new ExpressError("No user found with this ID", 400);
  }

  if (user) {
    let reset_link = Helpers.generatePasswordResetLink(req, user);
    const transporter = Helpers.transporter();
    const mailData = Helpers.sendResetLinkToUserMail(req, reset_link);
    transporter.sendMail(mailData);
    return res.apiResponse("email was successfully sent ", reset_link);
  }
};

const verifyTokenAndUpdatePassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new ExpressError("No user found with this ID", 400);
  }

  if (user && user.resetPasswordToken === req.body.token) {
    user.setPassword(password, (err) => {
      user.save();
      return res.apiResponse("Password updated successfully");
    });
  } else {
    throw new ExpressError("Invalid token ", 400);
  }
};

const changePassword = async (req, res, next) => {
  const { id, oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    throw new ExpressError(
      "The new password must not be same to the old password ",
      400
    );
  }

  const user = await UserService.get(id);

  if (!user) {
    throw new ExpressError("No user found with this ID", 400);
  }

  try {
    await user.changePassword(oldPassword, newPassword);
    await user.save();
    res.apiResponse("Password successfully changed");
  } catch (error) {
    if (error.name === "IncorrectPasswordError") {
      throw new ExpressError("Incorrect old password ", 400);
    }
    throw error;
  }
};

const logOutUser = async (req, res, next) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
  });
  return res.apiResponse("Successfully logged out");
};

const userController = {
  register,
  login,
  logOutUser,
  sendForgotPasswordToken,
  verifyTokenAndUpdatePassword,
  changePassword,
};

module.exports = userController;
