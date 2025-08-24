import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getAllCourses();
        if (response.success) {
          // Transform API data to match component expectations
          const transformedCourses = response.courses.map(course => ({
            id: course.id,
            title: course.title,
            image: course.icon || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
            progress: Math.floor(Math.random() * 100), // Placeholder progress
            status: ['Not Started', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
            lessons: 0, // Will be updated when we get lesson count
            completedLessons: 0,
            duration: course.estimated_duration || '2 hours',
            description: course.description,
            difficulty_level: course.difficulty_level
          }));
          setCourses(transformedCourses);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'var(--accent-color)';
      case 'In Progress':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  return (
    <div className="courses">
      <div className="courses-container">
        <div className="courses-header">
          <h1>My Courses</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="courses-stats">
          <div className="stat">
            <span className="stat-number">{courses.length}</span>
            <span className="stat-label">Available Courses</span>
          </div>
          <div className="stat">
            <span className="stat-number">{courses.filter(c => c.status === 'Completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">{courses.filter(c => c.status === 'In Progress').length}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        {loading && (
          <div className="loading-message">
            <p>Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error loading courses: {error}</p>
          </div>
        )}

        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-status" style={{backgroundColor: getStatusColor(course.status)}}>
                  {course.status}
                </div>
              </div>
              
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                
                <div className="course-info">
                  <div className="info-item">
                    <span className="info-icon">📚</span>
                    <span>{course.completedLessons}/{course.lessons} lessons</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-percentage">{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="course-actions">
                  <Link to={`/course/${course.id}`} className="continue-btn">
                    {course.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                  </Link>
                  {course.status === 'Completed' && (
                    <button className="certificate-btn">
                      📜 Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .courses {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem;
        }

        .courses-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .courses-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .courses-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .courses-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .courses-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .course-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .course-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .course-content {
          padding: 1.5rem;
        }

        .course-title {
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
        }

        .course-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .info-icon {
          font-size: 1rem;
        }

        .progress-section {
          margin-bottom: 1.5rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .progress-percentage {
          font-weight: bold;
          color: #1976d2;
        }

        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #1976d2 0%, #00bcd4 100%);
          transition: width 0.3s ease;
        }

        .course-actions {
          display: flex;
          gap: 1rem;
        }

        .continue-btn {
          flex: 1;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .certificate-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .certificate-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .courses {
            padding: 1rem;
          }

          .courses-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .course-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Courses;