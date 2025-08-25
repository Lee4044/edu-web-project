const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const coursesAPI = {
  getAllCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getCourseById: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getLessonById: async (lessonId) => {
    const response = await fetch(`${API_BASE_URL}/courses/lessons/${lessonId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getUserProgress: async (userId, courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const quizAPI = {
  getQuizById: async (quizId) => {
    const response = await fetch(`${API_BASE_URL}/courses/quizzes/${quizId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  submitQuizAnswers: async (quizId, answers) => {
    const response = await fetch(`${API_BASE_URL}/courses/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(answers)
    });
    return handleResponse(response);
  }
};

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

const api = {
  auth: authAPI,
  courses: coursesAPI,
  quiz: quizAPI,
  healthCheck
};

export default api;