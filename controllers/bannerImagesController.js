import BannerImagesModel from "../models/BannerImagesModel.js";

// Create / Update (only one record)
export const setBannerImages = async (req, res) => {
  try {
    let banner = await BannerImagesModel.findOne();
    if (banner) {
      banner.set(req.body);
      await banner.save();
    } else {
      banner = new BannerImagesModel(req.body);
      await banner.save();
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get
export const getBannerImages = async (req, res) => {
  try {
    const banner = await BannerImagesModel.findOne();
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
