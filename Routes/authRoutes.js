import express from 'express';
import { Register } from '../Controller/authController.js';
import { uploadSingleImage } from '../Middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', uploadSingleImage('photo'), Register);

export default router;