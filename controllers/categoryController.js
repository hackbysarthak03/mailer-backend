import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../models/ProductModel.js";

// ✅ Create Category
export const createCategory = async (req, res) => {
  console.log('Create request body:', req.body);
  try {
    const category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().populate("products");
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Category
export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id).populate("products");
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug }).populate("products");
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Category
export const updateCategory = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
  
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
