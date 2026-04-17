import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft,
  Users,
  BriefcaseBusiness,
  MessagesSquare,
  FileEdit
} from 'lucide-react'

// App-level
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'

// Shared
import { NotificationBell } from '@shared/components'
import { Button } from '@shared/components/ui/button'

// Feature
import { useLogout } from '@features/auth'

const adminMenu = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Quản lý Người dùng', icon: Users },
  { to: '/admin/jobs', label: 'Quản lý Tin tuyển dụng', icon: BriefcaseBusiness },
  { to: '/admin/support', label: 'Hỗ trợ Khách hàng', icon: MessagesSquare },
  { to: '/admin/companies', label: 'Duyệt Company', icon: Building2 },
  { to: '/admin/contents', label: 'Quản lý Nội dung CMS', icon: FileEdit },
  { to: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings },
]

export default function AdminLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar, toggleTheme } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()
  const navigate = useNavigate()
  const location = useLocation()

  // For mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  const currentRouteName = adminMenu.find(m => location.pathname.startsWith(m.to))?.label || 'Quản trị'

  return (
    <div className="flex h-screen w-full bg-[#FAFBFA] dark:bg-[#141A21] overflow-hidden relative">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : (isMobile ? 0 : 88),
          x: isMobile && !sidebarOpen ? -280 : 0
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed md:relative z-50 h-full flex flex-col backdrop-blur-xl bg-white/80 dark:bg-[#141A21]/80 border-r border-[rgba(145,158,171,0.2)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
      >
        {/* Header & Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[rgba(145,158,171,0.2)]">
          <AnimatePresence mode="popLayout">
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/25 shrink-0">
                  <span className="text-white font-bold text-xl leading-none">A</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#1C252E] dark:text-white">AdminHub</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={`rounded-xl h-11 w-11 shrink-0 bg-[rgba(145,158,171,0.04)] dark:bg-[rgba(145,158,171,0.08)] hover:bg-[rgba(145,158,171,0.12)] border border-transparent ${!sidebarOpen && !isMobile ? 'mx-auto' : ''}`}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-[#637381] dark:text-[#919EAB]" /> : <Menu className="w-5 h-5 text-[#1C252E] dark:text-white" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {adminMenu.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to)
            return (
              <div key={to} className="relative group">
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-glow-admin"
                      className="absolute inset-0 bg-green-500/15 dark:bg-green-500/20 blur-xl rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </AnimatePresence>

                <NavLink 
                  to={to} 
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-full transition-all duration-500 relative z-10 ${
                    isActive 
                      ? 'bg-green-500/10 dark:bg-green-500/15 border border-green-500/30 shadow-[0_8px_20px_-5px_rgba(99,102,241,0.15)] text-[#1C252E] dark:text-white font-bold' 
                      : 'text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.08)] hover:text-[#1C252E] dark:hover:text-white font-semibold border border-transparent'
                  }`}
                  title={!sidebarOpen ? label : ""}
                >
                  <Icon className={`w-[22px] h-[22px] shrink-0 transition-transform duration-500 ${isActive ? 'scale-110 text-green-600 dark:text-green-400 drop-shadow-md' : 'group-hover:scale-110'}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-[15px] tracking-tight"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </div>
            )
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-5 border-t border-[rgba(145,158,171,0.2)] bg-[rgba(145,158,171,0.02)]">
          <div className={`flex items-center gap-4 p-3 rounded-[20px] mb-4 transition-colors ${sidebarOpen ? 'bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.2)] shadow-sm' : 'justify-center border border-transparent'}`}>
            <div className="w-12 h-12 rounded-2xl bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center font-extrabold text-xl shadow-inner shrink-0">
              {user?.profile?.fullName?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[15px] font-bold text-[#1C252E] dark:text-white truncate tracking-tight">{user?.profile?.fullName || 'Quản trị viên'}</p>
                <p className="text-[13px] text-green-600 dark:text-green-400 font-semibold truncate uppercase mt-0.5 tracking-wider">Super Admin</p>
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 h-12 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/15 rounded-xl transition-all font-semibold ${!sidebarOpen ? 'px-0 bg-transparent' : ''}`}
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Đăng xuất
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-transparent relative z-10 transition-all duration-500">
        
        {/* Top Header */}
        <header className="h-20 backdrop-blur-xl bg-white/95 dark:bg-[#141A21]/95 border-b border-[rgba(145,158,171,0.2)] flex items-center justify-between px-6 md:px-12 z-20 shrink-0">
          <div className="flex items-center gap-6">
            {isMobile && !sidebarOpen && (
              <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-xl shrink-0 bg-white dark:bg-[#1C252E]">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-[#919EAB] font-bold uppercase tracking-[0.2em] mb-1">Hệ thống Điều hành</span>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1C252E] dark:text-white bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent flex justify-center items-center gap-2">
                {currentRouteName}
              </h2>
            </div>
          </div>
          
          {/* Global Search Bar (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#919EAB] group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Nhập tên user, job, công ty để tìm kiếm..." 
              className="w-full bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border border-transparent focus:border-green-500/30 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-all focus:bg-white dark:focus:bg-[#1C252E] focus:shadow-[0_8px_16px_rgba(79,70,229,0.1)] text-[#1C252E] dark:text-white font-medium"
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center">
               <span className="bg-white dark:bg-[#212B36] border border-[rgba(145,158,171,0.2)] rounded px-1.5 py-0.5 text-[10px] font-bold text-[#919EAB]">Ctrl + K</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <div className="hidden lg:block text-right mr-2">
              <p className="text-[14px] font-bold text-[#1C252E] dark:text-white">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-[#919EAB] text-xs font-semibold uppercase tracking-wider">Trạm quản trị</p>
            </div>
            
            <div className="relative p-2.5 rounded-full bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] hover:bg-[rgba(145,158,171,0.12)] transition-colors cursor-pointer group border border-transparent hover:border-[rgba(145,158,171,0.2)]">
              <NotificationBell onClick={() => navigate('/admin/notifications')} className="text-[#637381] dark:text-[#919EAB] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] hover:bg-[rgba(145,158,171,0.12)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(145,158,171,0.2)] text-[#637381] dark:text-[#919EAB] hover:text-amber-500 dark:hover:text-amber-500 hidden sm:flex items-center justify-center group"
              title="Giao diện Sáng/Tối"
            >
              <svg className="w-5 h-5 dark:hidden group-hover:rotate-[360deg] transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              <svg className="w-5 h-5 hidden dark:block group-hover:rotate-90 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>

            {/* Top User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-purple-600 shrink-0 border-2 border-white dark:border-[#141A21] shadow-md flex justify-center items-center text-white font-bold cursor-pointer hover:shadow-green-500/50 transition-shadow">
              {user?.profile?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-6 md:p-10 hide-scrollbar bg-transparent">
          <div className="max-w-[1400px] mx-auto w-full relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
