const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore unlink errors */ }
    return uploadResult.secure_url;
  } catch (error) {
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore unlink errors */ }
    throw new Error('Cloudinary upload failed');
  }
};

module.exports = uploadOnCloudinary;