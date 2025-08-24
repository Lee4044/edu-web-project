import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getLessonById,
  getQuizById,
  submitQuizAnswers,
  getUserProgress
} from '../controllers/courseController.js';

const router = express.Router();

// Course Routes
router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.get('/:courseId/progress/:userId', getUserProgress);

// Lesson Routes
router.get('/lessons/:lessonId', getLessonById);

// Quiz Routes
router.get('/quizzes/:quizId', getQuizById);
router.post('/quizzes/:quizId/submit', submitQuizAnswers);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Course service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;