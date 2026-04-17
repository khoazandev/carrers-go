import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { LoadingSpinner } from '@shared/components'
import { JOB_STATUS } from '@shared/constants'
import { formatDate, getStatusLabel } from '@shared/utils'
import { useMyJobs } from '@features/jobs/hooks/useJobs'
import { 
  Briefcase, Users, Search, FolderOpen, MapPin, Target, ChevronRight, XCircle
} from 'lucide-react'

/**
 * CandidatesPage — Trang tổng hợp quản lý ứng viên
 * Hiển thị danh sách các jobs (Published/Closed) để HR click vào xem Kanban Board
 */
export default function CandidatesPage() {
  useDocumentTitle('Quản lý ứng viên')
  const [searchTerm, setSearchTerm] = useState('')

  // Lấy tất cả jobs (published/closed) — HR có thể xem ứng viên
  const { data, isLoading } = useMyJobs({ page: 1, limit: 50 })

  const allJobs = data?.data || []

  // Lọc chỉ jobs published (có thể xem ứng viên)
  const publishedJobs = useMemo(() => {
    return allJobs.filter(
      (job) =>
        job.status === JOB_STATUS.PUBLISHED || job.status === JOB_STATUS.CLOSED
    )
  }, [allJobs])

  // Search filter
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return publishedJobs
    const term = searchTerm.toLowerCase()
    return publishedJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
    )
  }, [publishedJobs, searchTerm])

  // Loading
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center fade-in">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý ứng viên</h1>
          <p className="text-muted-foreground mt-1">
            Chọn một tin tuyển dụng đang mở để theo dõi toàn bộ pipeline ứng viên
          </p>
        </div>
      </div>

      {/* Summary Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-accent/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Tổng tin tuyển dụng</p>
            <p className="text-xl font-bold text-foreground">{publishedJobs.length}</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-success/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Đang tuyển</p>
            <p className="text-xl font-bold text-foreground">
              {publishedJobs.filter((j) => j.status === JOB_STATUS.PUBLISHED).length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-error/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-error" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Đã đóng</p>
            <p className="text-xl font-bold text-foreground">
              {publishedJobs.filter((j) => j.status === JOB_STATUS.CLOSED).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
          placeholder="Tìm kiếm theo tiêu đề vị trí hoặc địa điểm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content */}
      {filteredJobs.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {searchTerm
              ? 'Không tìm thấy tin tuyển dụng phù hợp'
              : 'Chưa có tin tuyển dụng nào đang nhận ứng viên'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {!searchTerm &&
              'Tuyệt đối chưa có bất kỳ tin tuyển dụng nào được đăng. Hãy bắt đầu đăng tin để thu hút nhân tài gia nhập công ty!'}
          </p>
          {!searchTerm && (
            <Link to="/hr/jobs/create" className="inline-flex items-center gap-2 bg-primary text-primary-foreground focus-ring font-semibold px-6 py-2.5 rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-sm">
              <Briefcase size={18} />
              Tạo tin tuyển dụng mới
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job._id}
              to={`/hr/jobs/${job._id}/applications`}
              className="group relative bg-gradient-to-br from-card to-card hover:from-muted/50 hover:to-background border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span 
                    className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                      job.status === JOB_STATUS.PUBLISHED ? 'bg-success/10 text-success-light border border-success/20' :
                      'bg-error/10 text-error border border-error/20'
                    }`}
                  >
                    {getStatusLabel(job.status)}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                 <h3 className="font-bold text-[15px] text-foreground truncate leading-tight group-hover:text-accent transition-colors block">
                    {job.title}
                 </h3>
                 <p className="text-xs mt-1 font-semibold text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {job.department || 'Phòng ban chung'}
                 </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-4 flex-wrap">
                 <span className="flex items-center gap-1 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
                    <MapPin className="w-3 h-3" />
                    {job.location || 'Remote'}
                 </span>
                 <span className="flex items-center gap-1 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
                    <Briefcase className="w-3 h-3" />
                    {job.employmentType || 'Full-time'}
                 </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                 <div className="flex flex-col text-[10px] text-muted-foreground">
                    <span className="mb-0.5">Đăng lúc: {formatDate(job.createdAt)}</span>
                 </div>
                 <div className="flex items-center gap-1 text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                    Xem Pipeline <ChevronRight className="w-4 h-4"/>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
