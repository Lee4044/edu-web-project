import { pool } from '../config/db.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await pool.query(`
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
      courses
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get course by ID with lessons and quizzes
export const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  
  try {
    // Get course details
    const [courseRows] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    const course = courseRows[0];
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Get lessons for this course
    const [lessons] = await pool.query(`
      SELECT * FROM lessons 
      WHERE course_id = ? 
      ORDER BY lesson_order ASC
    `, [courseId]);
    
    // Get quizzes for this course
    const [quizzes] = await pool.query(`
      SELECT 
        q.*,
        COUNT(qq.id) as question_count
      FROM quizzes q
      LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
      WHERE q.course_id = ?
      GROUP BY q.id
      ORDER BY q.created_at ASC
    `, [courseId]);
    
    return res.status(200).json({
      success: true,
      course: {
        ...course,
        lessons,
        quizzes
      }
    });
  } catch (error) {
    console.error('❌ Error fetching course:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching course details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get lesson by ID
export const getLessonById = async (req, res) => {
  const { lessonId } = req.params;
  
  try {
    const [lessonRows] = await pool.query(`
      SELECT 
        l.*,
        c.title as course_title,
        c.id as course_id
      FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = ?
    `, [lessonId]);
    
    const lesson = lessonRows[0];
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('❌ Error fetching lesson:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching lesson details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get quiz by ID with questions
export const getQuizById = async (req, res) => {
  const { quizId } = req.params;
  
  try {
    // Get quiz details
    const [quizRows] = await pool.query(`
      SELECT 
        q.*,
        c.title as course_title
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = ?
    `, [quizId]);
    
    const quiz = quizRows[0];
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Get quiz questions
    const [questions] = await pool.query(`
      SELECT 
        id,
        question_text,
        question_type,
        options,
        points,
        question_order
      FROM quiz_questions 
      WHERE quiz_id = ? 
      ORDER BY question_order ASC
    `, [quizId]);
    
    // Parse JSON options for each question
    const questionsWithParsedOptions = questions.map(question => ({
      ...question,
      options: question.options ? JSON.parse(question.options) : null
    }));
    
    return res.status(200).json({
      success: true,
      quiz: {
        ...quiz,
        questions: questionsWithParsedOptions
      }
    });
  } catch (error) {
    console.error('❌ Error fetching quiz:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching quiz details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Submit quiz answers
export const submitQuizAnswers = async (req, res) => {
  const { quizId } = req.params;
  const { userId, answers } = req.body;
  
  if (!userId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data'
    });
  }
  
  try {
    // Get quiz questions with correct answers
    const [questions] = await pool.query(`
      SELECT id, correct_answer, points
      FROM quiz_questions 
      WHERE quiz_id = ?
    `, [quizId]);
    
    let totalScore = 0;
    let correctAnswers = 0;
    
    // Process each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;
      
      const isCorrect = answer.userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
      const pointsEarned = isCorrect ? question.points : 0;
      
      if (isCorrect) {
        correctAnswers++;
        totalScore += pointsEarned;
      }
      
      // Insert or update quiz answer
      await pool.query(`
        INSERT INTO quiz_answers (user_id, quiz_id, question_id, user_answer, is_correct, points_earned)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        user_answer = VALUES(user_answer),
        is_correct = VALUES(is_correct),
        points_earned = VALUES(points_earned),
        answered_at = CURRENT_TIMESTAMP
      `, [userId, quizId, answer.questionId, answer.userAnswer, isCorrect, pointsEarned]);
    }
    
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return res.status(200).json({
      success: true,
      result: {
        totalQuestions,
        correctAnswers,
        totalScore,
        percentage: Math.round(percentage * 100) / 100
      }
    });
  } catch (error) {
    console.error('❌ Error submitting quiz answers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting quiz answers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user progress for a course
export const getUserProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  
  try {
    const [progressRows] = await pool.query(`
      SELECT 
        up.*,
        l.title as lesson_title,
        l.lesson_order
      FROM user_progress up
      LEFT JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.course_id = ?
      ORDER BY l.lesson_order ASC
    `, [userId, courseId]);
    
    return res.status(200).json({
      success: true,
      progress: progressRows
    });
  } catch (error) {
    console.error('❌ Error fetching user progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};