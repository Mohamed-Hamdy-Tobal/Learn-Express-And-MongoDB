var jwt = require("jsonwebtoken");
const appError = require("./appError");
const httpStatusText = require("./httpStatusText");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create(
      "Invalid required!",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    const error = appError.create("Invalid Token!", 401, httpStatusText.FAIL);
    return next(error);
  }
};

module.exports = {
  verifyToken,
};
