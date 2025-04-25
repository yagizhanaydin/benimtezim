import express from 'express';
import { Register } from '../Controller/authController.js';
import { uploadSingleImage } from '../Middleware/uploadMiddleware.js';
import { Login } from '../Controller/authController.js';


const router = express.Router();

router.post('/register', uploadSingleImage('photo'), Register);
router.post('/login', Login);
export default router;