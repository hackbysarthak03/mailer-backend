import User from "../models/UserModel.js";

// ✅ 1. Fetch all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add Address
export const addAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, district, landmark, state, pincode } = req.body;

    if (!addressLine1 || !district || !state || !pincode) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAddress = {
      addressLine1,
      addressLine2,
      district,
      landmark,
      state,
      pincode,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ 2. Edit address (by index)
export const updateAddress = async (req, res) => {
  try {
    const { index } = req.params;
    const { addressLine1, addressLine2, district, landmark, state, pincode } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.addresses[index]) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Update fields
    user.addresses[index] = {
      addressLine1: addressLine1 || user.addresses[index].addressLine1,
      addressLine2: addressLine2 || user.addresses[index].addressLine2,
      district: district || user.addresses[index].district,
      state: state || user.addresses[index].state,
      pincode: pincode || user.addresses[index].pincode,
      landmark: landmark || user.addresses[index].landmark,
    };

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ 3. Delete address (by index)
export const deleteAddress = async (req, res) => {
  try {
    const { index } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.addresses[index]) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses.splice(index, 1); // remove address
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
