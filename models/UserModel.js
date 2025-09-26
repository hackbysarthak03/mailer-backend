// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  weightLabel: {
    type: String, // e.g., "250g"
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true, // actual price for this weight
  },
  originalPrice: {
    type: Number, // optional, for showing discount
  },
  discount: {
    type: Number, // optional
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  landmark: { type: String, required: false, trim: true },
  pincode: { type: String, required: true, trim: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        addresses: { type: [addressSchema], default: [] }, 
        otp: { type: String },
        isVerified: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
        isSuperAdmin: { type: Boolean, default: false },
        cart: { type: [cartItemSchema], default: [] },
        orders: { type: Array, default: [] }, 
    },
    { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
