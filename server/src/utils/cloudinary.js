import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload buffer directly to Cloudinary
const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;

    // Convert buffer to readable stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    // Upload stream to Cloudinary
    const response = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Auto-detect file type
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(stream);
    });

    return response; // Return Cloudinary response
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, cloudinary };
