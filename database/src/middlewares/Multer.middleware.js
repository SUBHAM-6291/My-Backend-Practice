import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(),  "uploads", "temp");

// ✅ Ensure the directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // ✅ Use corrected upload path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
