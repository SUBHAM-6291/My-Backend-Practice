import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Filesystem

// 🔹 Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔹 Upload Function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const result = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        return result;
    } catch (error) {
        console.error("❌ Upload failed:", error.message);
        fs.unlinkSync(localFilePath); // 🧹 Clean up local file on failure
        return null;
    }
};

// 🔹 Upload from URL
const uploadFromURL = async () => {
    try {
        const result = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            { public_id: 'shoes' }
        );
        console.log("✅ Uploaded from URL:", result.secure_url);
        return result;
    } catch (error) {
        console.error("❌ Upload from URL failed:", error.message);
        return null;
    }
};

// 🔹 Exports
export { uploadOnCloudinary, uploadFromURL };
