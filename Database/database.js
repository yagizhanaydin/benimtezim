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

// Yeni kullanıcı oluşturur
export const createUser = async (email, hashedPassword, photoFilename) => {
  const result = await pool.query(
    'INSERT INTO users (email, password, photo, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, photoFilename, 'user'] // Varsayılan role: user
  );
  return result.rows[0];
};

export default pool;
