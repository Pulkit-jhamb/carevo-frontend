// API Configuration
// const API_BASE_URL = 'https://carevo-backend.onrender.com';
const API_BASE_URL = 'http://localhost:5001';
// const API_BASE_URL = 'https://carevo-backend-8vv2.onrender.com/';


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
  STUDY_PLAN: `${API_BASE_URL}/user/study-plan`,
  BACKEND: API_BASE_URL,
  QUIZ_RESULT: `${API_BASE_URL}/user/quiz-result`,
  // New endpoints for enhanced dashboard functionality
  PROJECTS: `${API_BASE_URL}/user/projects`,
  WORK_EXPERIENCE: `${API_BASE_URL}/user/work-experience`,
  EVENTS: `${API_BASE_URL}/user/events`,
  SEMESTERS: `${API_BASE_URL}/user/semesters`,
  CURRENT_DATE: `${API_BASE_URL}/current-date`,
  // Psychometric Quiz endpoints (using existing AI endpoint)
  GENERATE_REPORT: `${API_BASE_URL}/psychometric/generate-report`,
};

export default API_BASE_URL;