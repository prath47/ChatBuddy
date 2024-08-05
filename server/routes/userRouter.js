const { Router } = require("express");
const {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails,
} = require("../controller/userControllers");
const router = Router();

router.post("/register", (req, res) => {
  console.log("register user");
  registerUser(req, res);
});

router.post("/email", (req, res) => {
  console.log("email check");
  checkEmail(req, res);
});

router.post("/password", (req, res) => {
  console.log("password check");
  checkPassword(req, res);
});

router.get("/user-details", (req, res) => {
  console.log("get user details");
  userDetails(req, res);
});

router.get("/logout", (req, res) => {
  console.log("logout");
  logout(req, res);
});

router.post("/update-user", (req, res) => {
  console.log("update user");
  updateUserDetails(req, res);
});

module.exports = router;
