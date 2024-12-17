var jwt = require("jsonwebtoken");
const appError = require("./appError");
const httpStatusText = require("./httpStatusText");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      appError.create(
        "Missing or Malformed Authorization Header",
        STATUS.UNAUTHORIZED,
        httpStatusText.FAIL
      )
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(
      appError.create(
        "Token not found in Authorization Header",
        STATUS.UNAUTHORIZED,
        httpStatusText.FAIL
      )
    );
  }

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Add current user to request object for later use in all next middlewares
    req.currentUser = currentUser;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(
        appError.create(
          "Invalid Token!",
          STATUS.UNAUTHORIZED,
          httpStatusText.FAIL
        )
      );
    } else if (err.name === "TokenExpiredError") {
      return next(
        appError.create(
          "Token Expired!",
          STATUS.UNAUTHORIZED,
          httpStatusText.FAIL
        )
      );
    }

    return next(
      appError.create(
        "Authentication Failed!",
        STATUS.UNAUTHORIZED,
        httpStatusText.FAIL
      )
    );
  }
};

module.exports = {
  verifyToken,
};
