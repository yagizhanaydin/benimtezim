import jwt from 'jsonwebtoken';
import pool from '../Database/database.js';

export const Adminlogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Email ve şifre alanları zorunludur!"
        });
    }

    try {
    
        const result = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Bu email ile kayıtlı admin bulunamadı!"
            });
        }

        const admin = result.rows[0];


        console.log("Veritabanındaki şifre:", admin.password_hash);
        console.log("Girilen şifre:", password);

     
        if (admin.password_hash !== password) {
            console.log("Şifre yanlış:", password, admin.password_hash);
            return res.status(401).json({
                success: false,
                error: "Hatalı şifre girdiniz!"
            });
        }

     
        const token = jwt.sign({
            admin_id: admin.admin_id,
            email: admin.email,
            role: admin.role
        }, process.env.JWT_SECRET || "gizliAnahtar", { expiresIn: '24h' });

        return res.status(200).json({
            success: true,
            message: "Admin girişi başarılı!",
            token: token,
            admin: {
                id: admin.admin_id,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Giriş hatası:", error);
        return res.status(500).json({
            success: false,
            error: "Bir hata oluştu, lütfen tekrar deneyin!"
        });
    }
};
