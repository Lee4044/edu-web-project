import { getDatabase } from '../config/db.js';
import bcryptjs from 'bcryptjs';

const insertSampleData = async () => {
  try {
    const db = getDatabase();
    
    console.log('🔄 Inserting sample data...');
    
    // Check if data already exists
    const [userRows] = await db.query('SELECT COUNT(*) as count FROM app_users');
    if (userRows[0].count > 0) {
      console.log('📊 Sample data already exists, skipping insertion');
      return;
    }

    // Insert sample users
    const users = [
      {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123'
      },
      {
        first_name: 'Mike',
        last_name: 'Johnson',
        username: 'mikejohnson',
        email: 'mike@example.com',
        password: 'password123'
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      await db.query(
        'INSERT INTO app_users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
        [user.first_name, user.last_name, user.username, user.email, hashedPassword]
      );
    }
    console.log('✅ Sample users inserted');

    // Insert sample posts (from coworker's schema)
    const posts = [
      {
        user_id: 1,
        title: 'Welcome to the Platform',
        content: 'This is my first post on this educational platform!'
      },
      {
        user_id: 2,
        title: 'Learning Progress',
        content: 'Just completed my first course. Very excited to continue learning!'
      }
    ];

    for (const post of posts) {
      await db.query(
        'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
        [post.user_id, post.title, post.content]
      );
    }
    console.log('✅ Sample posts inserted');

    const courses = [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming language',
        difficulty_level: 'Beginner',
        duration_hours: 40,
        image_url: 'https://example.com/js-course.jpg'
      },
      {
        title: 'React Fundamentals',
        description: 'Master the basics of React library for building user interfaces',
        difficulty_level: 'Intermediate',
        duration_hours: 60,
        image_url: 'https://example.com/react-course.jpg'
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js',
        difficulty_level: 'Intermediate',
        duration_hours: 80,
        image_url: 'https://example.com/nodejs-course.jpg'
      },
      {
        title: 'Database Design',
        description: 'Learn to design efficient and scalable databases',
        difficulty_level: 'Advanced',
        duration_hours: 50,
        image_url: 'https://example.com/db-course.jpg'
      }
    ];

    for (const course of courses) {
      await db.query(
        'INSERT INTO courses (title, description, difficulty_level, duration_hours, image_url) VALUES (?, ?, ?, ?, ?)',
        [course.title, course.description, course.difficulty_level, course.duration_hours, course.image_url]
      );
    }
    console.log('✅ Sample courses inserted');

    const lessons = [
      {
        course_id: 1,
        title: 'Variables and Data Types',
        content: 'Learn about JavaScript variables, numbers, strings, and booleans',
        lesson_order: 1,
        duration_minutes: 45,
        video_url: 'https://example.com/js-lesson1'
      },
      {
        course_id: 1,
        title: 'Functions and Scope',
        content: 'Understanding JavaScript functions and variable scope',
        lesson_order: 2,
        duration_minutes: 60,
        video_url: 'https://example.com/js-lesson2'
      },

      {
        course_id: 2,
        title: 'Components and JSX',
        content: 'Introduction to React components and JSX syntax',
        lesson_order: 1,
        duration_minutes: 50,
        video_url: 'https://example.com/react-lesson1'
      },
      {
        course_id: 2,
        title: 'State and Props',
        content: 'Managing component state and passing props',
        lesson_order: 2,
        duration_minutes: 55,
        video_url: 'https://example.com/react-lesson2'
      }
    ];

    for (const lesson of lessons) {
      await db.query(
        'INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes, video_url) VALUES (?, ?, ?, ?, ?, ?)',
        [lesson.course_id, lesson.title, lesson.content, lesson.lesson_order, lesson.duration_minutes, lesson.video_url]
      );
    }
    console.log('✅ Sample lessons inserted');

    const quizzes = [
      {
        course_id: 1,
        title: 'JavaScript Basics Quiz',
        description: 'Test your knowledge of JavaScript fundamentals',
        total_questions: 3,
        time_limit_minutes: 15
      },
      {
        course_id: 2,
        title: 'React Components Quiz',
        description: 'Quiz about React components and JSX',
        total_questions: 2,
        time_limit_minutes: 10
      }
    ];

    for (const quiz of quizzes) {
      await db.query(
        'INSERT INTO quizzes (course_id, title, description, total_questions, time_limit_minutes) VALUES (?, ?, ?, ?, ?)',
        [quiz.course_id, quiz.title, quiz.description, quiz.total_questions, quiz.time_limit_minutes]
      );
    }
    console.log('✅ Sample quizzes inserted');

    const quizQuestions = [
      {
        quiz_id: 1,
        question_text: 'What is the correct way to declare a variable in JavaScript?',
        question_type: 'multiple_choice',
        correct_answer: 'let myVariable = 5;',
        options: JSON.stringify([
          'var myVariable = 5;',
          'let myVariable = 5;',
          'const myVariable = 5;',
          'variable myVariable = 5;'
        ]),
        points: 1,
        question_order: 1
      },
      {
        quiz_id: 1,
        question_text: 'JavaScript is a compiled language.',
        question_type: 'true_false',
        correct_answer: 'false',
        options: JSON.stringify(['true', 'false']),
        points: 1,
        question_order: 2
      },
      {
        quiz_id: 1,
        question_text: 'What does DOM stand for?',
        question_type: 'short_answer',
        correct_answer: 'Document Object Model',
        options: null,
        points: 2,
        question_order: 3
      },
      {
        quiz_id: 2,
        question_text: 'What is JSX?',
        question_type: 'multiple_choice',
        correct_answer: 'A syntax extension for JavaScript',
        options: JSON.stringify([
          'A new programming language',
          'A syntax extension for JavaScript',
          'A database query language',
          'A CSS framework'
        ]),
        points: 1,
        question_order: 1
      },
      {
        quiz_id: 2,
        question_text: 'React components must return a single parent element.',
        question_type: 'true_false',
        correct_answer: 'true',
        options: JSON.stringify(['true', 'false']),
        points: 1,
        question_order: 2
      }
    ];

    for (const question of quizQuestions) {
      await db.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, question_type, correct_answer, options, points, question_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [question.quiz_id, question.question_text, question.question_type, question.correct_answer, question.options, question.points, question.question_order]
      );
    }
    console.log('✅ Sample quiz questions inserted');

    const quizAnswers = [
      {
        user_id: 1,
        quiz_id: 1,
        question_id: 1,
        user_answer: 'let myVariable = 5;',
        is_correct: true,
        points_earned: 1
      },
      {
        user_id: 1,
        quiz_id: 1,
        question_id: 2,
        user_answer: 'false',
        is_correct: true,
        points_earned: 1
      },
      {
        user_id: 1,
        quiz_id: 1,
        question_id: 3,
        user_answer: 'Document Object Model',
        is_correct: true,
        points_earned: 2
      },
      {
        user_id: 2,
        quiz_id: 2,
        question_id: 4,
        user_answer: 'A syntax extension for JavaScript',
        is_correct: true,
        points_earned: 1
      },
      {
        user_id: 2,
        quiz_id: 2,
        question_id: 5,
        user_answer: 'false',
        is_correct: false,
        points_earned: 0
      }
    ];

    for (const answer of quizAnswers) {
      await db.query(
        'INSERT INTO quiz_answers (user_id, quiz_id, question_id, user_answer, is_correct, points_earned) VALUES (?, ?, ?, ?, ?, ?)',
        [answer.user_id, answer.quiz_id, answer.question_id, answer.user_answer, answer.is_correct, answer.points_earned]
      );
    }
    console.log('✅ Sample quiz answers inserted');

    const userProgress = [
      {
        user_id: 1,
        course_id: 1,
        lesson_id: 1,
        progress_type: 'lesson_completed',
        completion_percentage: 25.00,
        score: 0
      },
      {
        user_id: 1,
        course_id: 1,
        quiz_id: 1,
        progress_type: 'quiz_completed',
        completion_percentage: 50.00,
        score: 4
      },
      {
        user_id: 2,
        course_id: 2,
        lesson_id: 3,
        progress_type: 'lesson_completed',
        completion_percentage: 25.00,
        score: 0
      }
    ];

    for (const progress of userProgress) {
      await db.query(
        'INSERT INTO user_progress (user_id, course_id, lesson_id, quiz_id, progress_type, completion_percentage, score) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [progress.user_id, progress.course_id, progress.lesson_id, progress.quiz_id, progress.progress_type, progress.completion_percentage, progress.score]
      );
    }
    console.log('✅ Sample user progress inserted');

    console.log('🎉 All sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    throw error;
  }
};

export { insertSampleData };