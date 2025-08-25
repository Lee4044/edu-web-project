import { getDatabase } from '../config/db.js';
import bcryptjs from 'bcryptjs';

const insertSampleData = async () => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 Inserting sample data...');
    
    // Check if data already exists
    const userCount = await db.get('SELECT COUNT(*) as count FROM app_users');
    if (userCount.count > 0) {
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
      await db.run(
        'INSERT INTO app_users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
        [user.first_name, user.last_name, user.username, user.email, hashedPassword]
      );
    }
    console.log('✅ Sample users inserted');

    // Insert sample posts
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
      await db.run(
        'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
        [post.user_id, post.title, post.content]
      );
    }
    console.log('✅ Sample posts inserted');

    // Insert sample courses
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
      await db.run(
        'INSERT INTO courses (title, description, difficulty_level, duration_hours, image_url) VALUES (?, ?, ?, ?, ?)',
        [course.title, course.description, course.difficulty_level, course.duration_hours, course.image_url]
      );
    }
    console.log('✅ Sample courses inserted');

    // Insert sample lessons
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
      await db.run(
        'INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes, video_url) VALUES (?, ?, ?, ?, ?, ?)',
        [lesson.course_id, lesson.title, lesson.content, lesson.lesson_order, lesson.duration_minutes, lesson.video_url]
      );
    }
    console.log('✅ Sample lessons inserted');

    // Insert sample quizzes
    const quizzes = [
      {
        course_id: 1,
        title: 'JavaScript Basics Quiz',
        description: 'Test your knowledge of JavaScript fundamentals',
        total_questions: 5,
        time_limit_minutes: 15
      },
      {
        course_id: 2,
        title: 'React Components Quiz',
        description: 'Quiz on React components and JSX',
        total_questions: 4,
        time_limit_minutes: 10
      }
    ];

    for (const quiz of quizzes) {
      await db.run(
        'INSERT INTO quizzes (course_id, title, description, total_questions, time_limit_minutes) VALUES (?, ?, ?, ?, ?)',
        [quiz.course_id, quiz.title, quiz.description, quiz.total_questions, quiz.time_limit_minutes]
      );
    }
    console.log('✅ Sample quizzes inserted');

    // Insert sample quiz questions
    const quizQuestions = [
      {
        quiz_id: 1,
        question_text: 'What is the correct way to declare a variable in JavaScript?',
        question_type: 'multiple_choice',
        options: JSON.stringify(['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;']),
        correct_answer: 'var x = 5;',
        points: 1,
        question_order: 1
      },
      {
        quiz_id: 1,
        question_text: 'JavaScript is a case-sensitive language.',
        question_type: 'true_false',
        options: JSON.stringify(['True', 'False']),
        correct_answer: 'True',
        points: 1,
        question_order: 2
      }
    ];

    for (const question of quizQuestions) {
      await db.run(
        'INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, question_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [question.quiz_id, question.question_text, question.question_type, question.options, question.correct_answer, question.points, question.question_order]
      );
    }
    console.log('✅ Sample quiz questions inserted');

    // Insert sample user progress
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
      await db.run(
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