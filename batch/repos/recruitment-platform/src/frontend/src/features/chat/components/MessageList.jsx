import React, { useMemo, useEffect, useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useQueryClient } from '@tanstack/react-query'
import { useChatMessages } from '../hooks/useChatQuery'
import useAuthStore from '@app/store/authStore'
import useChatStore from '@app/store/chatStore'
import chatService from '../services/chatService'
import dayjs from 'dayjs'

export default function MessageList({ conversationId }) {
  const user = useAuthStore(state => state.user)
  const virtuosoRef = useRef(null)
  const queryClient = useQueryClient()
  const { setUnreadCount, unreadCount } = useChatStore()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useChatMessages(conversationId)

  // Đánh dấu đã đọc khi mở conversation
  useEffect(() => {
    if (conversationId) {
      chatService.markAsRead(conversationId).then(() => {
        const convs = queryClient.getQueryData(['chat-conversations']) || []
        const conv = convs.find(c => c._id === conversationId)
        if (conv && conv.unreadCount > 0) {
            setUnreadCount(Math.max(0, unreadCount - conv.unreadCount))
            queryClient.setQueryData(['chat-conversations'], old => 
              old.map(c => c._id === conversationId ? { ...c, unreadCount: 0 } : c)
            )
        }
      }).catch(err => console.error('[CHAT] Lỗi mark as read:', err))
    }
  }, [conversationId, queryClient, setUnreadCount, unreadCount])

  const messages = useMemo(() => {
    if (!data) return []
    const allMessages = data.pages.flatMap(page => page.data).filter(Boolean)
    return allMessages.reverse()
  }, [data])

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  if (isLoading) {
    return <div style={{ padding: '16px' }}>Đang tải tin nhắn...</div>
  }

  return (
    <div className="message-list-container">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        firstItemIndex={1000000 - messages.length}
        initialTopMostItemIndex={messages.length - 1}
        startReached={loadMore}
        followOutput="smooth"
        itemContent={(index, msg) => {
          const myId = user?.id || user?._id || user?.userId;
          const senderIdFromMsg = msg.sender?._id || msg.sender || msg.senderId?._id || msg.senderId;
          const isMe = myId && senderIdFromMsg ? String(senderIdFromMsg) === String(myId) : false;
          const senderName = msg.sender?.profile?.fullName || msg.senderId?.profile?.fullName || 'Người dùng'
          const senderAvatar = msg.sender?.profile?.avatar || msg.senderId?.profile?.avatar
          
          // Timestamp Logic
          const arrayIndex = index - (1000000 - messages.length)
          const prevMsg = arrayIndex > 0 ? messages[arrayIndex - 1] : null
          const isNewDay = !prevMsg || !dayjs(msg.createdAt).isSame(dayjs(prevMsg.createdAt), 'day')
          let dateSeparator = null
          if (isNewDay) {
            const date = dayjs(msg.createdAt)
            const isToday = date.isSame(dayjs(), 'day')
            const isYesterday = date.isSame(dayjs().subtract(1, 'day'), 'day')
            let dateStr = date.format('DD/MM/YYYY')
            if (isToday) dateStr = 'Hôm nay'
            else if (isYesterday) dateStr = 'Hôm qua'
            else if (date.isSame(dayjs(), 'year')) dateStr = date.format('D [Thg] M')
            
            dateSeparator = (
              <div style={{ textAlign: 'center', margin: '24px 0 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>
                <span style={{ padding: '4px 12px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>{dateStr}</span>
              </div>
            )
          }

          return (
            <React.Fragment>
              {dateSeparator}
              <div className={`message-item ${isMe ? 'me' : 'them'}`} style={{
                display: 'flex', 
                alignItems: 'flex-start',
                flexDirection: isMe ? 'row-reverse' : 'row'
              }}>
                {!isMe && (
                  senderAvatar ? (
                    <img 
                      src={senderAvatar} 
                      alt={senderName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, margin: '0 8px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0084ff', 
                      flexShrink: 0, margin: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px'
                    }}>
                      {senderName.charAt(0)}
                    </div>
                  )
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                   {msg.type === 'image' ? (
                     <div className="message-bubble" style={{ padding: '4px', backgroundColor: 'transparent', boxShadow: 'none', opacity: msg.isUploading ? 0.6 : 1 }}>
                       <img src={msg.fileUrl} alt="attachment" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)', objectFit: 'contain' }} />
                       {msg.isUploading && <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>Đang tải ảnh lên...</div>}
                     </div>
                   ) : msg.type === 'file' ? (
                     <div className="message-bubble" style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: msg.isUploading ? 0.6 : 1 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                         {msg.isUploading ? (
                           <span style={{ color: 'inherit', wordBreak: 'break-all' }}>{msg.fileName || 'Tệp đính kèm'}</span>
                         ) : (
                           <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline', wordBreak: 'break-all' }}>
                             {msg.fileName || 'Tệp đính kèm'}
                           </a>
                         )}
                       </div>
                       {msg.isUploading && <div style={{ fontSize: '11px', color: '#0084ff' }}>Đang tải file lên...</div>}
                     </div>
                   ) : (
                     <div className="message-bubble">{msg.content}</div>
                   )}
                   <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px', margin: '0 4px' }}>
                     {dayjs(msg.createdAt).format('HH:mm')}
                   </div>
                </div>
              </div>
            </React.Fragment>
          )
        }}
        components={{
          Header: () => isFetchingNextPage ? <div style={{textAlign: 'center', padding: '10px', fontSize: '12px', color: 'var(--muted-foreground)'}}>Đang tải tin cũ...</div> : null
        }}
      />
    </div>
  )
}
