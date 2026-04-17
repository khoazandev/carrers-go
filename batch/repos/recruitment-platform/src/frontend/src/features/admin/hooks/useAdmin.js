import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import adminService from '../services/adminService'

export const ADMIN_KEYS = {
  all: ['admin'],
  companies: () => [...ADMIN_KEYS.all, 'companies'],
  pendingCompanies: (params) => [...ADMIN_KEYS.companies(), 'pending', params],
  dashboard: () => [...ADMIN_KEYS.all, 'dashboard'],
  users: (params) => [...ADMIN_KEYS.all, 'users', params],
  adminJobs: (params) => [...ADMIN_KEYS.all, 'adminJobs', params],
}

export const usePendingCompanies = (params) => {
  return useQuery({
    queryKey: ADMIN_KEYS.pendingCompanies(params),
    queryFn: async () => {
      const response = await adminService.getPendingCompanies(params)
      return response.data
    },
    keepPreviousData: true,
  })
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: async () => {
      const response = await adminService.getDashboardStats()
      return response.data?.data
    },
  })
}

const createCompanyModerationMutation = (mutationFn, successMessage) => {
  return () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn,
      onSuccess: (response) => {
        toast.success(response.data?.message || successMessage)
        queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.companies() })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý')
      },
    })
  }
}

export const useApproveCompany = createCompanyModerationMutation(
  (id) => adminService.approveCompany(id),
  'Duyệt công ty thành công'
)

export const useRejectCompany = createCompanyModerationMutation(
  (id) => adminService.rejectCompany(id),
  'Từ chối công ty thành công'
)

export const useLockCompany = createCompanyModerationMutation(
  (id) => adminService.lockCompany(id),
  'Đã khóa công ty'
)

export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ADMIN_KEYS.users(params),
    queryFn: async () => {
      const response = await adminService.getUsers(params)
      return response.data
    },
    keepPreviousData: true,
  })
}

export const useToggleBlockUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => adminService.toggleBlockUser(id, { reason }),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Thao tác thay đổi trạng thái thành công!')
      queryClient.invalidateQueries({ queryKey: [...ADMIN_KEYS.all, 'users'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý')
    },
  })
}

export const useAdminPendingJobs = (params) => {
  return useQuery({
    queryKey: ADMIN_KEYS.adminJobs(params),
    queryFn: async () => {
      const response = await adminService.getPendingJobs(params)
      return response.data
    },
    keepPreviousData: true,
  })
}

const createAdminJobMutation = (mutationFn, successMessage) => {
  return () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn,
      onSuccess: (response) => {
        toast.success(response.data?.message || successMessage)
        queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.adminJobs() })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý tin tuyển dụng')
      },
    })
  }
}

export const useApproveAdminJob = createAdminJobMutation(
  (id) => adminService.approveJob(id),
  'Đã CHẤP THUẬN tin tuyển dụng, đưa lên trang chủ!'
)

export const useRejectAdminJob = createAdminJobMutation(
  ({ id, reason }) => adminService.rejectJob(id, { reason }),
  'Đã TỪ CHỐI cấp phép tin tuyển dụng.'
)
