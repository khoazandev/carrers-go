import React, { useState } from 'react'
import { useConversations } from '../hooks/useChatQuery'
import useChatStore from '@app/store/chatStore'
import useAuthStore from '@app/store/authStore'
import chatService from '../services/chatService'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCreateSupport } from '../hooks/useChat'

export default function ConversationList() {
  const { data: conversations, isLoading } = useConversations()
  const { activeConversationId, setActiveConversation, onlineUsers } = useChatStore()
  const user = useAuthStore(state => state.user)
  const queryClient = useQueryClient()
  const createSupport = useCreateSupport()

  const [searchEmail, setSearchEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchEmail.trim()) {
      setIsSearching(true)
      try {
        const res = await chatService.findOrCreateByEmail(searchEmail.trim())
        const newConversationId = res?.data?.data?._id
        if (newConversationId) {
          await queryClient.invalidateQueries(['chat-conversations'])
          setActiveConversation(newConversationId)
          setSearchEmail('')
        }
      } catch (err) {
        alert(err?.response?.data?.message || 'Không tìm thấy hoặc có lỗi xảy ra')
      } finally {
        setIsSearching(false)
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Bar */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder={isSearching ? "Đang tìm..." : "Nhập email (Enter) để tìm bạn bè"} 
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={handleSearch}
            disabled={isSearching}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--muted-foreground)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      {user?.role !== 'admin' && (
        <div 
          onClick={() => {
            createSupport.mutate(undefined, {
              onSuccess: (data) => {
                const newConversationId = data?.data?._id || data?._id;
                if (newConversationId) {
                  setActiveConversation(newConversationId);
                }
              }
            });
          }}
          style={{
            display: 'flex',
            padding: '12px 16px',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            transition: 'background-color 0.2s',
            borderLeft: '4px solid #10B981'
          }}
          className="hover:bg-green-100 dark:hover:bg-green-900"
        >
          <div style={{ position: 'relative', marginRight: '12px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#10B981', 
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            </div>
            <div style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '12px', height: '12px', borderRadius: '50%',
              backgroundColor: '#22c55e', border: '2px solid var(--card)'
            }}></div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Trạm Hỗ Trợ Admin
            </div>
            <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Chat với Admin để được hỗ trợ
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--foreground)' }}>Đang tải...</div>
      ) : !conversations || conversations.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted-foreground)' }}>Chưa có tin nhắn nào</div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conv) => {
            const myId = user?.id || user?._id || user?.userId;
            const otherParticipant = conv.participants?.find(p => {
               const pId = p._id || p.id;
               return String(pId) !== String(myId);
            })
            const name = otherParticipant?.profile?.fullName || 'Người dùng'
            const avatar = otherParticipant?.profile?.avatar
            const lastMsg = conv.lastMessage || 'Chưa có tin nhắn'
            const time = conv.lastMessageAt ? dayjs(conv.lastMessageAt).format('HH:mm') : ''
            const isActive = activeConversationId === conv._id;
            const isOnline = onlineUsers.includes(otherParticipant?._id || otherParticipant?.id)
            const unreadCount = conv.unreadCount || 0
            
            return (
              <div 
                key={conv._id} 
                className={`conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveConversation(conv._id)}
                style={{
                  display: 'flex',
                  padding: '12px 16px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--muted)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ position: 'relative', marginRight: '12px' }}>
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0084ff', 
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold'
                    }}>
                      {name.charAt(0)}
                    </div>
                  )}
                  {isOnline && (
                    <div style={{
                      position: 'absolute', bottom: '2px', right: '2px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: 'var(--success)', border: '2px solid var(--card)'
                    }}></div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: isActive || unreadCount > 0 ? '600' : '500', color: 'var(--foreground)', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '13px', color: unreadCount > 0 ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: unreadCount > 0 ? '600' : '400', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {lastMsg}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '8px' }}>
                  {time && <div style={{ fontSize: '11px', color: unreadCount > 0 ? 'var(--primary)' : 'var(--muted-foreground)', marginBottom: '4px' }}>{time}</div>}
                  {unreadCount > 0 && (
                    <div style={{
                      backgroundColor: 'var(--error)', color: '#fff', fontSize: '11px', fontWeight: 'bold',
                      padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center'
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
