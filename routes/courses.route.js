const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courses.controller");
const { validationSchema } = require("../middleware/validationSchema");
const { verifyToken } = require("../utils/verifyToken");
const userRoles = require("../utils/userRoles");
const allowTo = require("../utils/allowTo");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verifyToken, validationSchema(), courseController.addCourse);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(verifyToken, courseController.updateCourse)
  .delete(verifyToken, allowTo(userRoles.ADMIN), courseController.deleteCourse);

module.exports = router;
