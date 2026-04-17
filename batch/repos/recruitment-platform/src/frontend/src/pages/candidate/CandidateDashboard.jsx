// 1. React
import { useState, useEffect } from 'react'

// 2. Third-party
import { motion } from 'framer-motion'
import { Briefcase, Bookmark, Eye, TrendingUp } from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

// 3. App-level
import useAuthStore from '@app/store/authStore'

// 4. Shared
import { useDocumentTitle } from '@shared/hooks'

const mockStats = [
  { id: 1, label: 'Việc làm đã nộp', value: '12', increase: '+2 tuần này', icon: Briefcase, color: 'green' },
  { id: 2, label: 'Việc làm đã lưu', value: '24', increase: '+5 tuần này', icon: Bookmark, color: 'yellow' },
  { id: 3, label: 'Lượt xem hồ sơ', value: '156', increase: '+15% tháng này', icon: Eye, color: 'blue' },
]

const mockChartData = [
  { name: 'T2', views: 12, applications: 2 },
  { name: 'T3', views: 25, applications: 3 },
  { name: 'T4', views: 18, applications: 1 },
  { name: 'T5', views: 45, applications: 5 },
  { name: 'T6', views: 30, applications: 2 },
  { name: 'T7', views: 55, applications: 4 },
  { name: 'CN', views: 40, applications: 1 },
]

// Easing presets mapped from SMART_HIRE_DESIGN_SYSTEM.md 9.7 Easing Presets
const premiumSpring = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: premiumSpring }
  }
}

export default function CandidateDashboard() {
  useDocumentTitle('Dashboard Ứng viên')
  const { user } = useAuthStore()

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="max-w-6xl mx-auto w-full pt-4 pb-12"
    >
      {/* Header section (Overline pattern per Section 14) */}
      <motion.div variants={itemVariants} className="mb-12 relative z-10">
        <span className="inline-block text-[#22C55E] text-sm font-bold tracking-widest uppercase mb-4">
          TỔNG QUAN HOẠT ĐỘNG
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1C252E] dark:text-white mb-4">
          Chào mừng trở lại, {user?.profile?.fullName || 'Ứng viên'}!
        </h1>
        <p className="text-lg text-[#637381] dark:text-[#C4CDD5]">
          Theo dõi sát hiêụ suất hiển thị CV và hành trình tìm việc của bạn một cách minh bạch.
        </p>
      </motion.div>

      {/* Stats Grid (Based on Section 6.3 - Grid Patterns & Section 4.2 - Premium Glassmorphism) */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
        {mockStats.map((stat) => {
          const Icon = stat.icon
          const isGreen = stat.color === 'green'
          const isYellow = stat.color === 'yellow'
          
          return (
            <motion.div 
              key={stat.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Glow behind card */}
              <div className={`absolute -inset-1 rounded-[28px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 ${isGreen ? 'bg-gradient-to-r from-[#22C55E]/20 via-[#22C55E]/10 to-[#22C55E]/20' : isYellow ? 'bg-gradient-to-r from-[#FFAB00]/20 via-[#FFAB00]/10 to-[#FFAB00]/20' : 'bg-gradient-to-r from-[#3b82f6]/20 via-[#3b82f6]/10 to-[#3b82f6]/20'}`} />

              <div className="relative backdrop-blur-xl bg-white/70 dark:bg-white/[0.04] border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] rounded-3xl p-8 md:p-10 transition-all duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)] group-hover:-translate-y-1 h-full flex flex-col group-hover:border-[#22C55E]/30 dark:group-hover:border-[#22C55E]/20">
                
                {/* 5.2 Icon Containers */}
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isGreen ? 'bg-gradient-to-br from-[#22c55e] to-[#10b981] shadow-green-500/25' : isYellow ? 'bg-gradient-to-br from-[#FFAB00] to-[#FFD666] shadow-yellow-500/25' : 'bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] shadow-blue-500/25'}`}>
                    <Icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  {/* Subtle stat badge */}
                  <span className="flex items-center text-xs font-bold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.increase}
                  </span>
                </div>

                <div className="mt-auto">
                  {/* Ultra Muted text for labels */}
                  <p className="text-sm font-bold text-[#C4CDD5] dark:text-[#919EAB] uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl sm:text-5xl font-bold text-[#1C252E] dark:text-white tracking-tight">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <motion.div 
        variants={itemVariants}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#22C55E]/10 via-[#22C55E]/5 to-[#22C55E]/10 rounded-[28px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
        
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-white/[0.04] border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] rounded-3xl p-8 md:p-10 transition-all duration-500 group-hover:border-[rgba(145,158,171,0.32)] dark:group-hover:border-white/[0.16] overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[#1C252E] dark:text-white">Tương tác Hồ sơ & Lượt nộp</h3>
              <p className="text-base text-[#637381] dark:text-[#C4CDD5] mt-2">Thống kê dữ liệu tuần này</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-bold px-5 py-3 rounded-full bg-[rgba(145,158,171,0.04)] dark:bg-[rgba(145,158,171,0.08)] border border-[rgba(145,158,171,0.12)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-[#637381] dark:text-[#C4CDD5]">Lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FFAB00]" />
                <span className="text-[#637381] dark:text-[#C4CDD5]">Đã nộp</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFAB00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFAB00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(145,158,171,0.12)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#919EAB', fontSize: 13, fontWeight: 600 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#919EAB', fontSize: 13, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 26, 33, 0.95)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '14px', paddingTop: '4px' }}
                  cursor={{ stroke: 'rgba(145,158,171,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="views" name="Lượt xem Profile" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="applications" name="Lượt Nộp CV" stroke="#FFAB00" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  )
}
