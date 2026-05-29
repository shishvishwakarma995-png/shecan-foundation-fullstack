import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('shecan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('shecan_token');
      localStorage.removeItem('shecan_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginAdmin = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Contact Submissions
export const submitContactForm = (data) => API.post('/submissions', data);
export const getSubmissions = (params) => API.get('/submissions', { params });
export const updateSubmissionStatus = (id, status) => API.patch(`/submissions/${id}/status`, { status });
export const deleteSubmission = (id) => API.delete(`/submissions/${id}`);

// Volunteers
export const registerVolunteer = (data) => API.post('/volunteers', data);
export const getVolunteers = (params) => API.get('/volunteers', { params });
export const updateVolunteerStatus = (id, status) => API.patch(`/volunteers/${id}/status`, { status });

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;
