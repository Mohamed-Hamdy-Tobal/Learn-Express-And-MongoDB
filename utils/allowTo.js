const jwt = require("jsonwebtoken");
const appError = require("./appError");
const httpStatusText = require("./httpStatusText");

const STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

// Middleware for role-based access control
const allowTo = (...roles) => {
  return (req, res, next) => {
    try {
      const currentUser = req.currentUser;

      console.log("currentUser:", currentUser);

      if (!roles.includes(currentUser.role)) {
        return next(
          appError.create(
            "Unauthorized Role",
            STATUS.FORBIDDEN,
            httpStatusText.FAIL
          )
        );
      }

      next();
    } catch (err) {
      return next(
        appError.create(
          "Authentication Failed!",
          STATUS.UNAUTHORIZED,
          httpStatusText.FAIL
        )
      );
    }
  };
};

module.exports = allowTo;
