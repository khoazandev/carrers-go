import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@shared/utils/cn'

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

function ChangePasswordForm({ onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      onSubmit({ 
        oldPassword: data.oldPassword, 
        newPassword: data.newPassword 
      }, {
        onSuccess: () => reset()
      })
    },
    [onSubmit, reset]
  )

  return (
    <div className="w-full mt-4">
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label htmlFor="oldPassword" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Mật khẩu hiện tại</label>
          <input
            id="oldPassword"
            type="password"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.oldPassword ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-red-500"
            )}
            placeholder="Nhập mật khẩu hiện tại"
            {...register('oldPassword')}
          />
          {errors.oldPassword && <span className="text-xs text-red-500 font-medium px-1">{errors.oldPassword.message}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-red-500"
            )}
            placeholder="Ít nhất 6 ký tự"
            {...register('newPassword')}
          />
          {errors.newPassword && <span className="text-xs text-red-500 font-medium px-1">{errors.newPassword.message}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            type="password"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-red-500"
            )}
            placeholder="Nhập lại mật khẩu mới"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <span className="text-xs text-red-500 font-medium px-1">{errors.confirmPassword.message}</span>}
        </div>

        <div className="pt-2 flex justify-start mt-2">
          <button 
            type="submit" 
            className="px-6 py-3 rounded-xl bg-[#FF5630] hover:bg-[#B71D18] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors" 
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(ChangePasswordForm)
