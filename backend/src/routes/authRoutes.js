import express from 'express';
import * as authController from '../controller/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/verify', authController.verifyPhone);
router.post('/resend-code', authController.resendCode);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);

export default router;

