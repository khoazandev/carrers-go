import { API, apiClient } from '@shared/services'

const adminService = {
  // Users
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  toggleBlockUser: (id, payload) => apiClient.patch(`/admin/users/${id}/toggle-block`, payload),
  
  // Companies
  getPendingCompanies: (params) => apiClient.get(API.ADMIN.PENDING_COMPANIES, { params }),
  approveCompany: (id) => apiClient.patch(API.ADMIN.APPROVE_COMPANY(id)),
  rejectCompany: (id) => apiClient.patch(API.ADMIN.REJECT_COMPANY(id)),
  lockCompany: (id) => apiClient.patch(API.ADMIN.LOCK_COMPANY(id)),
  getDashboardStats: () => apiClient.get(API.ADMIN.DASHBOARD),

  // Jobs Moderation
  getPendingJobs: (params) => apiClient.get('/admin/jobs/pending', { params }),
  approveJob: (id) => apiClient.patch(`/admin/jobs/${id}/approve`),
  rejectJob: (id, payload) => apiClient.patch(`/admin/jobs/${id}/reject`, payload),
}

export default adminService
