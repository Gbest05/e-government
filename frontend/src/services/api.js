import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rmn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('rmn_token');
        localStorage.removeItem('rmn_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const servicesService = {
  getServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};

export const applicationsService = {
  submitApplication: (data) => api.post('/applications', data),
  getApplications: (params) => api.get('/applications', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  trackByRef: (refCode) => api.get(`/applications/track/${refCode}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  assignApplication: (id, data) => api.put(`/applications/${id}/assign`, data),
};

export const reportsService = {
  submitReport: (data) => api.post('/reports', data),
  getReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  updateStatus: (id, data) => api.put(`/reports/${id}/status`, data),
};

export const complaintsService = {
  submitComplaint: (data) => api.post('/complaints', data),
  getComplaints: (params) => api.get('/complaints', { params }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
};

export const announcementsService = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  getAnnouncementById: (id) => api.get(`/announcements/${id}`),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const notificationsService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const departmentsService = {
  getDepartments: (params) => api.get('/departments', { params }),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  createStaff: (data) => api.post('/admin/users', data),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  updateUserDetails: (id, data) => api.put(`/admin/users/${id}`, data),
};

export const staffService = {
  getDashboardStats: () => api.get('/staff/dashboard'),
};

export const uploadFile = async (file, folder = 'documents') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.file;
};

export default api;
