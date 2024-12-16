const express = require("express");

const router = express.Router();

const userController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../utils/verifyToken");

router.route("/").get(verifyToken, userController.getAllUsers);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

module.exports = router;