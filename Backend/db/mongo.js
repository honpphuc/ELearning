import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectMongo() {
  try {
    let uri = (process.env.MONGO_URI || "").trim();
    const defaultUri = "mongodb://127.0.0.1:27017/edulearn";

    const hasValidScheme =
      uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
    if (!uri || !hasValidScheme) {
      if (uri && !hasValidScheme) {
        console.warn(
          `⚠️  MONGO_URI không hợp lệ (\"${uri}\"). Sử dụng mặc định: ${defaultUri}`
        );
      }
      uri = defaultUri;
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected =>", uri);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
