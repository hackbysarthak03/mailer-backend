import PromotionalBannerModel from "../models/PromotionalBannerModel.js";

// Create / Update (only one record)
export const setPromotionalBanner = async (req, res) => {
  try {
    let banner = await PromotionalBannerModel.findOne();
    if (banner) {
      banner.set(req.body);
      await banner.save();
    } else {
      banner = new PromotionalBannerModel(req.body);
      await banner.save();
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get
export const getPromotionalBanner = async (req, res) => {
  try {
    const banner = await PromotionalBannerModel.findOne();
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
