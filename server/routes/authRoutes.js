import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';

const router = express.Router();

// Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:userId', getProfile);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;