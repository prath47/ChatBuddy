const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");

const getuserdetailsfromtoken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const data = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(data.id).select("-password");

  return user;
};

module.exports = { getuserdetailsfromtoken };
