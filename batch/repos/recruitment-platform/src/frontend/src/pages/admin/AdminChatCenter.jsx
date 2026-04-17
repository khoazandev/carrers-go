import { useState, useRef, useEffect } from 'react'
import { Card } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { LoadingSpinner } from '@shared/components'
import { MessagesSquare, Search, Send, UserRound, ArrowLeft, Loader2, Paperclip, X } from 'lucide-react'
import { useConversations, useMessages, useSendMessage } from '@features/chat/hooks/useChat'
import { useSendFileMessage } from '@features/chat/hooks/useChatQuery'
import useAuthStore from '@app/store/authStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

export default function AdminChatCenter() {
  const { user } = useAuthStore()
  const [activeConv, setActiveConv] = useState(null)
  const [textContent, setTextContent] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const { data: convsData, isLoading: isLoadingConvs } = useConversations({ limit: 50 })
  const { data: messagesData, isLoading: isLoadingMsgs, fetchNextPage, hasNextPage } = useMessages(activeConv?._id)
  const sendMessage = useSendMessage(activeConv?._id)
  const sendFileMessage = useSendFileMessage(activeConv?._id)

  const messagesEndRef = useRef(null)

  const allMessages = messagesData?.pages.flatMap((p) => p.data).reverse() || []

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [allMessages.length, activeConv])

  const handleSend = (e) => {
    e.preventDefault()
    
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      sendFileMessage.mutate(formData)
      setSelectedFile(null)
    }

    if (textContent.trim() && activeConv) {
      sendMessage.mutate(textContent)
      setTextContent('')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    e.target.value = null
  }

  // Filter conversations
  const conversations = convsData?.data || []
  const filteredConvs = conversations.filter((c) => {
    const partner = c.participants.find(p => p._id !== user?._id)
    const name = partner?.profile?.fullName || partner?.email || ''
    return name.toLowerCase().includes(searchKey.toLowerCase())
  })

  const activePartner = activeConv?.participants?.find(p => p._id !== user?._id)

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-10 h-[calc(100vh-140px)] flex flex-col">
      
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
            <MessagesSquare className="w-6 h-6" />
          </div>
          Trạm Hỗ Trợ Trực Tuyến (Live Support)
        </h1>
      </div>

      <Card variant="glass" className="w-full flex-1 bg-white dark:bg-[#1C252E] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] p-0 flex">
        
        {/* Left Pane - Chat List */}
        <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-[rgba(145,158,171,0.12)] flex flex-col bg-[#FAFBFA] dark:bg-[rgba(145,158,171,0.02)] ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[rgba(145,158,171,0.12)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#919EAB]" />
              <input 
                type="text" 
                placeholder="Tìm user..." 
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
                className="w-full bg-white dark:bg-[#141A21] border border-[rgba(145,158,171,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 text-[#1C252E] dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
            {isLoadingConvs ? (
              <div className="p-6 text-center text-[#919EAB] flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mb-2 text-green-500" />
                Đang tải danh sách...
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="p-6 text-center text-[#637381] text-sm">Không tìm thấy phiên thoại nào.</div>
            ) : (
              <div className="divide-y divide-[rgba(145,158,171,0.08)]">
                {filteredConvs.map(conv => {
                  const partner = conv.participants.find(p => p._id !== user?._id)
                  const isActive = activeConv?._id === conv._id
                  return (
                    <div 
                      key={conv._id} 
                      onClick={() => setActiveConv(conv)}
                      className={`p-4 cursor-pointer hover:bg-[rgba(145,158,171,0.08)] transition-all ${isActive ? 'bg-green-50 dark:bg-green-500/10 border-l-4 border-green-500' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        {partner?.profile?.avatar ? (
                          <img src={partner.profile.avatar} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-purple-500/20 flex items-center justify-center text-green-600 font-bold shrink-0">
                            {partner?.profile?.fullName?.charAt(0) || <UserRound className="w-5 h-5"/>}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold truncate text-[15px] ${isActive ? 'text-green-700 dark:text-green-400' : 'text-[#1C252E] dark:text-white'}`}>
                              {partner?.profile?.fullName || partner?.email}
                            </span>
                            {conv.lastMessageAt && (
                              <span className="text-[11px] text-[#919EAB] shrink-0 font-medium">
                                {dayjs(conv.lastMessageAt).fromNow()}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#637381] dark:text-[#919EAB] truncate font-medium">
                            {conv.lastMessage || 'Bắt đầu phiên thoại mới'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#1C252E] relative ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
          {!activeConv ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <MessagesSquare className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-extrabold text-[#1C252E] dark:text-white mb-2">Trạm CRM Thông Minh</h2>
              <p className="text-[#637381] dark:text-[#919EAB]">Chọn một phiên thoại từ thanh bên trái để bắt đầu hỗ trợ người dùng ngay lập tức.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[73px] px-6 border-b border-[rgba(145,158,171,0.12)] flex items-center gap-4 bg-[#FAFBFA] dark:bg-[rgba(145,158,171,0.02)] shrink-0">
                <button 
                  onClick={() => setActiveConv(null)}
                  className="md:hidden p-2 bg-[rgba(145,158,171,0.08)] rounded-lg text-[#1C252E] dark:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold">
                    {activePartner?.profile?.fullName?.charAt(0) || <UserRound className="w-5 h-5"/>}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#1C252E] dark:text-white text-[15px]">{activePartner?.profile?.fullName || activePartner?.email}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[12px] text-[#637381] dark:text-[#919EAB] font-semibold tracking-wide uppercase">
                        {activePartner?.role === 'hr' ? 'Nhà Tuyển Dụng' : 'Ứng Viên'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 bg-transparent relative hide-scrollbar">
                {isLoadingMsgs ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {hasNextPage && (
                      <button 
                        onClick={() => fetchNextPage()} 
                        className="text-[12px] font-bold text-green-500 hover:text-green-600 mx-auto bg-green-50 dark:bg-green-500/10 px-4 py-1.5 rounded-full"
                      >
                        Tải thêm tin nhắn cũ
                      </button>
                    )}
                    {allMessages.map(msg => {
                      const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            isMe 
                              ? 'bg-gradient-to-br from-green-600 to-green-500 text-white rounded-tr-sm' 
                              : 'bg-white dark:bg-[#141A21] border border-[rgba(145,158,171,0.12)] text-[#1C252E] dark:text-[#DFE3E8] rounded-tl-sm'
                          } ${msg.isUploading ? 'opacity-50' : ''}`}>
                            {msg.type === 'image' && msg.fileUrl && (
                               <div className="mb-2">
                                 <img src={msg.fileUrl} alt="attachment" className="max-w-[200px] rounded-lg max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.fileUrl, '_blank')} />
                               </div>
                            )}
                            {msg.type === 'file' && msg.fileUrl && (
                               <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-3 rounded-xl mb-2 hover:opacity-90 transition-opacity ${isMe ? 'bg-white/20' : 'bg-[rgba(145,158,171,0.08)]'}`}>
                                 <Paperclip className="w-4 h-4 shrink-0" />
                                 <span className="text-[13px] truncate font-medium">{msg.fileName || 'Tệp đính kèm'}</span>
                               </a>
                            )}
                            {msg.type !== 'image' && msg.type !== 'file' && msg.content && (
                               <p className="text-[14.5px] leading-relaxed" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            )}
                            <span className={`text-[11px] mt-2 block font-medium ${isMe ? 'text-green-200 text-right' : 'text-[#919EAB]'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-[#1C252E] border-t border-[rgba(145,158,171,0.12)] shrink-0 flex flex-col gap-2">
                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] rounded-xl w-max max-w-[50%]">
                    <Paperclip className="w-4 h-4 text-[#919EAB]" />
                    <span className="text-[13px] text-[#1C252E] dark:text-white truncate font-medium">{selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)} className="p-1 hover:bg-[rgba(145,158,171,0.12)] rounded-full text-[#919EAB] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSend} className="flex gap-3 relative items-center">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-3 text-[#919EAB] hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-colors"
                    title="Đính kèm file hoặc ảnh"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                  
                  <input
                    type="text"
                    placeholder="Gõ phản hồi lập tức cho người dùng..."
                    className="flex-1 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border-none rounded-2xl px-5 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/30 text-[#1C252E] dark:text-white"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    disabled={sendMessage.isPending || sendFileMessage.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={(!textContent.trim() && !selectedFile) || sendMessage.isPending || sendFileMessage.isPending}
                    className="w-[56px] h-[56px] shrink-0 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white shadow-[0_8px_16px_rgba(79,70,229,0.24)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center p-0"
                  >
                    <Send className="w-6 h-6 -ml-1 flex-shrink-0" />
                  </Button>
                </form>
              </div>

            </>
          )}
        </div>

      </Card>
    </div>
  )
}
