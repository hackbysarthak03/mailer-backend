
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      email,
      password,
      confirmPassword,
      isAdmin = false,       // default to false
      isSuperAdmin = false,  // default to false
    } = req.body;

    // Basic validations
    if (!firstname || !lastname || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user/email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: "Phone already registered" });

    // Optional: Only allow superadmins to create admins/superadmins
    // if ((isAdmin || isSuperAdmin) && !req.user?.isSuperAdmin) {
    //   return res.status(403).json({ message: "Unauthorized to create admin/superadmin" });
    // }

    // if ((isAdmin || isSuperAdmin)) {
    //   return res.status(403).json({ message: "Unauthorized to create admin/superadmin" });
    // }

    // Create user
    const user = await User.create({
      firstname,
      lastname,
      phone,
      email,
      password,
      isAdmin,
      isSuperAdmin,
    });

    // Respond
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();


    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null; // clear OTP
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};