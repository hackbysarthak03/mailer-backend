import mongoose from "mongoose";

const bannerImagesSchema = new mongoose.Schema({
  images: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length <= 6; // max 6 images
      },
      message: "You can upload a maximum of 6 banner images"
    },
    required: true
  }
}, { timestamps: true });

const BannerImagesModel = mongoose.model("BannerImages", bannerImagesSchema);
export default BannerImagesModel;
