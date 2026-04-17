import { useRef, useEffect } from 'react'
import JobCard from '../JobCard/JobCard'

export default function JobVirtualizedList({
  jobs,
  onLoadMore,
  hasMore,
  isLoading,
  isLoadingMore,
}) {
  const sentinelRef = useRef(null)

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-4" />
        <p className="text-[#637381] font-bold tracking-widest uppercase">Đang tải danh sách...</p>
      </div>
    )
  }

  // Empty state
  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center backdrop-blur-xl bg-white/40 dark:bg-white/[0.02] border border-[rgba(145,158,171,0.12)] rounded-3xl">
        <span className="text-6xl mb-6 opacity-80 hover:opacity-100 transition-opacity">🔍</span>
        <h3 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-2">Chưa tìm thấy việc làm phù hợp</h3>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium">Bạn hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-end">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(145,158,171,0.08)] dark:bg-white/[0.04] border border-[rgba(145,158,171,0.12)]">
          <span className="text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest line-clamp-1">Đã tìm thấy</span>
          <span className="text-sm font-extrabold text-[#22c55e]">{jobs.length}</span>
          <span className="text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest">vị trí{hasMore ? '+' : ''}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full relative">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-10 w-full mt-4" />

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex flex-col items-center justify-center py-10 w-full">
          <div className="w-8 h-8 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-3" />
          <span className="text-[10px] font-bold text-[#919EAB] uppercase tracking-widest">Đang tải thêm...</span>
        </div>
      )}
    </div>
  )
}
