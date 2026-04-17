import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@shared/utils/cn'

const basicInfoSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
})

function BasicInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
    },
  })

  const submitHandler = useCallback((data) => {
    onSubmit(data)
  }, [onSubmit])

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
                errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
              )}
              placeholder="vd: Nguyễn Văn A"
              {...register('fullName')}
            />
            {errors.fullName && <span className="text-xs text-red-500 font-medium">{errors.fullName.message}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
                errors.phone ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
              )}
              placeholder="vd: 0912345678"
              {...register('phone')}
            />
            {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Địa chỉ</label>
          <input
            id="address"
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.address ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
            )}
            placeholder="vd: Hà Nội, Việt Nam"
            {...register('address')}
          />
          {errors.address && <span className="text-xs text-red-500 font-medium">{errors.address.message}</span>}
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

export default memo(BasicInfoForm)
