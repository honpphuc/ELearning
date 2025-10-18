import { API_URL } from '../config';

// Helper function to handle API requests and authentication
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Đã xảy ra lỗi khi gọi API');
    }
    if (response.status === 204) { // No Content
        return { success: true };
    }
    return response.json();
  } catch (error) {
    console.error(`Lỗi API tại ${method} ${endpoint}:`, error);
    throw error; // Re-throw để component có thể xử lý
  }
};

// --- Course Services ---
export const getCourseById = (courseId) => apiRequest(`/courses/${courseId}`);
export const getPopularCourses = () => apiRequest('/courses/popular');

// --- Enrollment Services ---
export const checkEnrollment = (courseId) => apiRequest(`/enrollments/check/${courseId}`);
export const getMyEnrollments = () => apiRequest('/enrollments/my-courses');
export const completeLesson = (courseId, lessonId) => 
  apiRequest('/enrollments/complete-lesson', 'PATCH', { courseId, lessonId });
export const completeQuiz = (courseId, quizId) => 
  apiRequest('/enrollments/complete-quiz', 'PATCH', { courseId, quizId });

// --- Admin Services ---
export const getAdminCourseById = (courseId) => apiRequest(`/admin/courses/${courseId}`);
export const updateCourseContent = (courseId, content) => 
  apiRequest(`/admin/courses/${courseId}`, 'PUT', content);

// --- Contact Service ---
export const submitContactForm = (formData) => 
  apiRequest('/contact', 'POST', formData); // Giả sử endpoint là /api/contact