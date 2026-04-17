// 1. React
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Search, CheckCircle2, Clock, X, Send, Eye, UserCheck, Calendar, MessageSquare, Gift, Star } from 'lucide-react'

// 2. Shared
import { EmptyState } from '@shared/components/states/empty-state'
import { useDocumentTitle } from '@shared/hooks'

// 3. Feature
import { useMyApplications } from '@features/applications/hooks/useApplications'
import JobCard from '@features/jobs/components/JobCard/JobCard'

// Status config — matches backend APPLICATION_STATUS (lowercase)
const STATUS_CONFIG = {
  submitted: { label: 'Đã nộp', icon: Send, colors: 'bg-blue-100/90 text-blue-700 border-blue-300' },
  reviewing: { label: 'Đang xem xét', icon: Eye, colors: 'bg-amber-100/90 text-amber-700 border-amber-300' },
  shortlisted: { label: 'Vào danh sách ngắn', icon: Star, colors: 'bg-indigo-100/90 text-indigo-700 border-indigo-300' },
  interview_scheduled: { label: 'Lịch phỏng vấn', icon: Calendar, colors: 'bg-cyan-100/90 text-cyan-700 border-cyan-300' },
  interviewed: { label: 'Đã phỏng vấn', icon: MessageSquare, colors: 'bg-purple-100/90 text-purple-700 border-purple-300' },
  offered: { label: 'Đề nghị tuyển', icon: Gift, colors: 'bg-green-100/90 text-green-700 border-green-300' },
  hired: { label: 'Đã tuyển', icon: CheckCircle2, colors: 'bg-emerald-100/90 text-emerald-700 border-emerald-300' },
  rejected: { label: 'Từ chối', icon: X, colors: 'bg-rose-100/90 text-rose-700 border-rose-300' },
  withdrawn: { label: 'Đã rút đơn', icon: X, colors: 'bg-gray-100/90 text-gray-700 border-gray-300' },
}

export default function AppliedJobsPage() {
  useDocumentTitle('Việc làm đã ứng tuyển')
  const { data: response, isLoading } = useMyApplications()
  
  const applications = useMemo(() => {
    const raw = response?.data
    return Array.isArray(raw) ? raw : []
  }, [response])

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C252E] dark:text-white mb-2">Việc làm đã ứng tuyển</h1>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium">Lịch sử và trạng thái các vị trí ứng tuyển của bạn</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 relative">
          <div className="w-10 h-10 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-4" />
        </div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full relative transition-all duration-300">
          {applications.map((app) => {
            const statusConf = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted
            const StatusIcon = statusConf.icon

            return (
              <div key={app._id} className="relative group/app">
                <JobCard job={app.job || {}} />
                
                {/* Application Status Badge */}
                <div className={`absolute top-6 left-6 z-10 px-3 py-1.5 rounded-full backdrop-blur-md font-bold text-[10px] tracking-widest uppercase border shadow-sm flex items-center gap-1.5 ${statusConf.colors}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConf.label}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState 
          icon={Briefcase}
          title="Bạn chưa ứng tuyển công việc nào"
          description="Đẩy mạnh sự nghiệp bằng cách gửi CV ứng tuyển vào hàng ngàn vị trí IT đang mở nhé."
          action={
            <Link to="/jobs" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1C252E] dark:bg-white px-8 text-sm font-bold text-white dark:text-[#1C252E] hover:bg-[#22c55e] dark:hover:bg-[#22c55e] transition-colors hover:text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)]">
               <Search className="w-4 h-4 mr-2" /> Trải nghiệm ứng tuyển
            </Link>
          }
        />
      )}
    </div>
  )
}
