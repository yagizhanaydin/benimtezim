import express from 'express';
import { getdatauser, Register, Login } from '../Controller/authController.js';
import { uploadSingleImage } from '../Middleware/uploadMiddleware.js';
import { authenticateToken } from '../Middleware/AuthMidlleware.js';

const router = express.Router();


router.post('/register', uploadSingleImage('photo'), Register);


router.post('/login', Login);


router.get('/clientdata', authenticateToken, getdatauser);

export default router;
