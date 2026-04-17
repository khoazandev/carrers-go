import { useState } from 'react'
import { Card } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { LoadingSpinner } from '@shared/components'
import { Search, MapPin, CheckCircle2, XCircle, BriefcaseBusiness, AlertCircle } from 'lucide-react'
import { useAdminPendingJobs, useApproveAdminJob, useRejectAdminJob } from '@features/admin/hooks/useAdmin'

export default function ManageJobsPage() {
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, isError } = useAdminPendingJobs({ page, limit })
  const approveJob = useApproveAdminJob()
  const rejectJob = useRejectAdminJob()

  const handleApprove = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn DUYỆT hiển thị tin "${title}"?`)) {
      approveJob.mutate(id)
    }
  }

  const handleReject = (id, title) => {
    const reason = window.prompt(`Thu hồi & Gạch bỏ tin "${title}".\nVui lòng nhập lý do từ chối (Gửi tới doanh nghiệp):`, 'Tin tuyển dụng có dấu hiệu vi phạm chính sách nội dung.')
    if (reason !== null) {
      rejectJob.mutate({ id, reason })
    }
  }

  // Formatting currency for Salary
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận'
    if (min && !max) return `Từ ${min.toLocaleString('vi-VN')} VND`
    if (!min && max) return `Đến ${max.toLocaleString('vi-VN')} VND`
    return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} VND`
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
              <BriefcaseBusiness className="w-6 h-6" />
            </div>
            Bộ Lọc Trạm Uy Tín (Job Moderation)
          </h1>
          <p className="text-[#637381] dark:text-[#919EAB] font-medium mt-3 max-w-2xl">
            Tất cả các tin tuyển dụng đăng bởi doanh nghiệp mới đều phải qua khu vực này để được kiểm duyệt thủ công nhằm bảo vệ hệ sinh thái Ứng viên.
          </p>
        </div>
      </div>

      <Card variant="glass" className="w-full bg-[#FAFBFA] dark:bg-[#141A21] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] p-0">
        
        {isLoading ? (
           <div className="w-full flex-col min-h-[400px] flex items-center justify-center p-8 bg-white dark:bg-[#1C252E]">
             <LoadingSpinner />
             <p className="mt-4 text-green-500 font-bold animate-pulse">Hệ thống đang quét tin chờ duyệt...</p>
           </div>
        ) : isError ? (
           <div className="p-8 text-center text-rose-500 font-bold bg-white dark:bg-[#1C252E]">
             Hệ thống lưới dữ liệu (Grid) từ chối phản hồi.
           </div>
        ) : (
          <div className="p-6 md:p-8 bg-transparent">
            {(!data?.data || data.data.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[rgba(145,158,171,0.2)] rounded-3xl bg-white dark:bg-[#1C252E]">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1C252E] dark:text-white mb-2">Trạm kiểm duyệt an toàn trống rỗng!</h3>
                <p className="text-[#637381] dark:text-[#919EAB] font-medium">Toàn bộ tin đăng đã được thẩm định. Không có rác hệ thống vào lúc này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((job) => (
                  <div key={job._id} className="group flex flex-col bg-white dark:bg-white/[0.04] rounded-3xl border border-[rgba(145,158,171,0.12)] hover:border-green-500/30 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)] transition-all duration-300">
                    
                    {/* Job Header & Meta */}
                    <div className="p-6 flex-1 border-b border-[rgba(145,158,171,0.08)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending
                        </span>
                        <span className="text-xs font-bold text-[#919EAB] uppercase ml-auto">
                          {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <h3 className="text-[17px] font-extrabold text-[#1C252E] dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {job.title}
                      </h3>
                      
                      <div className="text-[13px] font-bold text-[#637381] dark:text-[#919EAB] truncate mb-5">
                        Tại: <span className="text-green-500">{job.companyId?.name || 'Vô danh'}</span>
                      </div>

                      <div className="space-y-2 mb-2">
                        <div className="flex items-center gap-2 text-[13px] text-[#637381] dark:text-[#919EAB] font-medium">
                          <MapPin className="w-4 h-4 shrink-0 text-[#919EAB]" />
                          <span className="truncate">{job.location?.city || 'Toàn quốc'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="w-4 h-4 shrink-0 flex items-center justify-center font-extrabold">$</span>
                          <span>{job.salary ? formatSalary(job.salary.min, job.salary.max) : 'Thỏa thuận'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions Panel */}
                    <div className="p-4 bg-[rgba(145,158,171,0.02)] flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReject(job._id, job.title)}
                        disabled={rejectJob.isPending}
                        className="flex-1 rounded-xl h-11 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold tracking-wide"
                      >
                        Thu hồi
                      </Button>
                      <Button 
                        variant="solid" 
                        size="sm" 
                        onClick={() => handleApprove(job._id, job.title)}
                        disabled={approveJob.isPending}
                        className="flex-1 rounded-xl h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-transform"
                      >
                        Duyệt Tin
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
