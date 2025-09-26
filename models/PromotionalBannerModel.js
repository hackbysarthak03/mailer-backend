import mongoose from "mongoose";

const promotionalBannerSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { timestamps: true });

const PromotionalBannerModel = mongoose.model("PromotionalBanner", promotionalBannerSchema);
export default PromotionalBannerModel;
