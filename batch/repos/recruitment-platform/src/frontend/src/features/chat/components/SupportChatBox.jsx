import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, UserRound, Loader2 } from 'lucide-react'
import { useCreateSupport, useMessages, useSendMessage } from '../hooks/useChat'
import useAuthStore from '@app/store/authStore'

export default function SupportChatBox() {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [convId, setConvId] = useState(null)
  const [textContent, setTextContent] = useState('')
  
  const createSupport = useCreateSupport()
  const { data: messagesData, isLoading: isLoadingMsgs, fetchNextPage, hasNextPage } = useMessages(convId)
  const sendMessage = useSendMessage(convId)

  const messagesEndRef = useRef(null)

  // Extract flat messages array and reverse so newest is at bottom
  const allMessages = messagesData?.pages.flatMap((p) => p.data).reverse() || []

  useEffect(() => {
    if (isOpen && !convId) {
      // Get or create support conversation
      createSupport.mutate(undefined, {
        onSuccess: (data) => {
          setConvId(data.data._id)
        }
      })
    }
  }, [isOpen])

  // Scroll to bottom when new messages arrive (very basic implementation)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [allMessages.length])

  const handleSend = (e) => {
    e.preventDefault()
    if (!textContent.trim() || !convId) return
    sendMessage.mutate(textContent)
    setTextContent('')
  }

  return (
    <>


      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-[360px] bg-white dark:bg-[#1C252E] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[rgba(145,158,171,0.12)] flex flex-col overflow-hidden"
            style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
          >
            {/* Header */}
            <div className="bg-green-600 p-4 flex items-center justify-between shadow-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-green-600 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Hỗ trợ Trực tuyến</h4>
                  <p className="text-green-100 text-[12px] font-medium leading-none">AdminHub CRM</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAFBFA] dark:bg-[#141A21] hide-scrollbar relative">
              {createSupport.isPending || isLoadingMsgs ? (
                <div className="h-full flex flex-col items-center justify-center text-[#919EAB]">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <p className="text-sm font-medium">Đang kết nối...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {hasNextPage && (
                    <button 
                      onClick={() => fetchNextPage()} 
                      className="text-xs font-bold text-green-500 hover:text-green-600 mx-auto bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full text-center"
                    >
                      Tải cũ hơn
                    </button>
                  )}
                  {allMessages.length === 0 ? (
                    <div className="h-full mt-20 flex flex-col items-center justify-center text-center opacity-50">
                      <MessageSquare className="w-12 h-12 mb-3 text-[#919EAB]" />
                      <p className="text-sm font-medium text-[#637381] dark:text-[#919EAB]">Gửi lời chào để bắt đầu phiên<br/>hỗ trợ với Tổng đài viên.</p>
                    </div>
                  ) : (
                    allMessages.map((msg) => {
                      const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] shadow-sm ${
                            isMe 
                              ? 'bg-green-600 text-white rounded-tr-sm' 
                              : 'bg-white dark:bg-[#212B36] text-[#1C252E] dark:text-white border border-[rgba(145,158,171,0.08)] rounded-tl-sm'
                          }`}>
                            <p style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            <span className={`text-[10px] mt-1 block font-medium ${isMe ? 'text-green-200 text-right' : 'text-[#919EAB]'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#1C252E] border-t border-[rgba(145,158,171,0.12)] shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập nội dung chát..."
                  className="flex-1 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 text-[#1C252E] dark:text-white"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  disabled={!convId || sendMessage.isPending}
                />
                <button
                  type="submit"
                  disabled={!textContent.trim() || !convId || sendMessage.isPending}
                  className="w-11 h-11 shrink-0 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5 -ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
