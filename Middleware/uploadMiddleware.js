import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads klasörü yoksa oluştur
const uploadsDir = path.join(__dirname, '../../uploads');
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Resmi önce belleğe al

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Sadece JPEG, JPG, PNG veya WEBP formatında resimler yüklenebilir'));
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

export const processAndSaveImage = async (file) => {
  if (!file) return null;

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `user-${uniqueSuffix}${path.extname(file.originalname)}`;
  const filepath = path.join(uploadsDir, filename);

  try {
    // Resmi optimize et ve kaydet
    await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath);

    return filename;
  } catch (err) {
    console.error('Resim işleme hatası:', err);
    throw new Error('Resim işlenirken hata oluştu');
  }
};

export const uploadSingleImage = (fieldName) => upload.single(fieldName);