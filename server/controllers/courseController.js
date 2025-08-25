import { getDatabase } from '../config/db.js';

const getAllCourses = async (req, res) => {
  try {
    const db = await getDatabase();
    const courses = await db.all(`
      SELECT 
        c.*,
        COUNT(l.id) as lesson_count,
        COUNT(DISTINCT q.id) as quiz_count
      FROM courses c
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN quizzes q ON c.id = q.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    
    return res.status(200).json({
      success: true,
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get course by ID with lessons and quizzes
const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  
  try {
    const db = await getDatabase();
    
    // Get course details
    const course = await db.get('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Get lessons for this course
    const lessons = await db.all(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC',
      [courseId]
    );
    
    // Get quizzes for this course
    const quizzes = await db.all(
      'SELECT * FROM quizzes WHERE course_id = ? ORDER BY created_at ASC',
      [courseId]
    );
    
    return res.status(200).json({
      success: true,
      data: {
        course: {
          ...course,
          lessons,
          quizzes
        }
      }
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get lesson by ID
const getLessonById = async (req, res) => {
  const { lessonId } = req.params;
  
  try {
    const db = await getDatabase();
    
    const lesson = await db.get(
      `SELECT l.*, c.title as course_title 
       FROM lessons l 
       JOIN courses c ON l.course_id = c.id 
       WHERE l.id = ?`,
      [lessonId]
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { lesson }
    });
  } catch (error) {
    console.error('Get lesson by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get quiz by ID with questions
const getQuizById = async (req, res) => {
  const { quizId } = req.params;
  
  try {
    const db = await getDatabase();
    
    // Get quiz details
    const quiz = await db.get(
      `SELECT q.*, c.title as course_title 
       FROM quizzes q 
       JOIN courses c ON q.course_id = c.id 
       WHERE q.id = ?`,
      [quizId]
    );
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Get quiz questions
    const questions = await db.all(
      `SELECT id, question_text, question_type, options, points, question_order 
       FROM quiz_questions 
       WHERE quiz_id = ? 
       ORDER BY question_order ASC`,
      [quizId]
    );
    
    // Parse options for multiple choice questions
    const questionsWithParsedOptions = questions.map(question => ({
      ...question,
      options: question.options ? JSON.parse(question.options) : null
    }));
    
    return res.status(200).json({
      success: true,
      data: {
        quiz: {
          ...quiz,
          questions: questionsWithParsedOptions
        }
      }
    });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Submit quiz answers
const submitQuizAnswers = async (req, res) => {
  const { quizId } = req.params;
  const { userId, answers } = req.body;
  
  if (!userId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: 'User ID and answers array are required'
    });
  }
  
  try {
    const db = await getDatabase();
    
    // Get quiz questions with correct answers
    const questions = await db.all(
      'SELECT id, correct_answer, points FROM quiz_questions WHERE quiz_id = ?',
      [quizId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    let totalScore = 0;
    let correctAnswers = 0;
    
    // Process each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;
      
      const isCorrect = answer.userAnswer === question.correct_answer;
      const pointsEarned = isCorrect ? question.points : 0;
      
      if (isCorrect) {
        correctAnswers++;
        totalScore += pointsEarned;
      }
      
      // Insert/update user answer
      await db.run(
        `INSERT OR REPLACE INTO quiz_answers 
         (user_id, quiz_id, question_id, user_answer, is_correct, points_earned) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, quizId, answer.questionId, answer.userAnswer, isCorrect ? 1 : 0, pointsEarned]
      );
    }
    
    // Record user progress
    await db.run(
      `INSERT OR REPLACE INTO user_progress 
       (user_id, course_id, quiz_id, progress_type, completion_percentage, score) 
       VALUES (?, (SELECT course_id FROM quizzes WHERE id = ?), ?, 'quiz_completed', 100.0, ?)`,
      [userId, quizId, quizId, totalScore]
    );
    
    return res.status(200).json({
      success: true,
      data: {
        totalScore,
        correctAnswers,
        totalQuestions: questions.length,
        percentage: Math.round((correctAnswers / questions.length) * 100)
      }
    });
  } catch (error) {
    console.error('Submit quiz answers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user progress
const getUserProgress = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const db = await getDatabase();
    
    const progress = await db.all(
      `SELECT up.*, c.title as course_title, l.title as lesson_title, q.title as quiz_title
       FROM user_progress up
       JOIN courses c ON up.course_id = c.id
       LEFT JOIN lessons l ON up.lesson_id = l.id
       LEFT JOIN quizzes q ON up.quiz_id = q.id
       WHERE up.user_id = ?
       ORDER BY up.completed_at DESC`,
      [userId]
    );
    
    return res.status(200).json({
      success: true,
      data: { progress }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  getAllCourses,
  getCourseById,
  getLessonById,
  getQuizById,
  submitQuizAnswers,
  getUserProgress
};