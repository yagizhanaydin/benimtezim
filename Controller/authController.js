import { findUserByEmail, createUser } from '../Database/database.js';

import pool from '../Database/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { processAndSaveImage } from '../Middleware/uploadMiddleware.js';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);
export const Register = async (req, res) => {
  try {
    const { email, password, passwordagain } = req.body;

    // Validasyon
    if (!email || !password || !passwordagain) {
      return res.status(400).json({ success: false, error: 'Tüm alanlar zorunludur' });
    }

    if (password !== passwordagain) {
      return res.status(400).json({ success: false, error: 'Şifreler eşleşmiyor' });
    }

    // Kullanıcı kontrolü
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Bu email zaten kayıtlı' });
    }

    // Şifre hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fotoğraf varsa işle
    let photoFilename = null;
    if (req.file) {
      try {
        photoFilename = await processAndSaveImage(req.file);
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    // Yeni kullanıcıyı veritabanına ekle
    const newUser = await createUser(email, hashedPassword, photoFilename);

    // JWT_SECRET kontrolü
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
    console.log("JWT_SECRET:", jwtSecret); // debug

    // JWT oluştur
    const token = jwt.sign(
      {
        user_id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Başarılı yanıt
    return res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        photo: photoFilename ? `/uploads/${photoFilename}` : null,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);

    if (req.file?.filename) {
      const filepath = path.join(__dirname, '../../uploads', req.file.filename);
      try {
        await unlinkAsync(filepath);
      } catch (unlinkError) {
        console.error('Resim silinirken hata:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
