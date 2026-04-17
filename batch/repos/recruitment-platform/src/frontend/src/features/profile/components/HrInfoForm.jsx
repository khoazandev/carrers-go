import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@shared/utils/cn'

const hrInfoSchema = z.object({
  roleTitle: z.string().optional().or(z.literal('')),
})

function HrInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(hrInfoSchema),
    defaultValues: {
      roleTitle: initialData?.roleTitle || '',
    },
  })

  const submitHandler = useCallback((data) => {
    onSubmit(data)
  }, [onSubmit])

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label htmlFor="roleTitle" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Chức danh / Vai trò</label>
          <input
            id="roleTitle"
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.roleTitle ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
            )}
            placeholder="vd: HR Manager"
            {...register('roleTitle')}
          />
          {errors.roleTitle && <span className="text-xs text-red-500 font-medium px-1">{errors.roleTitle.message}</span>}
        </div>

        <div className="pt-2 flex justify-end mt-2 border-t border-[rgba(145,158,171,0.12)] pt-6">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#10b981] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(HrInfoForm)
