import mongoose from "mongoose";
import slugify from "slugify"; // ✅ install with: npm install slugify

const nutritionFactSchema = new mongoose.Schema({
    nutrient: String,
    value: String,
    daily: String,
}, { _id: false });

const keyBenefitSchema = new mongoose.Schema({
    title: String,
    description: String,
}, { _id: false });

const deliveryInfoSchema = new mongoose.Schema({
    text: String,
}, { _id: false });

const usageSchema = new mongoose.Schema({
    dailyDosage: String,
}, { _id: false });

const whyChooseSchema = new mongoose.Schema({
    icon: String,
    title: String,
    description: String,
}, { _id: false });

// weight schema with own price/originalPrice
const weightSchema = new mongoose.Schema({
    label: { type: String, required: true }, // e.g. "250g", "1kg"
    originalPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // will be auto-calculated
}, { _id: false });

const productSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        index: true
    },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    title: { type: String, required: true },
    description: { type: String },

    weights: [weightSchema],

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },

    images: {
        type: [String],
        validate: {
            validator: (arr) => arr.length <= 4,
            message: "A product can have a maximum of 4 images",
        },
    },
    nutritionFacts: [nutritionFactSchema],
    keyBenefits: [keyBenefitSchema],
    deliveryInfo: [deliveryInfoSchema],
    usage: [usageSchema],
    whyChoose: [whyChooseSchema],
}, { timestamps: true });

// ✅ Auto-generate slug from title
productSchema.pre("save", function (next) {
    if (this.isModified("title") || this.isNew) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,   // removes special chars
            trim: true
        });
    }

    // Auto-calc discount for each weight
    if (this.weights && this.weights.length > 0) {
        this.weights.forEach(weight => {
            if (weight.originalPrice && weight.price) {
                weight.discount = Math.round(
                    ((weight.originalPrice - weight.price) / weight.originalPrice) * 100
                );
            }
        });
    }

    next();
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
