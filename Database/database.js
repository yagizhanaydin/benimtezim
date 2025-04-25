import { Pool } from 'postgres-pool';

const pool = new Pool({
    host: 'localhost',
    database: 'benimtezim',
    user: 'postgres',
    password: '12345',
    port: 1234,
});


const connection = await pool.connect();
try {
  const results = await connection.query('SELECT * from "users" where id=$1', [userId]);
  console.log('user:', results.rows[0]);
} finally {
 
  await connection.release();
}


