const { userModel } = require("../models/userModel.js");

async function searchUser(req, res) {
  try {
    const { search } = req.body;

    const query = new RegExp(search, "i", "g");

    const user = await userModel.find({
      $or: [
        {
          name: query,
        },
        {
          email: query,
        },
      ],
    }).select('-password');

    return res.status(200).json({
      message: "all user",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = { searchUser };
