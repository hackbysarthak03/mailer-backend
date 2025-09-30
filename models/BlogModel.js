import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    author: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    featuredImage: { type: String },
    tags: [{ type: String }],
    content: { type: String, required: true },
    seoTitle: { type: String, maxlength: 60 },
    seoDescription: { type: String, maxlength: 160 },
    seoKeywords: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pre-validate hook to update slug and ensure uniqueness
blogSchema.pre("validate", async function (next) {
  if (this.isModified("title") && this.title) {
    let newSlug = generateSlug(this.title);
    let slugExists = await this.constructor.findOne({ slug: newSlug, _id: { $ne: this._id } });
    let counter = 1;

    // Append counter if slug already exists
    while (slugExists) {
      newSlug = `${generateSlug(this.title)}-${counter}`;
      slugExists = await this.constructor.findOne({ slug: newSlug, _id: { $ne: this._id } });
      counter++;
    }

    this.slug = newSlug;
  }
  next();
});

const BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel;
