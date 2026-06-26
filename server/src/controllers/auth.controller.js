const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const { emailValidate, passwordValidate } = require("../utils/validate");
const User = require("../models/user.model");
const { verifyTemplate, forgotTemplate } = require("../utils/emailTemplate");
const { sendEmail } = require("../utils/email");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../utils/jwt");
const { accessCookie, refreshCookie } = require("../utils/cookie");

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

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token missed" });

    const user = await User.findOne({ "emailVerify.token": token });

    if (!user) return res.status(409).json({ error: "Invalid Token" });

    if (user.isVerified)
      return res.status(200).json({
        message: "Email Verified",
      });

    const diff = Date.now() - user.emailVerify.createdAt;

    if (diff > 1000 * 60 * 30) {
      user.emailVerify.token = null;
      user.emailVerify.createdAt = null;

      await user.save();

      return res.status(409).json({ error: "Token Expired" });
    }

    user.isVerified = true;
    user.emailVerify = {
      token: null,
      createdAt: null,
    };
    await user.save();

    res.status(200).json({
      message: "Email Verified",
    });
  } catch (error) {
    console.log("Error on verifyEmail controller (auth.controller)", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Invalid Cridentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Cridentials" });

    if (user.isVerified)
      return res.status(200).json({
        message: "Email verified",
      });

    user.emailVerify = {
      token: uuid(),
      createdAt: Date.now(),
    };

    await user.save();
    const { text, html, subject } = verifyTemplate(
      user.name,
      user.emailVerify.token,
    );

    await sendEmail({ to: user.email, subject, html, text });

    res.status(200).json({
      message: "Verification email has been sent",
    });
  } catch (error) {
    console.log(
      "Error on resendVerifyEmail controller (auth.controller) ",
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Invalid Cridentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Cridentials" });

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck)
      return res.status(400).json({ error: "Invalid Cridentials" });

    if (!user.isVerified)
      return res.status(401).json({
        error: "Verify Your email",
      });

    const access = signAccessToken({
      id: user._id,
      email: user.email,
    });

    const refresh = signRefreshToken({
      id: user._id,
      email: user.email,
    });

    user.refresh.push({ token: refresh, createdAt: Date.now() });

    await user.save();

    accessCookie(res, access);
    refreshCookie(res, refresh);

    res.status(200).json({
      message: "User loged in successfully",
    });
  } catch (error) {
    console.log("Error on login controller (auth.controller)", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Invalid Cridentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Cridentials" });

    if (!user.isVerified)
      return res.status(401).json({
        error: "Verify your email first",
      });

    user.forgotPassword = {
      token: uuid(),
      createdAt: Date.now(),
    };

    await user.save();

    const { text, html, subject } = forgotTemplate(
      user.name,
      user.forgotPassword.token,
    );

    await sendEmail({ to: user.email, subject, html, text });

    res.status(200).json({
      message: "Reset password email has been sent.",
    });
  } catch (error) {
    console.log("Error on forgotPassword conroller (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body || {};

    if (!email || !password || !token)
      return res.status(400).json({
        error: "Invalid Cridentials",
      });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Cridentials" });

    if (user.forgotPassword.token !== token)
      return res.status(400).json({ error: "Invalid Cridentials" });

    if (Date.now() - user.forgotPassword.createdAt > 1000 * 60 * 5) {
      user.forgotPassword = {
        token: null,
        createdAt: null,
      };
      await user.save();
      return res.status(401).json({ error: "Token expired" });
    }

    if (!passwordValidate(password))
      return res.status(400).json({ error: "Invalid password type" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.forgotPassword = {
      token: null,
      createdAt: null,
    };

    user.refresh = [];

    await user.save();

    res.status(200).json({
      message: "password has been reseted.",
    });
  } catch (error) {
    console.log("Error on resetPassword controller (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const resendForgotEmail = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Invalid Cridentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Cridentials" });

    user.forgotPassword = {
      token: uuid(),
      createdAt: Date.now(),
    };

    await user.save();

    const { text, html, subject } = forgotTemplate(
      user.name,
      user.forgotPassword.token,
    );

    await sendEmail({ to: user.email, subject, html, text });

    res.status(200).json({
      message: "Reset password email has been sent.",
    });
  } catch (error) {
    console.log("Error on resendForgotEmail (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refresh } = req.cookies || {};

    req.user.refresh = req.user.refresh.filter(
      (item) => item.token !== refresh,
    );

    await req.user.save();

    res.clearCookie("access");
    res.clearCookie("refresh");

    res.status(204).json({});
  } catch (error) {
    console.log("Error on logout controller (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const me = async (req, res) => {
  try {
    const user = req.user.toObject();

    delete user.password;
    delete user.isVerified;
    delete user.emailVerify;
    delete user.refresh;
    delete user.forgotPassword;

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("Error on me cotroller (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh } = req.cookies || {};

    if (!refresh) {
      return res.status(401).json({
        error: "Refresh token missing",
      });
    }

    const result = verifyRefreshToken(refresh);
    if (!result.success)
      return res.status(401).json({
        error: "Refresh token missing",
      });

    const user = await User.findById(result.payload.id);

    if (!user)
      return res.status(404).json({
        error: "User not found",
      });

    const tokenExists = user.refresh.some((item) => item.token === refresh);

    if (!tokenExists)
      return res.status(401).json({
        error: "Invalid refresh token",
      });

    const access = signAccessToken({
      id: user._id,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      id: user._id,
      email: user.email,
    });

    user.refresh = user.refresh.filter((item) => item.token !== refresh);
    user.refresh.push({ token: refreshToken, createdAt: Date.now() });

    await user.save();

    accessCookie(res, access);
    refreshCookie(res, refreshToken);

    res.status(200).json({
      message: "Token refreshed",
    });
  } catch (error) {
    console.log("Error in refresh controller (auth.controller) ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  forgotPassword,
  resetPassword,
  resendForgotEmail,
  logout,
  me,
  refresh,
};
