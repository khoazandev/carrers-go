import useNotificationStore from '@app/store/notificationStore'
import { Bell } from 'lucide-react'
import './NotificationBell.css'

export default function NotificationBell({ onClick, className }) {
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  return (
    <button
      className={`relative inline-flex items-center justify-center transition-colors ${className}`}
      onClick={onClick}
      title="Thông báo"
      aria-label={`Thông báo${unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ''}`}
    >
      <Bell className="w-[22px] h-[22px] shrink-0" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white dark:ring-[#1C252E]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
