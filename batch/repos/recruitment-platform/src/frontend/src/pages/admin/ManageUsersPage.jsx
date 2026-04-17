import { useState } from 'react'
import { Card } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { LoadingSpinner } from '@shared/components'
import { Users, Lock, Unlock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAdminUsers, useToggleBlockUser } from '@features/admin/hooks/useAdmin'

export default function ManageUsersPage() {
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const limit = 10

  const { data, isLoading, isError } = useAdminUsers({ page, limit, role: roleFilter })
  const toggleBlockUser = useToggleBlockUser()

  const handleToggleBlock = (userId, currentStatus) => {
    const actionName = currentStatus === 'active' ? 'KHÓA (BAN)' : 'MỞ KHÓA (UNBAN)'
    if (window.confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản người dùng này không?`)) {
      toggleBlockUser.mutate({ id: userId, reason: `Admin ${actionName} tài khoản nội bộ` })
    }
  }

  const renderRoleBadge = (role) => {
    if (role === 'hr') {
      return <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider">Nhà Tuyển Dụng</span>
    }
    if (role === 'candidate') {
      return <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider">Ứng Viên</span>
    }
    return <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider">Quản Trị</span>
  }

  const renderStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Active
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-sm font-bold bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
        <Lock className="w-3 h-3" /> Banned
      </span>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            Quản Lý Quỹ Đạo Người Dùng
          </h1>
          <p className="text-[#637381] dark:text-[#919EAB] font-medium mt-3 max-w-2xl">
            Trung tâm kiểm soát tuyệt đối toàn bộ tài khoản Ứng viên và Nhà tuyển dụng tham gia vào hệ sinh thái nền tảng.
          </p>
        </div>
        
        {/* Simple Filters */}
        <div className="flex bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] p-1.5 rounded-xl border border-[rgba(145,158,171,0.2)] shadow-inner">
          {['', 'candidate', 'hr'].map((r) => (
            <button
              key={r}
              onClick={() => { setPage(1); setRoleFilter(r); }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                roleFilter === r 
                  ? 'bg-white dark:bg-[#1C252E] text-green-600 dark:text-green-400 shadow-sm border border-[rgba(145,158,171,0.12)]' 
                  : 'text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white'
              }`}
            >
              {r === '' ? 'Tất cả' : (r === 'candidate' ? 'Ứng viên' : 'Nhà Tuyển Dụng')}
            </button>
          ))}
        </div>
      </div>

      <Card variant="glass" className="w-full bg-white dark:bg-[#1C252E] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] p-0">
        
        {isLoading ? (
           <div className="w-full flex-col min-h-[400px] flex items-center justify-center p-8">
             <LoadingSpinner />
             <p className="mt-4 text-green-500 font-bold animate-pulse">Hệ thống đang quét phân vùng dữ liệu người dùng...</p>
           </div>
        ) : isError ? (
           <div className="p-8 text-center text-rose-500 font-bold">
             Không thể kết nối đến máy chủ quản trị.
           </div>
        ) : (
          <>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal">
                <thead>
                  <tr className="bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)] border-b border-[rgba(145,158,171,0.12)]">
                    <th className="py-4 px-6 text-[12px] font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest">Hồ Sơ (Identity)</th>
                    <th className="py-4 px-6 text-[12px] font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest text-center">Tình Trạng Email</th>
                    <th className="py-4 px-6 text-[12px] font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest">Trạng Thái Hệ Thống</th>
                    <th className="py-4 px-6 text-[12px] font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest">Gia Nhập Ngày</th>
                    <th className="py-4 px-6 text-[12px] font-extrabold text-[#637381] dark:text-[#919EAB] uppercase tracking-widest text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(145,158,171,0.12)]">
                  {data?.data?.map((u) => (
                    <tr key={u._id} className={`hover:bg-[rgba(145,158,171,0.02)] transition-colors group ${u.status === 'blocked' ? 'bg-rose-50/30 dark:bg-rose-500/5' : ''}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          {u.profile?.avatar ? (
                            <img src={u.profile.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-[rgba(145,158,171,0.2)] shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C252E] to-[#637381] flex items-center justify-center text-white font-bold shadow-sm">
                              {u.profile?.fullName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-[#1C252E] dark:text-white text-[15px] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {u.profile?.fullName || 'Untitled User'}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[13px] text-[#637381] dark:text-[#919EAB] font-medium">{u.email}</span>
                              {renderRoleBadge(u.role)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        {u.isEmailVerified ? (
                          <div className="inline-flex mx-auto items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" title="Đã xác thực">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="text-[12px] font-bold text-amber-500 border border-amber-200 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20">Pending</span>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        {renderStatusBadge(u.status)}
                      </td>
                      <td className="py-5 px-6 text-[14px] text-[#1C252E] dark:text-white font-bold">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-5 px-6 text-right">
                        {u.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBlock(u._id, u.status)}
                            disabled={toggleBlockUser.isPending}
                            className={`h-10 px-4 rounded-xl border-[rgba(145,158,171,0.24)] ${
                              u.status === 'active' 
                                ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300'
                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300'
                            }`}
                          >
                            {u.status === 'active' ? (
                              <><ShieldAlert className="w-4 h-4 mr-2" /> Ban Tài Khoản</>
                            ) : (
                              <><Unlock className="w-4 h-4 mr-2" /> Giải Cứu</>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(data?.meta?.totalPages || 1) > 1 && (
              <div className="flex items-center justify-between px-8 py-5 border-t border-[rgba(145,158,171,0.12)] bg-[#F4F6F8] dark:bg-transparent">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl font-bold"
                >
                  Trang Lùi
                </Button>
                <span className="text-sm font-extrabold text-[#1C252E] dark:text-white tracking-widest uppercase">
                  Trang <span className="text-green-600 dark:text-green-400 mx-1">{page}</span> / {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page === data.meta.totalPages}
                  className="rounded-xl font-bold"
                >
                  Trang Tiếp <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
