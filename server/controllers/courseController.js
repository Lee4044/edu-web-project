import { getDatabase } from '../config/db.js';


const getAllCourses = async (req, res) => {
  try {
    const db = getDatabase();
    const [courses] = await db.query(`
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
    // Get course details
    const db = getDatabase();
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const course = courses[0];
    
    // Get lessons for this course
    const [lessons] = await db.query(`
      SELECT * FROM lessons 
      WHERE course_id = ? 
      ORDER BY lesson_order ASC
    `, [courseId]);
    
    // Get quizzes for this course
    const [quizzes] = await db.query(`
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
    const db = getDatabase();
    const [lessons] = await db.query(`
      SELECT 
        l.*,
        c.title as course_title,
        c.id as course_id
      FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = ?
    `, [lessonId]);
    
    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        lesson: lessons[0]
      }
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
    // Get quiz details
    const db = getDatabase();
    const [quizzes] = await db.query(`
      SELECT 
        q.*,
        c.title as course_title
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = ?
    `, [quizId]);
    
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const quiz = quizzes[0];
    
    // Get quiz questions
    const [questions] = await db.query(`
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
      message: 'Invalid request data'
    });
  }
  
  try {
    // Get quiz questions with correct answers
    const db = getDatabase();
    const [questions] = await db.query(`
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
      await db.query(`
        INSERT INTO quiz_answers (user_id, quiz_id, question_id, user_answer, is_correct, points_earned, answered_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        user_answer = VALUES(user_answer),
        is_correct = VALUES(is_correct),
        points_earned = VALUES(points_earned),
        answered_at = VALUES(answered_at)
      `, [userId, quizId, answer.questionId, answer.userAnswer, isCorrect, pointsEarned]);
    }
    
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return res.status(200).json({
      success: true,
      data: {
        result: {
          totalQuestions,
          correctAnswers,
          totalScore,
          percentage: Math.round(percentage * 100) / 100
        }
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


const getUserProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  
  try {
    const db = getDatabase();
    const [progressRows] = await db.query(`
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
      data: {
        progress: progressRows
      }
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