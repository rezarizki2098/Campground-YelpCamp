const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "YelpCamp", //? untuk membuat folder di database
        allowedFormats: ["jpg", "png", "jpeg"], //? format yang diizinkan untuk di upload
    },
});

module.exports = {
    cloudinary,
    storage,
};
