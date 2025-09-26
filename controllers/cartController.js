import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, weightLabel, quantity } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find selected weight
    const selectedWeight = product.weights.find(w => w.label === weightLabel);
    if (!selectedWeight) {
      return res.status(400).json({ message: "Selected weight not found" });
    }

    // Check if already in cart
    const existingItem = user.cart.find(
      item => item.product.toString() === productId && item.weightLabel === weightLabel
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({
        product: productId,
        weightLabel,
        quantity: quantity || 1,
        price: selectedWeight.price,
        originalPrice: selectedWeight.originalPrice,
        discount: selectedWeight.discount
      });
    }

    await user.save();
    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, weightLabel } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) =>
        !(item.product.toString() === productId && item.weightLabel === weightLabel)
    );

    await user.save();
    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, weightLabel, quantity } = req.body; // quantity = new value
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the cart item
    const cartItem = user.cart.find(
      item => item.product.toString() === productId && item.weightLabel === weightLabel
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    cartItem.quantity = quantity;

    await user.save();
    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, weightLabel, action } = req.body; // action = "increment" | "decrement"

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find cart item
    const cartItem = user.cart.find(
      item => item.product.toString() === productId && item.weightLabel === weightLabel
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (action === "increment") {
      cartItem.quantity += 1;
    } else if (action === "decrement") {
      cartItem.quantity -= 1;
      if (cartItem.quantity <= 0) {
        // Auto remove if 0
        user.cart = user.cart.filter(
          item => !(item.product.toString() === productId && item.weightLabel === weightLabel)
        );
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserWithCart = async (req, res) => {
  try {
    // Assuming you are already using authentication middleware 
    // and `req.user._id` is available
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.product",
        model: "Product", // reference to your Product model
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      cart: user.cart, // send only cart OR whole user if you prefer
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
