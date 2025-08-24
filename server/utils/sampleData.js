import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// Sample Users Data
const sampleUsers = [
  {
    first_name: 'Ahmed',
    last_name: 'Hassan',
    username: 'ahmed_hassan',
    email: 'ahmed@example.com',
    password: 'password123'
  },
  {
    first_name: 'Fatima',
    last_name: 'Ali',
    username: 'fatima_ali',
    email: 'fatima@example.com',
    password: 'password123'
  },
  {
    first_name: 'Omar',
    last_name: 'Mohamed',
    username: 'omar_mohamed',
    email: 'omar@example.com',
    password: 'password123'
  },
  {
    first_name: 'Aisha',
    last_name: 'Ibrahim',
    username: 'aisha_ibrahim',
    email: 'aisha@example.com',
    password: 'password123'
  },
  {
    first_name: 'Khalid',
    last_name: 'Abdullah',
    username: 'khalid_abdullah',
    email: 'khalid@example.com',
    password: 'password123'
  }
];

// Sample Courses Data
const sampleCourses = [
  {
    title: 'Microsoft Word Basics',
    description: 'Learn the fundamentals of Microsoft Word including document creation, formatting, and basic features.',
    icon: '/word-icon.svg',
    difficulty_level: 'Beginner',
    estimated_duration: '2 hours'
  },
  {
    title: 'Microsoft Excel Fundamentals',
    description: 'Master the basics of Microsoft Excel including spreadsheets, formulas, and data analysis.',
    icon: '/excel-icon.svg',
    difficulty_level: 'Beginner',
    estimated_duration: '3 hours'
  },
  {
    title: 'Advanced Word Processing',
    description: 'Advanced Microsoft Word techniques including mail merge, macros, and document automation.',
    icon: '/word-icon.svg',
    difficulty_level: 'Advanced',
    estimated_duration: '4 hours'
  }
];

// Sample Lessons Data (will be inserted after courses)
const sampleLessons = [
  // Word Basics Course Lessons
  {
    course_id: 1,
    title: 'Getting Started with Word',
    content: 'Introduction to Microsoft Word interface and basic navigation.',
    lesson_order: 1,
    duration: '15 minutes',
    video_url: null
  },
  {
    course_id: 1,
    title: 'Creating Your First Document',
    content: 'Learn how to create, save, and open documents in Microsoft Word.',
    lesson_order: 2,
    duration: '20 minutes',
    video_url: null
  },
  {
    course_id: 1,
    title: 'Text Formatting Basics',
    content: 'Master basic text formatting including fonts, colors, and styles.',
    lesson_order: 3,
    duration: '25 minutes',
    video_url: null
  },
  {
    course_id: 1,
    title: 'Working with Images',
    content: 'Learn how to insert and format images in your documents.',
    lesson_order: 4,
    duration: '20 minutes',
    video_url: null
  },
  // Excel Fundamentals Course Lessons
  {
    course_id: 2,
    title: 'Excel Interface Overview',
    content: 'Get familiar with Excel\'s interface, ribbons, and basic navigation.',
    lesson_order: 1,
    duration: '20 minutes',
    video_url: null
  },
  {
    course_id: 2,
    title: 'Working with Cells and Data',
    content: 'Learn how to enter, edit, and format data in Excel cells.',
    lesson_order: 2,
    duration: '30 minutes',
    video_url: null
  },
  {
    course_id: 2,
    title: 'Basic Formulas and Functions',
    content: 'Introduction to Excel formulas and commonly used functions.',
    lesson_order: 3,
    duration: '35 minutes',
    video_url: null
  },
  // Advanced Word Course Lessons
  {
    course_id: 3,
    title: 'Document Templates and Styles',
    content: 'Create and use document templates and advanced styling techniques.',
    lesson_order: 1,
    duration: '40 minutes',
    video_url: null
  },
  {
    course_id: 3,
    title: 'Mail Merge Techniques',
    content: 'Master mail merge for creating personalized documents.',
    lesson_order: 2,
    duration: '45 minutes',
    video_url: null
  }
];

// Sample Quizzes Data
const sampleQuizzes = [
  {
    course_id: 1,
    lesson_id: null,
    title: 'Word Basics Assessment',
    description: 'Test your knowledge of Microsoft Word basics',
    total_questions: 5,
    time_limit: 15
  },
  {
    course_id: 2,
    lesson_id: null,
    title: 'Excel Fundamentals Quiz',
    description: 'Assess your understanding of Excel fundamentals',
    total_questions: 4,
    time_limit: 12
  },
  {
    course_id: 3,
    lesson_id: null,
    title: 'Advanced Word Features Test',
    description: 'Challenge yourself with advanced Word features',
    total_questions: 3,
    time_limit: 10
  }
];

// Sample Quiz Questions Data
const sampleQuizQuestions = [
  // Word Basics Quiz Questions
  {
    quiz_id: 1,
    question_text: 'What is the default file extension for Microsoft Word documents?',
    question_type: 'multiple_choice',
    correct_answer: '.docx',
    options: JSON.stringify(['.doc', '.docx', '.txt', '.pdf']),
    points: 2,
    question_order: 1
  },
  {
    quiz_id: 1,
    question_text: 'Which ribbon tab contains the Save command?',
    question_type: 'multiple_choice',
    correct_answer: 'File',
    options: JSON.stringify(['Home', 'Insert', 'File', 'Review']),
    points: 2,
    question_order: 2
  },
  {
    quiz_id: 1,
    question_text: 'True or False: You can change font color in Microsoft Word.',
    question_type: 'true_false',
    correct_answer: 'True',
    options: JSON.stringify(['True', 'False']),
    points: 1,
    question_order: 3
  },
  {
    quiz_id: 1,
    question_text: 'What keyboard shortcut is used to copy text?',
    question_type: 'multiple_choice',
    correct_answer: 'Ctrl+C',
    options: JSON.stringify(['Ctrl+C', 'Ctrl+V', 'Ctrl+X', 'Ctrl+Z']),
    points: 2,
    question_order: 4
  },
  {
    quiz_id: 1,
    question_text: 'Which feature allows you to check spelling and grammar?',
    question_type: 'multiple_choice',
    correct_answer: 'Review tab',
    options: JSON.stringify(['Home tab', 'Insert tab', 'Review tab', 'View tab']),
    points: 2,
    question_order: 5
  },
  // Excel Quiz Questions
  {
    quiz_id: 2,
    question_text: 'What is a cell in Excel?',
    question_type: 'multiple_choice',
    correct_answer: 'Intersection of row and column',
    options: JSON.stringify(['A row', 'A column', 'Intersection of row and column', 'A worksheet']),
    points: 2,
    question_order: 1
  },
  {
    quiz_id: 2,
    question_text: 'Which symbol starts a formula in Excel?',
    question_type: 'multiple_choice',
    correct_answer: '=',
    options: JSON.stringify(['=', '+', '-', '*']),
    points: 2,
    question_order: 2
  },
  {
    quiz_id: 2,
    question_text: 'True or False: Excel can perform mathematical calculations.',
    question_type: 'true_false',
    correct_answer: 'True',
    options: JSON.stringify(['True', 'False']),
    points: 1,
    question_order: 3
  },
  {
    quiz_id: 2,
    question_text: 'What function adds up a range of cells?',
    question_type: 'multiple_choice',
    correct_answer: 'SUM',
    options: JSON.stringify(['SUM', 'ADD', 'TOTAL', 'PLUS']),
    points: 3,
    question_order: 4
  },
  // Advanced Word Quiz Questions
  {
    quiz_id: 3,
    question_text: 'What is mail merge used for?',
    question_type: 'multiple_choice',
    correct_answer: 'Creating personalized documents',
    options: JSON.stringify(['Sending emails', 'Creating personalized documents', 'Merging files', 'Combining documents']),
    points: 3,
    question_order: 1
  },
  {
    quiz_id: 3,
    question_text: 'Which feature helps maintain consistent formatting?',
    question_type: 'multiple_choice',
    correct_answer: 'Styles',
    options: JSON.stringify(['Themes', 'Styles', 'Templates', 'Formats']),
    points: 3,
    question_order: 2
  },
  {
    quiz_id: 3,
    question_text: 'True or False: Macros can automate repetitive tasks in Word.',
    question_type: 'true_false',
    correct_answer: 'True',
    options: JSON.stringify(['True', 'False']),
    points: 2,
    question_order: 3
  }
];

// Sample Quiz Answers (user responses)
const sampleQuizAnswers = [
  // User 1 answers for Word Quiz
  { user_id: 1, quiz_id: 1, question_id: 1, user_answer: '.docx', is_correct: true, points_earned: 2 },
  { user_id: 1, quiz_id: 1, question_id: 2, user_answer: 'File', is_correct: true, points_earned: 2 },
  { user_id: 1, quiz_id: 1, question_id: 3, user_answer: 'True', is_correct: true, points_earned: 1 },
  { user_id: 1, quiz_id: 1, question_id: 4, user_answer: 'Ctrl+V', is_correct: false, points_earned: 0 },
  { user_id: 1, quiz_id: 1, question_id: 5, user_answer: 'Review tab', is_correct: true, points_earned: 2 },
  
  // User 2 answers for Excel Quiz
  { user_id: 2, quiz_id: 2, question_id: 6, user_answer: 'Intersection of row and column', is_correct: true, points_earned: 2 },
  { user_id: 2, quiz_id: 2, question_id: 7, user_answer: '=', is_correct: true, points_earned: 2 },
  { user_id: 2, quiz_id: 2, question_id: 8, user_answer: 'True', is_correct: true, points_earned: 1 },
  { user_id: 2, quiz_id: 2, question_id: 9, user_answer: 'ADD', is_correct: false, points_earned: 0 },
  
  // User 3 answers for Advanced Word Quiz
  { user_id: 3, quiz_id: 3, question_id: 10, user_answer: 'Creating personalized documents', is_correct: true, points_earned: 3 },
  { user_id: 3, quiz_id: 3, question_id: 11, user_answer: 'Styles', is_correct: true, points_earned: 3 },
  { user_id: 3, quiz_id: 3, question_id: 12, user_answer: 'False', is_correct: false, points_earned: 0 }
];

const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data...');
    
    // Check if data already exists
    const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('ℹ️  Sample data already exists, skipping insertion.');
      return;
    }
    
    // Insert Users
    console.log('👥 Inserting sample users...');
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
        [user.first_name, user.last_name, user.username, user.email, hashedPassword]
      );
    }
    
    // Insert Courses
    console.log('📚 Inserting sample courses...');
    for (const course of sampleCourses) {
      await pool.query(
        'INSERT INTO courses (title, description, icon, difficulty_level, estimated_duration) VALUES (?, ?, ?, ?, ?)',
        [course.title, course.description, course.icon, course.difficulty_level, course.estimated_duration]
      );
    }
    
    // Insert Lessons
    console.log('📖 Inserting sample lessons...');
    for (const lesson of sampleLessons) {
      await pool.query(
        'INSERT INTO lessons (course_id, title, content, lesson_order, duration, video_url) VALUES (?, ?, ?, ?, ?, ?)',
        [lesson.course_id, lesson.title, lesson.content, lesson.lesson_order, lesson.duration, lesson.video_url]
      );
    }
    
    // Insert Quizzes
    console.log('❓ Inserting sample quizzes...');
    for (const quiz of sampleQuizzes) {
      await pool.query(
        'INSERT INTO quizzes (course_id, lesson_id, title, description, total_questions, time_limit) VALUES (?, ?, ?, ?, ?, ?)',
        [quiz.course_id, quiz.lesson_id, quiz.title, quiz.description, quiz.total_questions, quiz.time_limit]
      );
    }
    
    // Insert Quiz Questions
    console.log('❔ Inserting sample quiz questions...');
    for (const question of sampleQuizQuestions) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, question_type, correct_answer, options, points, question_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [question.quiz_id, question.question_text, question.question_type, question.correct_answer, question.options, question.points, question.question_order]
      );
    }
    
    // Insert Quiz Answers
    console.log('✅ Inserting sample quiz answers...');
    for (const answer of sampleQuizAnswers) {
      await pool.query(
        'INSERT INTO quiz_answers (user_id, quiz_id, question_id, user_answer, is_correct, points_earned) VALUES (?, ?, ?, ?, ?, ?)',
        [answer.user_id, answer.quiz_id, answer.question_id, answer.user_answer, answer.is_correct, answer.points_earned]
      );
    }
    
    console.log('✅ Sample data inserted successfully!');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
};

export default insertSampleData;