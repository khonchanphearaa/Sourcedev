import { Router } from 'express';
import { register, login, getMe, updateProfile, getAllUsers, updateUserRole, verifyEmail, resendVerification } from '../controllers/authController';
import { protect, requireAdmin } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

/* Role admin */
router.get('/users', protect, requireAdmin, getAllUsers);
router.put('/users/:id/role', protect, requireAdmin, updateUserRole);

export default router;