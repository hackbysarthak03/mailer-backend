import ProductModel from "../models/ProductModel.js";
import CategoryModel from "../models/CategoryModel.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save(); // discounts auto-calculated in pre("save")

    // update category product list + count
    await CategoryModel.findByIdAndUpdate(product.category, {
      $push: { products: product._id },
      $inc: { productCount: 1 }
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug }).populate("category");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Product (use save instead of findByIdAndUpdate)
export const updateProduct = async (req, res) => {
  try {
    let product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // merge new data into existing product
    product.set(req.body);

    // save (this will trigger pre("save") → recalc discounts for weights)
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // also update category
    await CategoryModel.findByIdAndUpdate(product.category, {
      $pull: { products: product._id },
      $inc: { productCount: -1 }
    });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
