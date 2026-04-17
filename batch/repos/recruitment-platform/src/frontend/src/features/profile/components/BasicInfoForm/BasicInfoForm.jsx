import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@shared/components/ui/input'
import { Button } from '@shared/components/ui/button'

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

  return (
      <form onSubmit={handleSubmit((d) => onSubmit(d))} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="fullName">HỌ VÀ TÊN</label>
          <Input
            id="fullName"
            type="text"
            placeholder="vd: Nguyễn Văn A"
            {...register('fullName')}
            className={errors.fullName ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.fullName && <span className="text-xs text-rose-500 font-medium">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="phone">SỐ ĐIỆN THOẠI</label>
          <Input
            id="phone"
            type="tel"
            placeholder="vd: 0912345678"
            {...register('phone')}
            className={errors.phone ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.phone && <span className="text-xs text-rose-500 font-medium">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="address">ĐỊA CHỈ</label>
          <Input
            id="address"
            type="text"
            placeholder="vd: Hà Nội, Việt Nam"
            {...register('address')}
            className={errors.address ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.address && <span className="text-xs text-rose-500 font-medium">{errors.address.message}</span>}
        </div>

        <div className="mt-4 flex justify-end">
          <Button 
            type="submit" 
            variant="solid" 
            color="primary"
            disabled={!isDirty || isPending}
            isLoading={isPending}
            className="w-full md:w-auto px-8 h-12 rounded-xl text-sm font-bold shadow-[0_8px_20px_-6px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-0.5"
          >
            {isPending ? 'Đang lưu...' : 'Lưu Cơ Bản'}
          </Button>
        </div>
      </form>
  )
}
export default memo(BasicInfoForm)
