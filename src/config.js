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
  LOGOUT: `${API_BASE_URL}/logout`,
  AUTH_STATUS: `${API_BASE_URL}/auth/status`,
};

export default API_BASE_URL; 