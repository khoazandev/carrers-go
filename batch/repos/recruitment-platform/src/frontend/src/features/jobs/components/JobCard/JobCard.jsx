// 1. React
import { useState } from 'react'

// 2. Third-party
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Briefcase, Heart, Building2, ChevronRight } from 'lucide-react'

// 3. App-level
import useAuthStore from '@app/store/authStore'

// 4. Shared
import { formatSalary, timeAgo, resolveAssetUrl } from '@shared/utils'
import { Card } from '@shared/components/ui/card'

// 5. Feature
import { useToggleFavoriteJob } from '@features/jobs'

// Design System Easing
const premiumSpring = [0.22, 1, 0.36, 1]

export default function JobCard({ job, style }) {
  const navigate = useNavigate()
  const isCandidate = useAuthStore(state => state.isCandidate())
  const [isAnim, setIsAnim] = useState(false)
  const { mutate } = useToggleFavoriteJob()

  const company = job.companyId || {}

  const handleClick = () => {
    navigate(`/jobs/${job._id}`)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    if (!isCandidate) return

    if (!job.isSaved) {
      setIsAnim(true)
      setTimeout(() => setIsAnim(false), 300)
    }

    mutate(job._id)
  }

  return (
    <Card 
      className="job-card relative flex flex-col h-full bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] p-6 shadow-none hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] transition-all duration-300 group cursor-pointer rounded-2xl overflow-hidden" 
      style={style} 
      onClick={handleClick}
    >
      <div className="job-card__inner flex flex-col flex-1">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl border border-[rgba(145,158,171,0.12)] p-2 bg-white flex flex-shrink-0 items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 ease-in-out">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
          ) : (
            <div className="text-xl font-bold text-[#637381]">
              {(company.name || 'C').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Title & Company */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1.5 line-clamp-2 text-[#1C252E] dark:text-white group-hover:text-[#22c55e] transition-colors tracking-tight leading-tight">
            {job.title}
          </h3>
          <p className="text-sm text-[#637381] dark:text-[#C4CDD5] font-semibold tracking-tight truncate">
            {company.name || 'Công ty ẩn danh'}
          </p>
        </div>

        <div className="job-card__meta mb-2">
          <span className="job-card__meta-item block mb-2 text-sm text-[#637381] dark:text-[#C4CDD5]">
            {job.location || 'Chưa cập nhật'}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#637381] dark:text-[#919EAB] font-bold tracking-wider uppercase bg-[rgba(145,158,171,0.08)] px-2.5 py-1 rounded-lg w-fit">
            <Briefcase className="w-3.5 h-3.5 text-[#22c55e]" /> {job.employmentType || 'Full Time'}
          </span>
        </div>
        {job.experienceLevel && (
          <div className="flex mb-4">
            <span className="flex items-center gap-1.5 text-[11px] text-[#637381] dark:text-[#919EAB] font-bold tracking-wider uppercase bg-[rgba(145,158,171,0.08)] px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#FFAB00]" /> {job.experienceLevel}
            </span>
          </div>
        )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-[rgba(145,158,171,0.08)] text-[#637381] border border-[rgba(145,158,171,0.12)] text-[10px] font-bold uppercase tracking-wider rounded-md">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Area */}
      <div className="mt-auto pt-5 border-t border-[rgba(145,158,171,0.12)] dark:border-white/10 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#919EAB] mb-1">Mức Lương</span>
            <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#22c55e] to-[#10b981] bg-clip-text text-transparent">
              {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCandidate && (
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${job.isSaved ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'} ${isAnim ? 'animate-pop' : ''}`}
                onClick={handleSave}
                title={job.isSaved ? "Bỏ lưu tin này" : "Lưu tin này"}
              >
                <Heart className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold tracking-wide text-[#919EAB]">
          <span>{timeAgo(job.createdAt)}</span>
        </div>
      </div>
      </div>
    </Card>
  )
}
