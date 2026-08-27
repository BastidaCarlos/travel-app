import { Router } from "express";
import { 
    register, 
    login, 
    googleLogin, 
    getMe, 
    updateProfile,
    forgotPassword,
    resetPassword
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

router.get('/me', verifyToken, getMe);

router.put('/profile', verifyToken, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;