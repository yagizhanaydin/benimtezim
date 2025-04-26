
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Yetki yok: Token bulunamadı' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }
    
    req.user = {
      id: decoded.user_id,  // user_id olarak decode ediliyor
      role: decoded.role    // role bilgisi
    };
    
    next();
  });
};