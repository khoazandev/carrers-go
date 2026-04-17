import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import jobService from '../services/jobService'

// ============================================
// Queries
// ============================================

/**
 * HR lấy danh sách jobs của mình
 */
export function useMyJobs(params) {
  return useQuery({
    queryKey: ['my-jobs', params],
    queryFn: () => jobService.getMyJobs(params).then(res => res.data),
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Lấy chi tiết 1 job
 */
export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getById(id).then(res => res.data),
    enabled: !!id,
  })
}

/**
 * Lấy danh sách việc làm đã lưu của Candidate
 */
export function useFavoriteJobs(params) {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => jobService.getFavorites(params).then(res => res.data),
    staleTime: 60 * 1000,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Tạo job mới (status = draft)
 */
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => jobService.create(data),
    onSuccess: () => {
      toast.success('Tạo tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể tạo tin tuyển dụng')
    },
  })
}

/**
 * Cập nhật job (chỉ khi draft)
 */
export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => jobService.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Cập nhật tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', id] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật tin tuyển dụng')
    },
  })
}

/**
 * Xóa job (chỉ khi draft)
 */
export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => jobService.delete(id),
    onSuccess: () => {
      toast.success('Xóa tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể xóa tin tuyển dụng')
    },
  })
}

/**
 * Chuyển trạng thái job (draft→pending, published→closed, etc.)
 */
export function useUpdateJobStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => jobService.updateStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Chuyển trạng thái thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể chuyển trạng thái')
    },
  })
}

/**
 * Toggle lưu việc làm (Candidate)
 * Sử dụng optimistic update pattern
 */
export function useToggleFavoriteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => jobService.toggleFavorite(id),
    onMutate: async (id) => {
      // Cancel pending refetches
      await queryClient.cancelQueries({ queryKey: ['jobs'] })
      await queryClient.cancelQueries({ queryKey: ['job'] })
      await queryClient.cancelQueries({ queryKey: ['favorites'] })

      // Snapshot previous states
      const prevJobs = queryClient.getQueriesData({ queryKey: ['jobs'] })
      const prevJob = queryClient.getQueriesData({ queryKey: ['job'] })
      const prevFavs = queryClient.getQueriesData({ queryKey: ['favorites'] })

      // Optimistically update list of jobs (search result)
      queryClient.setQueriesData({ queryKey: ['jobs'] }, (oldData) => {
        if (!oldData || !oldData.pages) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.map(j => j._id === id ? { ...j, isSaved: !j.isSaved } : j)
          }))
        }
      })

      // Optimistically update job details
      queryClient.setQueriesData({ queryKey: ['job', id] }, (oldData) => {
        if (!oldData || !oldData.data) return oldData
        return { ...oldData, data: { ...oldData.data, isSaved: !oldData.data.isSaved } }
      })

      // Optimistically remove from favorites list if unsaved (we cannot easily add due to missing job payload)
      queryClient.setQueriesData({ queryKey: ['favorites'] }, (oldData) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(fav => fav.job?._id !== id)
        }
      })

      return { prevJobs, prevJob, prevFavs }
    },
    onError: (err, id, context) => {
      // Rollback on error
      context?.prevJobs?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      context?.prevJob?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      context?.prevFavs?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu tin tuyển dụng')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
