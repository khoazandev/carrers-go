import { Suspense, lazy } from 'react'
import { Card } from '@shared/components/ui/card'
import { useDashboardStats } from '@features/admin/hooks/useAdmin'
import { Users, Briefcase, FileText } from 'lucide-react'

const UsersChart = lazy(() => import('@features/dashboard/components/UsersChart'))
const JobsChart = lazy(() => import('@features/dashboard/components/JobsChart'))

const ChartSkeleton = () => (
  <div className="w-full h-[300px] flex items-center justify-center bg-green-50/50 dark:bg-green-500/5 rounded-xl border border-dashed border-green-200 dark:border-green-500/20">
    <span className="text-green-400 font-medium">Đang hệ thống hóa biểu đồ...</span>
  </div>
)

export default function AdminDashboard() {
  const { data: stats, isLoading, isError } = useDashboardStats()

  if (isLoading) {
    return <div className="p-8 text-center text-[#637381] font-medium animate-pulse">Đang nạp dữ liệu trung tâm...</div>
  }

  if (isError) {
    return <div className="p-8 text-center text-rose-500 font-bold">Không thể kết nối đến máy chủ phân tích.</div>
  }

  if (!stats?.overview) {
    return <div className="p-8 text-center text-[#637381] font-medium">Không có dữ liệu báo cáo hệ thống nào tại thời điểm này.</div>
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2">
          Biểu Đồ & Thống Kê Tổng Quan
        </h1>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium">
          Dữ liệu trực quan sức khỏe hệ sinh thái của nền tảng theo thời gian thực.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* User Distribution Chart */}
        <Card variant="glass" className="p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
          <div className="flex items-center gap-3 mb-6 border-b border-[rgba(145,158,171,0.12)] pb-4">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1C252E] dark:text-white">Hệ Sinh Thái Người Dùng</h2>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <UsersChart data={stats.overview.users} />
          </Suspense>
        </Card>

        {/* Jobs Chart */}
        <Card variant="glass" className="p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
          <div className="flex items-center gap-3 mb-6 border-b border-[rgba(145,158,171,0.12)] pb-4">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1C252E] dark:text-white">Phân Tích Tuyển Dụng</h2>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <JobsChart data={stats.overview.jobs} />
          </Suspense>
        </Card>

        {/* Recent Pending Jobs */}
        <Card variant="glass" className="p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-[rgba(145,158,171,0.12)] pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFAB00]/10 text-[#FFAB00] rounded-xl flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#1C252E] dark:text-white">Tin chờ duyệt (Mới nhất)</h2>
            </div>
            <span className="text-xs font-bold text-white bg-rose-500 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
              {stats.recentPending?.jobs?.length || 0} TIN MỚI
            </span>
          </div>

          {stats.recentPending?.jobs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {stats.recentPending.jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl border border-[rgba(145,158,171,0.12)] hover:border-green-500/30 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)] hover:shadow-lg transition-all group flex flex-col justify-center"
                >
                  <div className="font-bold text-[#1C252E] dark:text-white truncate mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {job.title}
                  </div>
                  <div className="text-[13px] font-semibold text-[#637381] dark:text-[#919EAB] truncate border-t border-[rgba(145,158,171,0.1)] pt-2 mt-2">
                    {job.companyId?.name || 'Công ty không xác định'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-[#637381] dark:text-[#919EAB] font-medium text-lg">
                Chúc mừng! Không còn tin tuyển dụng nào đang tồn đọng xếp hàng chờ duyệt.
              </p>
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
