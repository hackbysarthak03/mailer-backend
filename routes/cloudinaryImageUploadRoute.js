import express from 'express';
import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: "No file uploaded" });

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "react_uploads" },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.json({ success: true, url: result.secure_url });
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;