import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { API, apiClient } from '@shared/services'

const chatService = {
  getConversations: (params) => apiClient.get('/chat/conversations', { params }),
  getMessages: (id, params) => apiClient.get(`/chat/conversations/${id}/messages`, { params }),
  sendMessage: (id, payload) => apiClient.post(`/chat/conversations/${id}/messages`, payload),
  createSupportConversation: () => apiClient.post('/chat/support'),
}

export const CHAT_KEYS = {
  all: ['chat'],
  conversations: () => [...CHAT_KEYS.all, 'conversations'],
  messages: (id) => [...CHAT_KEYS.all, 'messages', id],
}

// 1. Fetch Conversations
export const useConversations = (params) => {
  return useQuery({
    queryKey: CHAT_KEYS.conversations(),
    queryFn: async () => {
      const response = await chatService.getConversations(params)
      return response.data
    },
    refetchInterval: 10000,
  })
}

// 2. Fetch Messages (Infinite Query for Cursor Pagination)
export const useMessages = (conversationId) => {
  return useInfiniteQuery({
    queryKey: CHAT_KEYS.messages(conversationId),
    queryFn: async ({ pageParam = null }) => {
      const params = { limit: 20 }
      if (pageParam) params.cursor = pageParam
      const response = await chatService.getMessages(conversationId, params)
      return response.data
    },
    getNextPageParam: (lastPage) => lastPage.meta?.hasNextPage ? lastPage.meta.nextCursor : undefined,
    enabled: !!conversationId,
    refetchInterval: 5000,
  })
}

// 3. Send Message Mutation
export const useSendMessage = (conversationId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content) => chatService.sendMessage(conversationId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(CHAT_KEYS.messages(conversationId))
      queryClient.invalidateQueries(CHAT_KEYS.conversations())
    },
    onError: () => toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!'),
  })
}

// 4. Create Support Conversation Mutation
export const useCreateSupport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => chatService.createSupportConversation(),
    onSuccess: (res) => {
      queryClient.invalidateQueries(CHAT_KEYS.conversations())
      return res.data
    },
    onError: () => toast.error('Lỗi khởi tạo cổng hỗ trợ Admin.'),
  })
}
