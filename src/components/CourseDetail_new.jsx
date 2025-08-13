import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Scenario1 from './Scenario1';
import Scenario2 from './Scenario2';
import Scenario3 from './Scenario3';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set([0, 1, 2]));

  
  const courseData = {
    'word-basics': {
      title: 'Word Microsoft Basics',
      description: 'Master the fundamentals of Microsoft Word with hands-on exercises and real-world examples.',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
      instructor: 'Dr. Ahmed Hassan',
      duration: '4 hours',
      level: 'Beginner',
      lessons: [
        {
          id: 0,
          title: 'انشاء مستند جديد باستخدام Word',
          duration: '15 min',
          type: 'video',
          content: 'Welcome to Microsoft Word! In this lesson, we\'ll explore the interface and basic features.'
        },
        {
          id: 1,
          title: 'انشاء جدول باستخدام Word',
          duration: '20 min',
          type: 'interactive',
          content: 'Learn how to create, save, and format your first Word document.'
        },
        {
          id: 2,
          title: 'الكتابه داخل الجدول باستخدام Word',
          duration: '25 min',
          type: 'video',
          content: 'Master text formatting, fonts, colors, and paragraph styles.'
        },
        {
          id: 3,
          title: 'Working with Images and Tables',
          duration: '30 min',
          type: 'interactive',
          content: 'Insert and format images, create tables, and manage layouts.'
        }
      ]
    }
  };

  return (
    <div>Course Detail Component</div>
  );
};

export default CourseDetail;
