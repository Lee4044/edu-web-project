import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  getLessonById, 
  getUserProgress,
  getQuizById,
  submitQuizAnswers 
} from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/lessons/:id', getLessonById);
router.get('/:courseId/progress', authenticateToken, getUserProgress);
router.get('/quiz/:id', getQuizById);
router.post('/quiz/:id/submit', authenticateToken, submitQuizAnswers);

router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Course service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;