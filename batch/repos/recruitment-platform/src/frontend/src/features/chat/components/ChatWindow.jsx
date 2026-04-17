import React, { useState } from 'react'

import useChatStore from '@app/store/chatStore'
import ConversationList from './ConversationList'
import MessageList from './MessageList'
import { useSendMessage, useSendFileMessage } from '../hooks/useChatQuery'

function MessageInput({ conversationId }) {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const { mutate: sendMessage, isPending: isSendingText } = useSendMessage(conversationId)
  const { mutate: sendFileMessage, isPending: isSendingFile } = useSendFileMessage(conversationId)
  const fileInputRef = React.useRef(null)

  const isSending = isSendingText || isSendingFile

  const handleSend = (e) => {
    e.preventDefault()
    
    // Nếu có file đang chọn thì gọi API gửi file và xoá preview ngay
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      sendFileMessage(formData)
      setSelectedFile(null)
    }

    // Nếu có text thì gọi API gửi text
    if (text.trim()) {
      sendMessage(text)
      setText('')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    e.target.value = null
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const cancelFile = () => {
    setSelectedFile(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {selectedFile && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', background: 'var(--muted)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>{selectedFile.name}</span>
              <button type="button" onClick={cancelFile} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
           </div>
        </div>
      )}
      <form className="message-input-area" onSubmit={handleSend}>
        <span className="chat-icon-btn" onClick={handleAttachmentClick} title="Đính kèm file hoặc ảnh" style={{ cursor: 'pointer', color: '#0084ff' }}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </span>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,application/pdf" onChange={handleFileChange} />
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={!text.trim() && !selectedFile}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
             <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  )
}

export default function ChatWindow() {
  const { isOpen, closeChat, activeConversationId, setActiveConversation } = useChatStore()

  if (!isOpen) return null

  return (
    <>
      <div className="chat-overlay" onClick={closeChat}></div>
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-actions" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#0084ff' }}>
              Chat
            </span>
          </div>
          <div className="chat-header-actions" style={{ display: 'flex', gap: '8px' }}>
            <span className="chat-icon-btn" onClick={closeChat} title="Đóng">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </span>
          </div>
        </div>

        <div className="chat-body-container">
          <div className="conversation-list">
              <ConversationList />
          </div>

          <div className="message-view">
              {activeConversationId ? (
                 <>
                   <MessageList conversationId={activeConversationId} />
                   <MessageInput conversationId={activeConversationId} />
                 </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <p>Chọn một đoạn hội thoại để bắt đầu</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
