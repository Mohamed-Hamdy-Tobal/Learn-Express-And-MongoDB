const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const User = require("../models/users.model");
var bcrypt = require("bcryptjs");
const appError = require("../utils/appError");
const generateToken = require("../utils/generateToken");

const register = asyncWrapper(async (req, res, next) => {
  try {
    const userData = req.body;
    console.log("userData:", userData);

    const isExistUser = await User.findOne({ email: userData.email });
    if (isExistUser) {
      return next(
        appError.create(
          "A user with this email already exists.",
          409,
          httpStatusText.ERROR
        )
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT Token

    const token = await generateToken({ email: newUser.email, id: newUser._id });

    console.log("token:",token)

    newUser.access_token = token;

    await newUser.save();

    res.status(201).json({
      status: httpStatusText.SUCCESS,
      msg: "register successfully",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: httpStatusText.ERROR,
      msg: "Registration failed",
      error: err.message,
    });
  }
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      appError.create(
        "Please provide both email and password",
        400,
        httpStatusText.ERROR
      )
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(
      appError.create("Invalid credentials!", 401, httpStatusText.FAIL)
    );
  }

  const access_token = await generateToken({ email: user.email, id: user._id });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    access_token,
  });
});

module.exports = {
  register,
  login,
};