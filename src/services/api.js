const API_BASE_URL = 'http://localhost:5001/api';


const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // Get user profile
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Courses API
export const coursesAPI = {
  // Get all courses
  getAllCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get course by ID with lessons and quizzes
  getCourseById: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get lesson by ID
  getLessonById: async (lessonId) => {
    const response = await fetch(`${API_BASE_URL}/courses/lessons/${lessonId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user progress for a course
  getUserProgress: async (userId, courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Quiz API
export const quizAPI = {
  // Get quiz by ID with questions
  getQuizById: async (quizId) => {
    const response = await fetch(`${API_BASE_URL}/courses/quizzes/${quizId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Submit quiz answers
  submitQuizAnswers: async (quizId, answers) => {
    const response = await fetch(`${API_BASE_URL}/courses/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(answers)
    });
    return handleResponse(response);
  }
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

// Export default API object
const api = {
  auth: authAPI,
  courses: coursesAPI,
  quiz: quizAPI,
  healthCheck
};

export default api;