const Message = require("../models/message.model");
const User = require("../models/user.model");

const sendMessage = async (req, res) => {
  try {
    const { reciver, message } = req.body || {};
    if (!reciver || !message)
      return res.status(401).json({
        error: "All fields required",
      });

    const user =
      reciver === "admin"
        ? await User.findOne({ roll: "admin" })
        : await User.findById(reciver);

    if (!user || user._id === req.user._id)
      return res.status(401).json({
        error: "Invalid user id",
      });

    const msg = new Message({
      sender: req.user._id,
      reciever: user._id,
      message,
    });

    await msg.save();

    res.status(201).json({
      message: "Message has been sent",
    });
  } catch (error) {
    console.log("Error on sendMessage controller (message.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMessage,
};
