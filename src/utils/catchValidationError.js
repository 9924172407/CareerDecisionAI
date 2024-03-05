const { validationResult } = require("express-validator");

const catchValidationError = (func) => async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = [];
    errors
      .array({ onlyFirstError: true })
      .map((err) => formattedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      type: "ValidationError",
      message: "Request validation failed",
      errors: formattedErrors,
    });
  }

  res.apiResponse = (message, data, status = 200) =>
    res.status(status).json({ message, data });

  return func(req, res, next).catch((error) => next(error));
};

module.exports = catchValidationError;
