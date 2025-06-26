import express from 'express';
import { isAuthenticated, login, logout, resetPassword, sendResetOtp, sendVerifyOtp, SignUp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.middleware.js';
const router = express.Router();

router.post('/login', login )
router.post('/signup', SignUp)
router.post('/logout', logout)
router.post('/send-verify-otp',userAuth, sendVerifyOtp)
router.post('/verify-account', userAuth, verifyEmail)
router.get('/is-auth', userAuth, isAuthenticated)
router.post('/send-reset-otp', sendResetOtp)
router.post('/reset-password', resetPassword)


export default router;