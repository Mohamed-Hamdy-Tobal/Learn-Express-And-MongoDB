const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "field must be a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER], // enum is array of values that role type can load it
    default: userRoles.USER, // default role value if role not explicitly specified
  },
  avatar: {
    type: String,
    default: 'uploads/profile.png'
  }
});

module.exports = mongoose.model("User", userSchema);
