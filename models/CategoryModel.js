import mongoose from "mongoose";
import slugify from "slugify";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 }
});

const categorySchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  heroImage: { type: String },
  productCount: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  testimonials: [testimonialSchema],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });


// ✅ Pre-save hook for create/save
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

// ✅ Pre-update hook for findOneAndUpdate
categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true, trim: true });
    this.setUpdate(update);
  }
  next();
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
