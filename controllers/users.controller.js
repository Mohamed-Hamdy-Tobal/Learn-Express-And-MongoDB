const Users = require("../models/users.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await Users.find(
    {},
    { __v: false, password: false, access_token: false }
  )
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

module.exports = {
  getAllUsers,
};
