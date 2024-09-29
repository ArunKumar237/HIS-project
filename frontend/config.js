// config.js
export const useLocalAPI = false;  // Change this manually to switch between local and production

export const API_BASE_URL = useLocalAPI 
  ? 'http://127.0.0.1:8000' 
  : 'https://arun237.pythonanywhere.com';
