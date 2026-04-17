import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { LoadingSpinner } from '@shared/components'
import { JOB_STATUS } from '@shared/constants'
import { formatDate, getStatusLabel } from '@shared/utils'
import { useMyJobs, useDeleteJob, useUpdateJobStatus } from '@features/jobs/hooks/useJobs'
import { 
  Plus, Edit2, Trash2, Users, FileQuestion, MapPin, Clock, Briefcase, 
  ChevronLeft, ChevronRight, AlertCircle 
} from 'lucide-react'

// Status tabs config
const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: JOB_STATUS.DRAFT, label: 'Nháp' },
  { key: JOB_STATUS.PENDING, label: 'Chờ duyệt' },
  { key: JOB_STATUS.PUBLISHED, label: 'Đã đăng' },
  { key: JOB_STATUS.REJECTED, label: 'Từ chối' },
  { key: JOB_STATUS.CLOSED, label: 'Đã đóng' },
]

// Allowed status transitions for HR
const STATUS_TRANSITIONS = {
  [JOB_STATUS.DRAFT]: [
    { value: JOB_STATUS.PENDING, label: '→ Gửi duyệt' },
    { value: JOB_STATUS.PUBLISHED, label: '→ Đăng ngay' },
  ],
  [JOB_STATUS.PENDING]: [
    { value: JOB_STATUS.DRAFT, label: '→ Về nháp' },
    { value: JOB_STATUS.PUBLISHED, label: '→ Đăng ngay' },
  ],
  [JOB_STATUS.PUBLISHED]: [
    { value: JOB_STATUS.CLOSED, label: '→ Đóng tin' },
  ],
  [JOB_STATUS.CLOSED]: [
    { value: JOB_STATUS.PUBLISHED, label: '→ Mở lại' },
  ],
}

export default function MyJobsPage() {
  useDocumentTitle('Tin tuyển dụng')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const limit = 10
  const params = { page, limit, ...(activeTab && { status: activeTab }) }
  const { data, isLoading } = useMyJobs(params)
  const deleteJob = useDeleteJob()
  const updateJobStatus = useUpdateJobStatus()

  const jobs = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = Math.ceil(total / limit)

  // -------------------------------------------
  // Handlers
  // -------------------------------------------
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setPage(1)
  }

  const handleDelete = (job) => {
    setDeleteTarget(job)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteJob.mutate(deleteTarget._id, {
        onSuccess: () => setDeleteTarget(null),
      })
    }
  }

  const handleStatusChange = (jobId, newStatus) => {
    updateJobStatus.mutate({ id: jobId, status: newStatus })
  }

  // -------------------------------------------
  // Render
  // -------------------------------------------

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tin tuyển dụng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi trạng thái các vị trí tuyển dụng
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground focus-ring font-semibold px-5 py-2.5 rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-sm"
          onClick={() => navigate('/hr/jobs/create')}
        >
          <Plus size={18} />
          Tạo tin mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-muted/50 p-1.5 rounded-xl overflow-x-auto scrollbar-hide border border-border">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`whitespace-nowrap px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === key 
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border/50' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            onClick={() => handleTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
          <FileQuestion size={48} className="text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {activeTab ? `Không có tin nào ở trạng thái "${getStatusLabel(activeTab)}"` : 'Chưa có tin tuyển dụng nào'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {!activeTab && 'Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên để thu hút những ứng viên tiềm năng gia nhập đội ngũ của bạn.'}
          </p>
          {!activeTab && (
            <button
              className="inline-flex items-center gap-2 bg-card border border-border text-foreground hover:border-accent hover:text-accent font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
              onClick={() => navigate('/hr/jobs/create')}
            >
              <Plus size={18} />
              Tạo tin tuyển dụng
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className={`relative bg-gradient-to-br from-card to-card hover:from-muted/50 hover:to-background border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
                  job.status === JOB_STATUS.DRAFT ? 'opacity-80 grayscale-[20%]' : ''
                }`}
              >
                {/* Header row: Icon + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span 
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                        job.status === JOB_STATUS.PUBLISHED ? 'bg-success/10 text-success-light border border-success/20' :
                        job.status === JOB_STATUS.DRAFT ? 'bg-muted text-muted-foreground border border-border' :
                        job.status === JOB_STATUS.PENDING ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-error/10 text-error border border-error/20'
                      }`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                    {STATUS_TRANSITIONS[job.status]?.length > 0 && (
                      <select
                        className="bg-background text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 outline-none hover:border-accent cursor-pointer w-28 appearance-none focus:ring-accent"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusChange(job._id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                      >
                        <option value="" disabled>Chuyển Đổi</option>
                        {STATUS_TRANSITIONS[job.status].map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <Link to={`/hr/jobs/${job._id}`} className="font-bold text-[15px] text-foreground truncate leading-tight group-hover:text-accent transition-colors block">
                    {job.title}
                  </Link>
                  <p className="text-xs mt-1 font-semibold text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {job.department || 'Phòng ban chung'}
                  </p>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-4 flex-wrap">
                  <span className="flex items-center gap-1 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
                    <MapPin className="w-3 h-3" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
                    <Clock className="w-3 h-3" />
                    {job.employmentType || 'Full-time'}
                  </span>
                </div>

                {/* Footer Action Icons */}
                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <div className="flex flex-col text-[10px] text-muted-foreground">
                    <span className="mb-0.5">Tạo: {formatDate(job.createdAt)}</span>
                    <span>Hạn: {job.expiresAt ? formatDate(job.expiresAt) : 'Vô thời hạn'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {job.status === JOB_STATUS.PUBLISHED && (
                      <button
                        onClick={() => navigate(`/hr/jobs/${job._id}/applications`)}
                        className="p-1.5 bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 rounded-lg transition-colors flex items-center gap-1"
                        title="Xem ứng viên"
                      >
                        <Users size={14} />
                        <span className="text-[10px] font-bold">{job.applicationCount || 0}</span>
                      </button>
                    )}
                    {job.status === JOB_STATUS.DRAFT && (
                      <>
                        <button
                          onClick={() => navigate(`/hr/jobs/${job._id}/edit`)}
                          className="p-2 bg-info/10 border border-info/20 text-info hover:bg-info/20 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
                          className="p-2 bg-error/10 border border-error/20 text-error hover:bg-error/20 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
              <span className="text-sm text-muted-foreground font-medium">
                Trang {page} / {totalPages} — Tổng {total} tin
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        page === pageNum 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border border-transparent text-muted-foreground hover:bg-muted border-border'
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in" onClick={() => setDeleteTarget(null)}>
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-premium border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Xác nhận xóa</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Bạn có chắc chắn muốn xóa bản nháp <span className="font-semibold text-foreground">&ldquo;{deleteTarget.title}&rdquo;</span>? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button 
                className="px-5 py-2.5 rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
                onClick={() => setDeleteTarget(null)}
              >
                Hủy
              </button>
              <button
                className="px-5 py-2.5 rounded-xl font-semibold bg-error text-white hover:bg-error/90 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
                onClick={confirmDelete}
                disabled={deleteJob.isPending}
              >
                {deleteJob.isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
