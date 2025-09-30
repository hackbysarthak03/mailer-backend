import BlogModel from "../models/BlogModel.js";

// Add a new blog
export const addBlog = async (req, res) => {
  try {
    console.log(req.body);
    const blog = new BlogModel(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs with pagination, search, and tag filter
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", tag } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { seoTitle: { $regex: search, $options: "i" } },
        { seoDescription: { $regex: search, $options: "i" } },
        { seoKeywords: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) query.tags = tag;

    const blogs = await BlogModel.find(query)
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await BlogModel.countDocuments(query);

    res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
      blogs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a blog by slug
export const getBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a blog by slug
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a blog by slug
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await BlogModel.findOneAndDelete({ slug: req.params.slug });
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment to blog
export const addComment = async (req, res) => {
  try {
    const { user, comment } = req.body;
    const blog = await BlogModel.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ user, comment });
    await blog.save();
    res.status(201).json(blog.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment by commentId
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const blog = await BlogModel.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
    await blog.save();
    res.status(200).json(blog.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
