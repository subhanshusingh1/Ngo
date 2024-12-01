// import modules
import express from 'express'
const router = express.Router()

// import files
import {
    register,
    login,
    sendOtp,
    verifyOtp,
    resetPassword,
    refreshToken,
    removeAdmin,
    updateAdminProfile,
    getProfileById,
    uploadProfileImage,
    getAllProfile
} from '../controllers/adminController.js'
import upload from '../config/multerConfig.js';
import protect from '../middlewares/authMiddleware.js';


// Routes
router.post('/register', register);
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);
router.post('/login', login);
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.get('/refresh-token', refreshToken)
router.delete('/:id', protect, removeAdmin)
router.put('/:id', protect,  updateAdminProfile)
router.get('/:id', protect, getProfileById)
router.get('/', protect, getAllProfile)

export default router