import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Add interceptor to include token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  signup: (userData) => API.post('/auth/signup', userData)
};

export const journalAPI = {
  getStatus: () => API.get('/status'),
  getJournals: () => API.get('/journals'),
  createJournal: (data) => API.post('/journals', data),
  updateJournal: (id, data) => API.put(`/journals/${id}`, data),
  deleteJournal: (id) => API.delete(`/journals/${id}`)
};

export default API;
