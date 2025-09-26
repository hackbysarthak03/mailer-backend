import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import emailRoute from './routes/emailRoute.js';
import connectDB from "./src/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bannerImagesRoutes from "./routes/bannerImagesRoutes.js";
import promotionalBannerRoutes from "./routes/promotionalBannerRoutes.js";
import getInTouchRoutes from "./routes/getInTouchRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// -------------------------  Import Section ends here -------------------------

dotenv.config({ quiet: true });
const app = express();

app.use(express.json());

app.use(cors({
  origin: "*", // React app URL
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
  allowedHeaders: "*",
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// -------------------------- Configuration Section ends here -------------------

connectDB();

// User Routes ------------------------------------------------------------------
app.use("/api/users", userRoutes);

// Email Routes -----------------------------------------------------------------
app.use("/api/email", emailRoute);

// Category & Products Routes ---------------------------------------------------
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Website Section Routes -------------------------------------------------------

app.use("/api/banner-images", bannerImagesRoutes);
app.use("/api/promotional-banner", promotionalBannerRoutes);
app.use("/api/get-in-touch", getInTouchRoutes);
app.use("/api/addresses", addressRoutes);

// Cart Routes -------------------------------------------------------------------
app.use("/api/cart", cartRoutes);
