import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import chatService from '../services/chatService'

// Fetch danh sách người dùng đã chat
export const useConversations = () => {
  return useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      const response = await chatService.getConversations()
      // Giả sử structure trả về là response.data.data
      return response.data?.data || []
    },
  })
}

// Fetch list tin nhắn theo Pagination Cursor (infinite query)
export const useChatMessages = (conversationId) => {
  return useInfiniteQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async ({ pageParam = null }) => {
      // Gọi service kèm theo cursor = pageParam
      const response = await chatService.getMessages(conversationId, {
        cursor: pageParam || undefined,
        limit: 20,
      })
      
      // Axios response
      const serverData = response.data
      return serverData // { success: true, data: [...], pagination: { hasNextPage, nextCursor } }
    },
    enabled: !!conversationId,
    getNextPageParam: (lastPage) => {
      // Lấy cursor kết tiếp được gán bởi BE
      if (lastPage?.meta?.hasNextPage) {
        return lastPage.meta.nextCursor
      }
      return undefined
    },
    select: (data) => {
      // Chúng ta sẽ xẹp Array of Arrays thành 1 mảng các tin nhắn gộp lại
      // Tuỳ vào cách BE sort: [Mới -> Cũ] hay [Cũ -> Mới]. Phải linh hoạt.
      // Vì cursor pagination hay trả về mới nhất trước, hoặc cần sắp xếp lại cho Virtuoso
      return {
        pages: data.pages,
        pageParams: data.pageParams,
      }
    }
  })
}

// Gửi một tin nhắn mới
export const useSendMessage = (conversationId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content) => {
      const response = await chatService.sendMessage(conversationId, { content })
      return response.data?.data
    },
    onSuccess: (newMessage) => {
      // Lạc quan update data
      queryClient.setQueryData(['chat-messages', conversationId], (oldData) => {
        if (!oldData) return oldData
        const newPages = [...oldData.pages]
        if (newPages.length > 0) {
           const isDuplicated = newPages[0].data.some(m => m._id === newMessage._id)
           if (!isDuplicated) {
             newPages[0] = {
               ...newPages[0],
               data: [newMessage, ...newPages[0].data]
             }
           }
        }
        return { ...oldData, pages: newPages }
      })
    }
  })
}

import useAuthStore from '@app/store/authStore'

// Gửi một tin nhắn đính kèm file
export const useSendFileMessage = (conversationId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => {
      const response = await chatService.sendFile(conversationId, formData)
      return response.data?.data
    },
    onMutate: async (formData) => {
      const file = formData.get('file')
      if (!file) return { tempId: null, objectUrl: null }

      const user = useAuthStore.getState().user
      const tempId = `temp-${Date.now()}`
      const isImage = file.type.startsWith('image/')
      const objectUrl = URL.createObjectURL(file)
      
      const newTempMessage = {
        _id: tempId,
        conversationId,
        senderId: user?.id,
        type: isImage ? 'image' : 'file',
        fileUrl: objectUrl, // Generate local preview URL
        fileName: file.name,
        content: '',
        createdAt: new Date().toISOString(),
        isUploading: true 
      }

      queryClient.setQueryData(['chat-messages', conversationId], (oldData) => {
        if (!oldData) return oldData
        const newPages = [...oldData.pages]
        if (newPages.length > 0) {
           newPages[0] = {
             ...newPages[0],
             data: [newTempMessage, ...newPages[0].data]
           }
        }
        return { ...oldData, pages: newPages }
      })

      return { tempId, objectUrl }
    },
    onSuccess: (newMessage, variables, context) => {
      if (context?.objectUrl) {
         URL.revokeObjectURL(context.objectUrl)
      }
      queryClient.setQueryData(['chat-messages', conversationId], (oldData) => {
        if (!oldData) return oldData
        const newPages = [...oldData.pages]
        if (newPages.length > 0) {
           // Xoá tin nhắn tạm (nếu có context.tempId) 
           const filteredData = context?.tempId 
                ? newPages[0].data.filter(m => m._id !== context.tempId) 
                : newPages[0].data

           const isDuplicated = filteredData.some(m => m._id === newMessage._id)
           if (!isDuplicated) {
             newPages[0] = {
               ...newPages[0],
               data: [newMessage, ...filteredData]
             }
           } else {
             newPages[0] = { ...newPages[0], data: filteredData }
           }
        }
        return { ...oldData, pages: newPages }
      })
    },
    onError: (err, variables, context) => {
      if (context?.objectUrl) {
         URL.revokeObjectURL(context.objectUrl)
      }
      // Xoá tin nhắn tạm nếu bị lỗi
      if (context?.tempId) {
        queryClient.setQueryData(['chat-messages', conversationId], (oldData) => {
          if (!oldData) return oldData
          const newPages = [...oldData.pages]
          if (newPages.length > 0) {
             newPages[0] = {
               ...newPages[0],
               data: newPages[0].data.filter(m => m._id !== context.tempId)
             }
          }
          return { ...oldData, pages: newPages }
        })
      }
    }
  })
}
