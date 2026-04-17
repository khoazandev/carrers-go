import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  ChevronLeft,
  Bell
} from 'lucide-react'

// 3. App-level
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'

// 4. Shared
import { NotificationBell } from '@shared/components'
import { Button } from '@shared/components/ui/button'

// 5. Feature
import { useLogout } from '@features/auth'
import { ChatBadge, ChatWindow } from '@features/chat'
import SupportChatBox from '@features/chat/components/SupportChatBox'

// ============================================
// HR Navigation Menu
// ============================================
const hrMenuGeneral = [
  { to: '/hr/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/hr/company', label: 'Hồ sơ công ty', icon: Building2 },
  { to: '/hr/profile', label: 'Hồ sơ cá nhân', icon: User },
]

const hrMenuRecruitment = [
  { to: '/hr/jobs', label: 'Tin tuyển dụng', icon: Briefcase },
  { to: '/hr/candidates', label: 'Quản lý ứng viên', icon: Users },
]

const allHrMenu = [...hrMenuGeneral, ...hrMenuRecruitment]

// ============================================
// Main Layout Component
// ============================================
export default function HRLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()
  const navigate = useNavigate()
  const location = useLocation()

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  const currentRouteName = allHrMenu.find(m => location.pathname.startsWith(m.to))?.label || 'HR Dashboard'

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#141A21] overflow-hidden relative">
      
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

      {/* ===== SIDEBAR ===== */}
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/25 shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#1C252E] dark:text-white">SmartHire</span>
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
        <nav className="flex-1 py-8 px-4 overflow-y-auto no-scrollbar">
          {/* Section: Tổng quan */}
          {sidebarOpen && (
            <p className="px-4 mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#919EAB]/70 dark:text-[#637381]/70">
              Tổng quan
            </p>
          )}
          <div className="space-y-2 mb-6">
            {hrMenuGeneral.map(({ to, label, icon: Icon }) => {
              const isActive = to === '/hr/dashboard' 
                ? location.pathname === '/hr/dashboard' 
                : location.pathname.startsWith(to)
              return (
                <div key={to} className="relative group">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        layoutId="hr-sidebar-glow"
                        className="absolute inset-0 bg-[#22C55E]/15 dark:bg-[#22C55E]/20 blur-xl rounded-full"
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
                        ? 'bg-[#22C55E]/10 dark:bg-[#22c55e]/15 border border-[#22c55e]/30 shadow-[0_8px_20px_-5px_rgba(34,197,94,0.15)] text-[#1C252E] dark:text-white font-bold' 
                        : 'text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.08)] hover:text-[#1C252E] dark:hover:text-white font-semibold border border-transparent'
                    }`}
                    title={!sidebarOpen ? label : ""}
                  >
                    <Icon className={`w-[22px] h-[22px] shrink-0 transition-transform duration-500 ${isActive ? 'scale-110 text-[#22C55E] drop-shadow-md' : 'group-hover:scale-110'}`} />
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
          </div>

          {/* Divider */}
          {sidebarOpen && (
            <p className="px-4 mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#919EAB]/70 dark:text-[#637381]/70">
              Tuyển dụng
            </p>
          )}
          {!sidebarOpen && (
            <div className="mx-3 my-4 border-t border-[rgba(145,158,171,0.15)]" />
          )}

          {/* Section: Tuyển dụng */}
          <div className="space-y-2">
            {hrMenuRecruitment.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(to)
              return (
                <div key={to} className="relative group">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        layoutId="hr-sidebar-glow"
                        className="absolute inset-0 bg-[#22C55E]/15 dark:bg-[#22C55E]/20 blur-xl rounded-full"
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
                        ? 'bg-[#22C55E]/10 dark:bg-[#22c55e]/15 border border-[#22c55e]/30 shadow-[0_8px_20px_-5px_rgba(34,197,94,0.15)] text-[#1C252E] dark:text-white font-bold' 
                        : 'text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.08)] hover:text-[#1C252E] dark:hover:text-white font-semibold border border-transparent'
                    }`}
                    title={!sidebarOpen ? label : ""}
                  >
                    <Icon className={`w-[22px] h-[22px] shrink-0 transition-transform duration-500 ${isActive ? 'scale-110 text-[#22C55E] drop-shadow-md' : 'group-hover:scale-110'}`} />
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
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-5 border-t border-[rgba(145,158,171,0.2)]">
          <div className={`flex items-center gap-4 p-3 rounded-[20px] mb-4 transition-colors ${sidebarOpen ? 'bg-[#F9FAFB] dark:bg-[#1C252E] border border-[rgba(145,158,171,0.15)] dark:border-[rgba(145,158,171,0.1)] shadow-sm' : 'justify-center border border-transparent'}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white flex items-center justify-center font-extrabold text-xl shadow-inner shrink-0">
              {user?.profile?.fullName?.charAt(0)?.toUpperCase() || 'H'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[15px] font-bold text-[#1C252E] dark:text-white truncate tracking-tight">{user?.profile?.fullName || 'HR User'}</p>
                <p className="text-[13px] text-[#0EA5E9] font-semibold truncate uppercase mt-0.5 tracking-wider">Nhà tuyển dụng</p>
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 h-12 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/15 rounded-xl transition-all font-semibold ${!sidebarOpen ? 'px-0' : ''}`}
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

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-transparent relative transition-all duration-500">
        
        {/* Top Header */}
        <header className="h-20 backdrop-blur-xl bg-white/95 dark:bg-[#141A21]/95 border-b border-[rgba(145,158,171,0.2)] flex items-center justify-between px-6 md:px-12 z-20 shrink-0">
          <div className="flex items-center gap-4">
            {isMobile && !sidebarOpen && (
              <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-xl shrink-0 mr-2">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-[#919EAB] font-bold uppercase tracking-[0.2em] mb-1">Không gian Tuyển dụng</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">{currentRouteName}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="p-2.5 rounded-full bg-[#F9FAFB] dark:bg-[#1C252E] shadow-sm border border-[rgba(145,158,171,0.15)] dark:border-[rgba(145,158,171,0.1)] hover:bg-[#F4F6F8] dark:hover:bg-[#212B36] transition-colors cursor-pointer group">
              <NotificationBell onClick={() => navigate('/hr/notifications')} className="text-[#919EAB] group-hover:text-[#1C252E] dark:group-hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-6 md:p-10 hide-scrollbar bg-transparent">
          <div className="max-w-[1400px] mx-auto w-full relative">
            <Outlet />
          </div>
          
          <ChatBadge />
          <ChatWindow />
        </div>
      </main>

      <SupportChatBox />
    </div>
  )
}
