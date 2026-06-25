const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const { emailValidate, passwordValidate } = require("../utils/validate");
const User = require("../models/user.model");
const { verifyTemplate } = require("../utils/emailTemplate");
const { sendEmail } = require("../utils/email");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    if (!emailValidate(email))
      return res.status(400).json({ error: "Invalid email address" });

    const isExsit = await User.findOne({ email });
    if (isExsit) return res.status(409).json({ error: "User Exist" });

    if (!passwordValidate(password))
      return res.status(400).json({ error: "Invalid password type" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash,
      emailVerify: {
        token: uuid(),
        createdAt: Date.now(),
      },
    });

    await newUser.save();
    const { text, html, subject } = verifyTemplate(
      newUser.name,
      newUser.emailVerify.token,
    );

    await sendEmail({ to: newUser.email, subject, html, text });

    res.status(201).json({
      message: "User created verify your email.",
      user: {
        name,
        email,
        verifyExpiration: newUser.emailVerify.createdAt + 1000 * 60 * 10,
      },
    });
  } catch (error) {
    console.log("Error on register controller (auth.controller)", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
};
