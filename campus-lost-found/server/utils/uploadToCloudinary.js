import cloudinary from "../config/cloudinary.js";

// Multer (with memoryStorage) gives us a raw file buffer, not a saved
// file path — this streams that buffer straight up to Cloudinary
// without ever writing it to disk.
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export default uploadToCloudinary;
