import { useState } from 'react'
import { CheckCircle2, Lock, XCircle, Globe, Briefcase } from 'lucide-react'

import { LoadingSpinner } from '@shared/components'
import { resolveAssetUrl } from '@shared/utils'
import { Card } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'

import {
  useApproveCompany,
  useLockCompany,
  usePendingCompanies,
  useRejectCompany,
} from '../hooks/useAdmin'

export default function PendingCompanyList() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = usePendingCompanies({ page, limit })
  const approveCompany = useApproveCompany()
  const rejectCompany = useRejectCompany()
  const lockCompany = useLockCompany()

  if (isLoading) {
    return (
      <Card variant="glass" className="w-full flex flex-col min-h-[400px] items-center justify-center border-dashed border-green-200 dark:border-green-500/20 p-8 shadow-sm">
        <LoadingSpinner />
        <p className="mt-4 text-green-500 font-bold animate-pulse">Đang nạp dữ liệu hồ sơ công ty chờ duyệt...</p>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card variant="glass" className="p-8 text-center text-rose-500 font-bold border-rose-200 dark:border-rose-900/50 shadow-sm">
        Có lỗi xảy ra khi kết nối dữ liệu danh sách kiểm duyệt. Vui lòng thử lại sau.
      </Card>
    )
  }

  const companies = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handleApprove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn DUYỆT CẤP PHÉP công ty này không?')) {
      approveCompany.mutate(id)
    }
  }

  const handleReject = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn TỪ CHỐI công ty này không? Hồ sơ sẽ bị trả về.')) {
      rejectCompany.mutate(id)
    }
  }

  const handleLock = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn KHÓA TOÀN BỘ hoạt động của công ty này vì vi phạm quy chế?')) {
      lockCompany.mutate(id)
    }
  }

  if (companies.length === 0) {
    return (
      <Card variant="glass" className="p-16 text-center flex flex-col items-center justify-center shadow-lg border-[rgba(145,158,171,0.12)]">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#1C252E] dark:text-white mb-3">Nhiệm Vụ Đã Xong!</h3>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium text-lg">Hệ thống trong sạch. Không có đối tác nào đang nằm trong hàng chờ xét duyệt.</p>
      </Card>
    )
  }

  return (
    <Card variant="glass" className="w-full bg-white dark:bg-[#1C252E] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] p-0">
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal">
          <thead>
            <tr className="bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)] border-b border-[rgba(145,158,171,0.12)]">
              <th className="py-4 px-6 text-xs font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider">Hồ Sơ Doanh Nghiệp</th>
              <th className="py-4 px-6 text-xs font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider">Lĩnh Vực & Kênh Mạng</th>
              <th className="py-4 px-6 text-xs font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider">Thời Gian Nộp</th>
              <th className="py-4 px-6 text-xs font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider text-right">
                Hành Động Xét Duyệt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(145,158,171,0.12)]">
            {companies.map((company) => (
              <tr key={company._id} className="hover:bg-[rgba(145,158,171,0.02)] dark:hover:bg-white/[0.02] transition-colors group">
                <td className="py-5 px-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={resolveAssetUrl(company.logo) || 'https://via.placeholder.com/48?text=Logo'}
                      alt={company.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-[rgba(145,158,171,0.2)] shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold text-[#1C252E] dark:text-white text-[15px] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                        {company.name}
                      </div>
                      <div className="text-[13px] text-[#637381] dark:text-[#919EAB] font-medium mt-1 truncate max-w-[200px]">
                        {company.location || 'Chưa cập nhật trụ sở'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[13px] text-[#1C252E] dark:text-white font-bold">
                      <Briefcase className="w-4 h-4 text-[#919EAB]" />
                      {company.industry || 'Chưa phân ngành'}
                    </div>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-bold transition-colors">
                        <Globe className="w-4 h-4" />
                        Trang chủ
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-[13px] text-[#919EAB] font-medium">
                        <Globe className="w-4 h-4" /> (Tự do)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="text-[14px] text-[#1C252E] dark:text-white font-extrabold">
                    {new Date(company.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-[12px] text-[#919EAB] mt-1 font-semibold truncate max-w-[150px]">
                    Bởi: {company.createdBy?.email || 'N/A'}
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <Button
                      variant="solid"
                      size="sm"
                      onClick={() => handleApprove(company._id)}
                      disabled={approveCompany.isPending}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-9 shadow-[0_4px_12px_-4px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-transform"
                      title="Chấp thuận cấp phép hoạt động"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Chấp Thuận
                    </Button>
                    <div className="h-6 w-px bg-[rgba(145,158,171,0.2)] mx-1"></div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleReject(company._id)}
                      disabled={rejectCompany.isPending}
                      className="h-9 w-9 border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 rounded-lg shrink-0"
                      title="Trả hồ sơ"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleLock(company._id)}
                      disabled={lockCompany.isPending}
                      className="h-9 w-9 border-[#637381]/30 text-[#637381] hover:bg-[#637381]/10 hover:text-[#1C252E] dark:hover:text-white rounded-lg shrink-0"
                      title="Khóa hệ thống - Đình chỉ"
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-5 border-t border-[rgba(145,158,171,0.12)] bg-[#F4F6F8] dark:bg-transparent">
          <Button
            variant="outline"
            size="default"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl font-bold border-[rgba(145,158,171,0.24)]"
          >
            Trang Lùi
          </Button>
          <span className="text-sm font-extrabold text-[#1C252E] dark:text-white tracking-widest uppercase">
            Trang <span className="text-green-600 dark:text-green-400 mx-1">{page}</span> / {totalPages}
          </span>
          <Button
            variant="outline"
            size="default"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl font-bold border-[rgba(145,158,171,0.24)]"
          >
            Trang Tiếp
          </Button>
        </div>
      )}
    </Card>
  )
}
