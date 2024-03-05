const crypto = require("crypto");
const nodemailer = require("nodemailer");

const USER = process.env.EMAIL_SMTP_USERNAME;
const PASS = process.env.EMAIL_SMTP_PASSWORD;
const HOST = process.env.EMAIL_SMTP_HOST;
const PORT = process.env.EMAIL_SMTP_PORT;

const transporter = () => {
  return nodemailer.createTransport({
    port: PORT,
    host: HOST,
    SMTPAuth: false,
    auth: {
      user: USER,
      pass: PASS,
    },
  });
};

const sendResetLinkToUserMail = (req, reset_link) => {
  return {
    from: "mehuladodiya@gmail.com",
    to: req.body.email,
    subject: "Your OTP for changing your account password",
    html: `
    <h4>Hi,</h4>
    <p>Please confirm your account to reset your password.</p>
    <p> Reset Link : ${reset_link}</p>
    `,
  };
};

function generatePasswordResetLink(req, user) {
  const token = crypto.randomBytes(20).toString("hex");
  const expiresIn = new Date();
  expiresIn.setHours(expiresIn.getHours() + 1);

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expiresIn;
  user.save();

  const resetLink = `http://${req.headers.host}/reset-password/${token}`;

  return resetLink;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Helpers = {
  generatePasswordResetLink,
  transporter,
  sendResetLinkToUserMail,
  formatDate,
};

module.exports = Helpers;
