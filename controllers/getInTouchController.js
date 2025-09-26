import GetInTouchModel from "../models/GetInTouchModel.js";

// Create / Update (only one record)
export const setGetInTouch = async (req, res) => {
  try {
    let getInTouch = await GetInTouchModel.findOne();
    if (getInTouch) {
      getInTouch.set(req.body);
      await getInTouch.save();
    } else {
      getInTouch = new GetInTouchModel(req.body);
      await getInTouch.save();
    }
    res.status(200).json({ success: true, data: getInTouch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get
export const getGetInTouch = async (req, res) => {
  try {
    const getInTouch = await GetInTouchModel.findOne();
    res.status(200).json({ success: true, data: getInTouch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
