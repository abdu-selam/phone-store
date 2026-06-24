const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const { emailValidate, passwordValidate } = require("../utils/validate");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    /*
        1. recieve inputs
            . name 
            . email 
            . password (6 in length, should have numbers, letters in both cases)
        2. validation
        3. encrypt password
        4. generate user object allong side confirmation token
        5. save user
        6. send email
        7. send verification
    */
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
    // TODO -> send email

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
