import express from 'express'
import dotenv from'dotenv'
import cors from 'cors'
import path, { dirname } from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'; 
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

dotenv.config();

const app=express();

const __filename = fileURLToPath(import.meta.url);
const __dirname=dirname(__filename)


app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname , 'src')))

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
