// API Configuration
// const API_BASE_URL = 'https://carevo-backend.onrender.com';
const API_BASE_URL = 'http://localhost:5001';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  USER: `${API_BASE_URL}/user`,
  USER_UPDATE: `${API_BASE_URL}/user/update`,
  AI: `${API_BASE_URL}/ai`,
  MENTAL_HEALTH_CHAT: `${API_BASE_URL}/mental_health_chat`,
  ACADEMIC_PLANNING: `${API_BASE_URL}/academic-planning`,
  SAVE_STUDY_PLAN: `${API_BASE_URL}/save-study-plan`,
  LOGOUT: `${API_BASE_URL}/logout`,
  AUTH_STATUS: `${API_BASE_URL}/auth/status`,
  CGPA_UPDATE: `${API_BASE_URL}/user/cgpa`,
  PROJECTS_UPDATE: `${API_BASE_URL}/user/projects`,
  EXPERIENCES_UPDATE: `${API_BASE_URL}/user/experiences`,
  CERTIFICATIONS_UPDATE: `${API_BASE_URL}/user/certifications`,
  TERM_DATA_UPDATE: `${API_BASE_URL}/user/term-data`,
  EXTRACURRICULAR_UPDATE: `${API_BASE_URL}/user/extracurricular`,
  SUBJECTS_UPDATE: `${API_BASE_URL}/user/subjects`,
  STUDY_PLAN: "http://localhost:5001/user/study-plan",
  BACKEND: "http://localhost:5001", // or your backend URL
  QUIZ_RESULT: "http://localhost:5001/user/quiz-result",
};

export default API_BASE_URL;