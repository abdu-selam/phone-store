const Message = require("../models/message.model");
const User = require("../models/user.model");
const { messageFilter } = require("../services/message.service");

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
      data: { ...msg.toObject(), type: "sent" },
    });
  } catch (error) {
    console.log("Error on sendMessage controller (message.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { reciever: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate([
        { path: "sender", select: "name roll" },
        { path: "receiver", select: "name roll" },
      ])
      .lean();
    const filtered = messageFilter(messages);

    res.status(200).json({
      nessage: filtered,
    });
  } catch (error) {
    console.log("Error on getMessages controller (message.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getSingleMessage = async (req, res) => {
  try {
    const other = req?.params?.id;
    if (!other)
      return res.status(401).json({
        error: "Id required",
      });

    const user = await User.findById(other);
    if (!user)
      return res.status(401).json({
        error: "Invalid Id",
      });

    const message = await Message.find({
      $and: [
        {
          sender: {
            $in: [user._id, req.user._id],
          },
        },
        {
          reciever: {
            $in: [user._id, req.user._id],
          },
        },
      ],
    })
      .populate([
        { path: "sender", select: "name roll" },
        { path: "receiver", select: "name roll" },
      ])
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(
      "Error on getSingleMessage controller (message.controller) ",
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getSingleMessage,
};
