// 1. React
import { useState } from 'react'

// 2. Third-party libraries
import { BriefcaseBusiness } from 'lucide-react'

// 4. Shared
import { useDocumentTitle, useDebounce } from '@shared/hooks'

// 5. Feature
import { useInfiniteJobs } from '@features/jobs/hooks/useInfiniteJobs'

// 6. Relative imports
import JobSearchBar from '@features/jobs/components/JobSearchBar/JobSearchBar'
import JobFilterPanel from '@features/jobs/components/JobFilterPanel/JobFilterPanel'
import JobVirtualizedList from '@features/jobs/components/JobVirtualizedList/JobVirtualizedList'

export default function JobListPage() {
  useDocumentTitle('Khám phá việc làm')

  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState({})
  const debouncedKeyword = useDebounce(keyword, 500)

  const activeFilters = {
    ...filters,
    keyword: debouncedKeyword || undefined,
  }

  const { jobs, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteJobs(activeFilters)

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500 relative z-10">
      
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-block text-[#22C55E] text-sm font-bold tracking-widest uppercase mb-4">
          Cơ Hội Nghề Nghiệp
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C252E] dark:text-white mb-6">
          Khám phá việc làm
        </h1>
        <p className="text-lg md:text-xl text-[#637381] dark:text-[#C4CDD5] max-w-2xl mx-auto flex items-center justify-center gap-2">
          Hàng ngàn cơ hội chất lượng tại các công ty công nghệ hằng đầu đang đón chờ bạn
        </p>
      </div>

      {/* Controls Container */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-white/[0.04] border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] shadow-[0_8px_30px_-5px_rgba(34,197,94,0.05)] rounded-3xl p-6 md:p-8 mb-12 flex flex-col lg:flex-row items-center gap-6 relative z-20 transition-all hover:border-[rgba(145,158,171,0.32)]">
        <div className="flex-1 w-full">
          <JobSearchBar value={keyword} onChange={setKeyword} />
        </div>
        <div className="shrink-0 w-full lg:w-auto">
          <JobFilterPanel filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <JobVirtualizedList
          jobs={jobs}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
        />
      </div>
      
    </div>
  )
}
