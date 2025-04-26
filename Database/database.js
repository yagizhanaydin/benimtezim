import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  database: 'benimtezim',
  user: 'postgres',
  password: '12345',
  port: 5432,
});

// Kullanıcıyı email'e göre bulur
export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // Kullanıcı varsa döner, yoksa undefined
};

export const createUser = async (email, hashedPassword, kullanici_adi, photoFilename) => {
  const result = await pool.query(
    `INSERT INTO users 
    (email, password, kullanici_adi, photo, role) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`,
    [email, hashedPassword, kullanici_adi, photoFilename || null, 'user']
  );
  return result.rows[0];
};

export default pool;
