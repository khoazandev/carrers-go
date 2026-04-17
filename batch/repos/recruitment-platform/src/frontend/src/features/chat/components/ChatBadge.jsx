import { useEffect } from 'react'
import { FaCommentDots } from 'react-icons/fa'
import useChatStore from '@app/store/chatStore'
import useAuthStore from '@app/store/authStore'
import chatService from '@features/chat/services/chatService'

import './ChatWindow.css'

export default function ChatBadge() {
  const { toggleChat, unreadCount, setUnreadCount } = useChatStore()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      chatService.getUnreadCount()
        .then(res => {
          if (res?.data?.data?.unreadCount !== undefined) {
            setUnreadCount(res.data.data.unreadCount)
          }
        })
        .catch(err => console.error('Lỗi lấy unread count:', err))
    }
  }, [isAuthenticated, setUnreadCount])

  return (
    <div className="chat-floating-btn" onClick={toggleChat}>
      <FaCommentDots />
      {unreadCount > 0 && (
        <span key={unreadCount} className="chat-badge bouncing">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}
