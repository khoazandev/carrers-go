import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Search } from 'lucide-react'

// 2. Shared
import { EmptyState } from '@shared/components/states/empty-state'
import { useDocumentTitle } from '@shared/hooks'

// 3. Feature
import { useFavoriteJobs } from '@features/jobs/hooks/useJobs'
import JobCard from '@features/jobs/components/JobCard/JobCard'

export default function SavedJobsPage() {
  useDocumentTitle('Việc làm đã lưu')
  const { data: response, isLoading } = useFavoriteJobs({ limit: 50 })

  const jobs = useMemo(() => {
    const rawJobs = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
    return rawJobs.map(fav => ({ ...fav, job: { ...fav.job, isSaved: true } }))
  }, [response])

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C252E] dark:text-white mb-2">Việc làm đã lưu</h1>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium">Theo dõi những cơ hội đang chờ bạn ứng tuyển</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 z-10 relative">
          <div className="w-10 h-10 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-4" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full relative z-10 transition-all duration-300">
          {jobs.map((fav) => (
            <JobCard key={fav._id || fav.job?._id} job={fav.job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="Chưa có việc làm nào được lưu"
          description="Bạn chưa lưu bất kỳ công việc nào. Khám phá hàng ngàn công việc HOT và đánh dấu lại để ứng tuyển sau nhé!"
          action={
            <Link to="/candidate/jobs" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1C252E] dark:bg-white px-8 text-sm font-bold text-white dark:text-[#1C252E] hover:bg-[#22c55e] dark:hover:bg-[#22c55e] transition-colors hover:text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)]">
              <Search className="w-4 h-4 mr-2" /> Khám phá việc làm
            </Link>
          }
        />
      )}
    </div>
  )
}

