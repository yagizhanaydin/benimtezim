import jwt from 'jsonwebtoken'

export const AdminYekilendirme = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Hata: split('') yerine split(' ') olmalı (boşlukla ayırmalı)
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Yetki bulunamadı"
        });
    }

    // Hata: Fazladan parantez ve arrow function syntax hatası
    jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,  // Eksikti
                error: "Geçersiz token"
            });
        }
        
        // Hata: decoded.admin_id kontrolü eklenmeli
        if (!decoded.admin_id || !decoded.role) {
            return res.status(403).json({
                success: false,
                error: "Token eksik bilgi içeriyor"
            });
        }

        req.user = {
            id: decoded.admin_id,
            role: decoded.role
        };
        next();
    });
};