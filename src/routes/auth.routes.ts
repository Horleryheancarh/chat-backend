import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth';
// import { authRateLimiter } from '../middleware/rate.limit';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);

export default router;
