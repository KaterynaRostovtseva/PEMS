import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadsRoot = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 20);
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Недопустимый тип файла"));
      return;
    }
    cb(null, true);
  },
});
