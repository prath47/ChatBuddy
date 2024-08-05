const { userModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getuserdetailsfromtoken,
} = require("../helpers/getuserdetailsfromtoken");

//register user
async function registerUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;

    //check email
    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({
        message: "User alredy exists",
        error: true,
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
      profile_pic,
    };

    const user = await userModel.create(payload);
    return res.status(201).json({
      message: "User created successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

//check user
async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const checkEmail = await userModel.findOne({ email }).select("-password");

    if (!checkEmail) {
      return res.status(400).json({
        message: "User not exist",
        error: true,
      });
    }

    return res.status(200).json({
      message: "email verify",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

//check password
async function checkPassword(req, res) {
  try {
    console.log(req.body);
    const { password, userId } = req.body;

    const user = await userModel.findById(userId);

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: "Wrong password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookiesOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("token", token, cookiesOptions).status(200).json({
      message: "login successful",
      token: token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

//user details
async function userDetails(req, res) {
  try {
    const token = req.cookies.token;
    const data = await getuserdetailsfromtoken(token);

    return res.status(200).json({
      message: "user details",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || error });
  }
}

//logout
async function logout(req, res) {
  try {
    const cookiesOptions = {
      http: true,
      secure: true,
    };
    return res.clearCookie("token", cookiesOptions).status(200).json({
      message: "session out",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

//update user details
async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token;

    const user = await getuserdetailsfromtoken(token);

    const { name, profile_pic } = req.body;

    const updatedDetails = await userModel
      .findByIdAndUpdate(
        user._id,
        {
          name: name,
          profile_pic: profile_pic,
        },
        { new: true }
      )
      .select("-password");

    res.status(200).json({
      message: "user updated",
      data: updatedDetails,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

module.exports = {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails,
};
