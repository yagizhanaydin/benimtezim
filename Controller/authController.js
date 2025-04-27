import { findUserByEmail, createUser } from '../Database/database.js';

import pool from '../Database/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { processAndSaveImage } from '../Middleware/uploadMiddleware.js';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);
export const Register = async (req, res) => {
  try {
    const { email, password, passwordagain,kullanici_adi } = req.body;

  
    if (!email || !password || !passwordagain || !kullanici_adi) {
      return res.status(400).json({ success: false, error: 'Tüm alanlar zorunludur' });
    }

    if (password !== passwordagain) {
      return res.status(400).json({ success: false, error: 'Şifreler eşleşmiyor' });
    }

 
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Bu email zaten kayıtlı' });
    }

 
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

 

const newUser = await createUser(email, hashedPassword, kullanici_adi,photoFilename);


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



export const Login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email ve şifre zorunludur' });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1", 
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Geçersiz email veya şifre' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      role: user.role, // Rolü dönüyoruz ki frontend kontrol etsin
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    return res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
};



export const getdatauser = async (req, res) => {
  // Token'dan user id al (middleware ile eklenmiş olmalı)
  const userId = req.user.id; 

  try {
   
      const { rows } = await pool.query(
          'SELECT kullanici_adi, email FROM users WHERE id = $1',
          [userId]
      );

      // Kullanıcı bulunamazsa
      if (rows.length === 0) {
          return res.status(404).json({ 
              success: false, 
              error: 'Kullanıcı bulunamadı' 
          });
      }

 
      res.status(200).json({
          success: true,
          user: rows[0] 
      });

  } catch (error) {
      console.error('Database hatası:', error);
      res.status(500).json({ 
          success: false, 
          error: 'Veritabanı hatası, lütfen tekrar deneyin' 
      });
  }
};




export const dataupdateuser = async (req, res) => {
  const userId = req.user.id;
  const { email, password, passwordagain, kullanici_adi } = req.body;

  try {
    
    const currentUser = await pool.query(
      "SELECT email, password, kullanici_adi FROM users WHERE id = $1",
      [userId]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Kullanıcı bulunamadı" 
      });
    }

    const currentData = currentUser.rows[0];


    if (password || passwordagain) {
      if (!password || !passwordagain) {
        return res.status(400).json({ 
          success: false, 
          error: "Şifre alanları boş olamaz" 
        });
      }
      
      if (password !== passwordagain) {
        return res.status(400).json({ 
          success: false, 
          error: "Şifreler uyuşmuyor" 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: "Şifre en az 6 karakter olmalı" 
        });
      }
    }


    if (email && email !== currentData.email) {
      const emailCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Bu email zaten kullanımda" 
        });
      }
    }

  
    const updatedFields = {
      email: email || currentData.email,
      kullanici_adi: kullanici_adi || currentData.kullanici_adi,
      password: currentData.password // Varsayılan olarak eski şifre
    };

  
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

  
    const updateUser = await pool.query(
      `UPDATE users SET 
        email = $1, 
        password = $2, 
        kullanici_adi = $3 
       WHERE id = $4 
       RETURNING id, email, kullanici_adi`,
      [
        updatedFields.email,
        updatedFields.password,
        updatedFields.kullanici_adi,
        userId
      ]
    );

    return res.status(200).json({ 
      success: true,
      message: "Bilgiler başarıyla güncellendi",
      user: updateUser.rows[0]
    });

  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Sunucu hatası" 
    });
  }
};