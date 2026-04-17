import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@shared/hooks'
import useAuthStore from '@app/store/authStore'
import { useMyJobs } from '@features/jobs/hooks/useJobs'
import { JOB_STATUS } from '@shared/constants'
import { LoadingSpinner } from '@shared/components'
import { formatDate, getStatusColor, getStatusLabel } from '@shared/utils'
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { 
  Briefcase, CheckCircle, Clock, FileText, Target, AlertCircle, TrendingUp
} from 'lucide-react'

import StatCard from '@shared/components/ui/StatCard'
import WelcomeCard from '@shared/components/ui/WelcomeCard'

export default function HRDashboard() {
  useDocumentTitle('Dashboard Tuyển Dụng')
  const { user } = useAuthStore()
  
  // Lấy dữ liệu jobs để phân tích dashboard
  const { data, isLoading } = useMyJobs({ page: 1, limit: 50 })
  const jobs = data?.data || []

  // Tính toán số liệu thống kê
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      published: jobs.filter(j => j.status === JOB_STATUS.PUBLISHED).length,
      pending: jobs.filter(j => j.status === JOB_STATUS.PENDING).length,
      draft: jobs.filter(j => j.status === JOB_STATUS.DRAFT).length,
      closed: jobs.filter(j => j.status === JOB_STATUS.CLOSED).length,
    }
  }, [jobs])

  // Dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    return [
      { name: 'Đang tuyển', value: stats.published, color: '#10b981' }, // Success
      { name: 'Chờ duyệt', value: stats.pending, color: '#f59e0b' },    // Warning
      { name: 'Bản nháp', value: stats.draft, color: '#64748b' },       // Muted
      { name: 'Đã đóng', value: stats.closed, color: '#ef4444' },       // Danger
    ].filter(item => item.value > 0) // Chỉ hiển thị phần có dữ liệu
  }, [stats])

  // Dữ liệu biểu đồ cột (Lượt ứng tuyển giả lập dựa trên vị trí)
  const barChartData = useMemo(() => {
    // Sẽ gom nhóm theo location (Tỉnh thành) của công việc
    const locationCounts = {}
    jobs.forEach(job => {
      if (job.location) {
        const loc = job.location.split(' - ')[0] || job.location
        locationCounts[loc] = (locationCounts[loc] || 0) + 1
      } else {
        locationCounts['Khác'] = (locationCounts['Khác'] || 0) + 1
      }
    })
    
    return Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Lấy top 5 khu vực
  }, [jobs])

  // 5 jobs mới nhất
  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [jobs])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center fade-in">
        <LoadingSpinner />
      </div>
    )
  }

  // Nếu HR chưa có công ty
  if (!user?.companyId) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 fade-in">
        <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-premium mt-8">
          <AlertCircle size={64} className="text-warning mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Hãy hoàn thiện hồ sơ doanh nghiệp!</h2>
          <p className="text-muted-foreground max-w-lg mb-8">
            Bạn cần phải tạo hoặc tham gia vào một công ty trước khi có thể bắt đầu quá trình tuyển dụng để hệ thống định danh thương hiệu của bạn.
          </p>
          <Link to="/hr/company" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            Cập nhật Hồ Sơ Công Ty
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 fade-in">
      {/* Welcome Section */}
      <WelcomeCard 
        userName={user?.profile?.fullName} 
        companyName={user?.companyId?.name} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Tin Tuyển Dụng"
          value={stats.total}
          icon={Briefcase}
          iconBg="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] shadow-[#6366f1]/25"
          trend={{ value: '+1', positive: true }}
        />
        <StatCard
          title="Đang Tuyển"
          value={stats.published}
          icon={Target}
          iconBg="bg-gradient-to-br from-success to-success-dark shadow-success/25"
        />
        <StatCard
          title="Chờ Admin Duyệt"
          value={stats.pending}
          icon={Clock}
          iconBg="bg-gradient-to-br from-warning to-[#d97706] shadow-warning/25"
        />
        <StatCard
          title="Bản Nháp"
          value={stats.draft}
          icon={FileText}
          iconBg="bg-gradient-to-br from-[#64748b] to-[#475569] shadow-[#64748b]/25"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Chart & Pipeline overview */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-4">Phân bố Trạng thái</h3>
            
            <div className="h-[250px] w-full flex flex-col justify-center min-h-[250px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="var(--color-card)"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)', 
                        borderColor: 'var(--color-border)', 
                        borderRadius: '12px',
                        color: 'var(--color-foreground)',
                        boxShadow: 'var(--shadow-premium)'
                      }}
                      itemStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col flex-1">
            <h3 className="text-lg font-bold text-foreground mb-4">Vị trí địa lý công việc</h3>
            <div className="h-[220px] w-full flex flex-col justify-center min-h-[220px]">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-muted)' }}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)', 
                        borderColor: 'var(--color-border)', 
                        borderRadius: '12px',
                        color: 'var(--color-foreground)',
                        boxShadow: 'var(--shadow-premium)'
                      }}
                    />
                    <Bar dataKey="count" name="Số công việc" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Jobs */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Tin Tuyển Dụng Gần Đây</h3>
            <Link to="/hr/jobs" className="text-sm font-semibold text-accent hover:text-accent-dark transition-colors">
              Xem tất cả →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job._id} className="group p-4 rounded-xl border border-border hover:border-accent/40 bg-background/50 hover:bg-muted/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(job.createdAt)}
                      </span>
                      {job.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="truncate">{job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <span 
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        job.status === JOB_STATUS.PUBLISHED ? 'bg-success/10 text-success-light border border-success/20' :
                        job.status === JOB_STATUS.DRAFT ? 'bg-muted text-muted-foreground border border-border' :
                        job.status === JOB_STATUS.PENDING ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-error/10 text-error border border-error/20'
                      }`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                    <Link 
                      to={job.status === JOB_STATUS.DRAFT ? `/hr/jobs/${job._id}/edit` : `/hr/jobs/${job._id}/applications`} 
                      className="text-sm font-medium text-foreground hover:text-accent underline decoration-border hover:decoration-accent underline-offset-4"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-4">Bạn chưa tạo tin tuyển dụng nào.</p>
                <Link to="/hr/jobs/create" className="inline-flex items-center justify-center px-5 py-2 bg-background border border-border text-foreground hover:border-accent hover:text-accent font-medium rounded-lg transition-colors">
                  Tạo Tin Đầu Tiên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
