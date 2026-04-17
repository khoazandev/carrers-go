import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCircle2, BellRing, Briefcase, Info, Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@features/notifications/hooks/useNotificationQuery'
import { Button } from '@shared/components/ui/button'
import './NotificationsPage.css'

dayjs.extend(relativeTime)
dayjs.locale('vi')

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all') // 'all' | 'unread'
  
  const { data, isLoading } = useNotifications({
    page: 1, limit: 50, isRead: filter === 'unread' ? false : undefined
  })
  
  const notifications = data || []
  
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead()

  const handleMarkRead = (id, isRead) => {
    if (!isRead) markRead(id)
  }

  const getIcon = (type) => {
    switch (type) {
      case 'application_received': return <Briefcase className="w-5 h-5" />
      case 'status_changed': return <CheckCircle2 className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  return (
    <div className="notifications-page-container">
      <div className="notifications-header">
        <div>
          <h1>Thông báo của bạn</h1>
          <p className="text-sm text-[#637381] dark:text-[#919EAB] mt-1">Cập nhật những hoạt động mới nhất.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="hidden md:flex rounded-lg border-[rgba(145,158,171,0.32)]"
          >
            {filter === 'all' ? 'Xem chưa đọc' : 'Xem tất cả'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isMarkingAll || notifications.length === 0}
            className="text-[#22c55e] hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded-lg"
          >
            <Check className="w-4 h-4 mr-2" />
            Đánh dấu đọc tất cả
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#637381]">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#22c55e]" />
          <p>Đang tải thông báo...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(145,158,171,0.08)] flex items-center justify-center mb-4">
            <BellRing className="w-8 h-8 text-[#919EAB]" />
          </div>
          <h3 className="text-lg font-bold text-[#1C252E] dark:text-white mb-1">Không có thông báo nào!</h3>
          <p className="text-[#637381] dark:text-[#919EAB]">Bạn đã xem hết tất cả các thông báo.</p>
        </div>
      ) : (
        <div className="notifications-list">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => handleMarkRead(notif._id, notif.isRead)}
                className={`notification-card cursor-pointer ${notif.isRead ? '' : 'unread'}`}
              >
                <div className="flex gap-4">
                  <div className={`notification-icon-wrapper ${notif.type}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="notification-content flex-1">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#22c55e] mt-2 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
