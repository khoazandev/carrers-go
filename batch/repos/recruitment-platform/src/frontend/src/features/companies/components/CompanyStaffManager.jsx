import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, UserPlus, Shield } from 'lucide-react'
import { useAddHrMember, useRemoveHrMember } from '../hooks/useCompany'
import { hrMemberSchema } from '../schemas/company.schema'
import { cn } from '@shared/utils/cn'

export default function CompanyStaffManager({ company }) {
  const addMember = useAddHrMember()
  const removeMember = useRemoveHrMember()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(hrMemberSchema),
    defaultValues: { email: '' },
  })

  if (!company?._id) return null

  const onSubmit = (data) => {
    addMember.mutate(
      { id: company._id, email: data.email },
      { onSuccess: () => reset() }
    )
  }

  const handleRemove = (memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      removeMember.mutate({ id: company._id, memberId })
    }
  }

  const members = company.hrMembers || []
  const ownerId = company.createdBy?._id || company.createdBy

  return (
    <div className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 md:p-8 border border-[rgba(145,158,171,0.08)] dark:border-white/[0.04] shadow-[0_4px_24px_rgba(145,158,171,0.12)] dark:shadow-none flex flex-col gap-6 w-full overflow-hidden">
      <div>
        <h2 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2">Thành viên nhân sự (HR)</h2>
        <p className="text-sm text-[#637381] dark:text-[#919EAB]">Chỉ những tài khoản có quyền HR mới có thể được thêm vào danh sách này.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            {...register('email')} 
            placeholder="Nhập email của người dùng HR..."
            className={cn(
              "flex-1 px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white min-w-0 w-full",
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
            )}
          />
          <button 
            type="submit" 
            disabled={isSubmitting || addMember.isPending}
            className="flex shrink-0 items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#10b981] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4" />
            {addMember.isPending ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
        {errors.email && <span className="text-xs text-red-500 font-medium px-2">{errors.email.message}</span>}
      </form>

      <div className="rounded-2xl border border-[rgba(145,158,171,0.15)] dark:border-white/[0.05] overflow-x-auto w-full">
        {members.length === 0 ? (
          <div className="p-8 text-center text-[#637381] dark:text-[#919EAB] text-sm">Chưa có thành viên nào.</div>
        ) : (
          <table className="w-full min-w-[500px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)]">
                <th className="px-5 py-4 text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider whitespace-nowrap w-[40%]">Họ tên</th>
                <th className="px-5 py-4 text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider whitespace-nowrap hidden sm:table-cell w-[30%]">Email</th>
                <th className="px-5 py-4 text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider whitespace-nowrap w-[20%]">Vai trò</th>
                <th className="px-5 py-4 text-xs font-bold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider text-right whitespace-nowrap w-[10%]">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,158,171,0.15)] dark:divide-white/[0.05]">
              {members.map(member => {
                const isOwner = member._id === ownerId
                return (
                  <tr key={member._id} className="hover:bg-[rgba(145,158,171,0.04)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.profile?.avatar || 'https://via.placeholder.com/40'} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#1C252E] shadow-sm shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-[#1C252E] dark:text-white truncate">{member.profile?.fullName || 'Chưa cập nhật'}</span>
                          <span className="text-xs text-[#919EAB] sm:hidden truncate">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell min-w-0">
                      <div className="text-sm text-[#637381] dark:text-[#919EAB] truncate">{member.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap",
                        isOwner ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-[#22c55e]/10 text-[#22c55e] dark:text-[#4ADE80]"
                      )}>
                        {isOwner && <Shield className="w-3 h-3" />}
                        {isOwner ? 'Owner' : 'Member'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!isOwner && (
                        <button 
                          onClick={() => handleRemove(member._id)}
                          disabled={removeMember.isPending}
                          title="Xóa thành viên"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#919EAB] hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
