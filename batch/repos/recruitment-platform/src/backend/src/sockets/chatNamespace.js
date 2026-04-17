import { ROLES } from '../common/constants.js'

// Track online users globally: Map<userId, connectionCount>
global.onlineUsers = global.onlineUsers || new Map()

/**
 * Namespace /chat — Chat Room giữa HR ↔ Candidate
 */
const setupChatNamespace = (chatNsp) => {
  // --- Kiểm tra role khi kết nối ---
  chatNsp.use((socket, next) => {
    const { role } = socket.user
    if (role !== ROLES.HR && role !== ROLES.CANDIDATE && role !== ROLES.ADMIN) {
      return next(new Error('FORBIDDEN'))
    }
    next()
  })

  chatNsp.on('connection', (socket) => {
    const { userId, role } = socket.user
    console.log(`[CHAT] Connected: ${socket.id} | user=${userId} role=${role}`)

    // 1. Online Presence Logic
    const currentCount = global.onlineUsers.get(userId) || 0
    global.onlineUsers.set(userId, currentCount + 1)
    if (currentCount === 0) {
      // User just became online
      chatNsp.emit('user_online', userId)
    }

    // Send the current list of online users to this newly connected client
    socket.emit('get_online_users', Array.from(global.onlineUsers.keys()))

    // 2. Auto join all existing conversation rooms
    import('../models/Chat.js').then(({ Conversation }) => {
      Conversation.find({ participants: userId }, '_id').lean().then(convs => {
        convs.forEach(c => {
          socket.join(`conv:${c._id}`);
        });
        console.log(`[CHAT] ${userId} auto-joined ${convs.length} rooms`);
      }).catch(err => console.error('[CHAT] Find conv error:', err));
    });

    // --- Join conversation room (fallback for new convs) ---
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return
      const room = `conv:${conversationId}`
      socket.join(room)
      console.log(`[CHAT] ${userId} joined ${room}`)
    })

    // --- Rời conversation room ---
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return
      const room = `conv:${conversationId}`
      socket.leave(room)
      console.log(`[CHAT] ${userId} left ${room}`)
    })

    // --- Gửi tin nhắn ---
    socket.on('send_message', (data) => {
      const { conversationId, message } = data || {}
      if (!conversationId || !message) return

      const room = `conv:${conversationId}`
      socket.to(room).emit('new_message', {
        conversationId,
        message,
        senderId: userId,
        sentAt: new Date().toISOString(),
      })
    })

    // --- Đang gõ ---
    socket.on('typing', (conversationId) => {
      if (!conversationId) return
      socket.to(`conv:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
      })
    })

    // --- Ngừng gõ ---
    socket.on('stop_typing', (conversationId) => {
      if (!conversationId) return
      socket.to(`conv:${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId,
      })
    })

    // --- Disconnect ---
    socket.on('disconnect', (reason) => {
      console.log(`[CHAT] Disconnected: ${socket.id} | reason=${reason}`)
      
      const count = global.onlineUsers.get(userId) || 0
      if (count <= 1) {
        global.onlineUsers.delete(userId)
        chatNsp.emit('user_offline', userId)
      } else {
        global.onlineUsers.set(userId, count - 1)
      }
    })
  })
}

export default setupChatNamespace
