const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

async function register(request, response) {
  try {
    const { name, email, password, role } = request.body;

    if (!name || !email || !password || !role) {
      return response.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["student", "hr"].includes(role)) {
      return response.status(400).json({
        message: "Invalid account type",
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return response.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
    });

    const token = createToken(user);

    return response.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return response.status(500).json({
      message: "Unable to create account",
    });
  }
}

async function login(request, response) {
  try {
    const { email, password, role } = request.body;

    if (!email || !password || !role) {
      return response.status(400).json({
        message: "Email, password and account type are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return response.status(401).json({
        message: "Invalid email, password or account type",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches || user.role !== role) {
      return response.status(401).json({
        message: "Invalid email, password or account type",
      });
    }

    const token = createToken(user);

    return response.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return response.status(500).json({
      message: "Unable to log in",
    });
  }
}

module.exports = {
  register,
  login,
};