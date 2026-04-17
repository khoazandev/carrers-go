import { apiClient, API } from '@shared/services'

const chatService = {
  getConversations: () => apiClient.get(API.CHAT.CONVERSATIONS),
  getMessages: (conversationId, params) =>
    apiClient.get(API.CHAT.MESSAGES(conversationId), { params }),
  sendMessage: (conversationId, data) =>
    apiClient.post(API.CHAT.MESSAGES(conversationId), data),
  sendFile: (conversationId, formData) =>
    apiClient.post(API.CHAT.SEND_FILE(conversationId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUnreadCount: () => apiClient.get(API.CHAT.UNREAD_COUNT),
  markAsRead: (conversationId) => apiClient.put(API.CHAT.MARK_READ(conversationId)),
  findOrCreateByEmail: (email) => apiClient.post(API.CHAT.FIND_BY_EMAIL, { email }),
}

export default chatService
