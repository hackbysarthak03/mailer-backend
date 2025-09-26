import mongoose from "mongoose";

const getInTouchSchema = new mongoose.Schema({
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

const GetInTouchModel = mongoose.model("GetInTouch", getInTouchSchema);
export default GetInTouchModel;
