import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@shared/components/ui/input'
import { Button } from '@shared/components/ui/button'

const splitCommaSeparated = (value = '') =>
  value.split(',').map((item) => item.trim()).filter(Boolean)

const hasOnlyValidPortfolioLinks = (value) =>
  value === '' || splitCommaSeparated(value).every((link) => z.string().url().safeParse(link).success)

const candidateInfoSchema = z.object({
  skills: z.string().optional().or(z.literal('')),
  expectedSalary: z.number().min(0, 'Lương mong muốn không hợp lệ').optional(),
  preferredLocation: z.string().optional().or(z.literal('')),
  portfolioLinks: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(hasOnlyValidPortfolioLinks, 'Mỗi liên kết portfolio phải là URL hợp lệ'),
})

function CandidateInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(candidateInfoSchema),
    defaultValues: {
      skills: initialData?.skills?.join(', ') || '',
      expectedSalary: initialData?.expectedSalary ?? undefined,
      preferredLocation: initialData?.preferredLocation || '',
      portfolioLinks: initialData?.portfolioLinks?.join(', ') || '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      onSubmit({
        ...data,
        skills: splitCommaSeparated(data.skills),
        portfolioLinks: splitCommaSeparated(data.portfolioLinks),
        expectedSalary: data.expectedSalary ?? undefined,
      })
    },
    [onSubmit]
  )

  return (
      <form onSubmit={handleSubmit(submitHandler)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 w-full">
        <div className="flex flex-col gap-2.5 md:col-span-2">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="skills">TỪ KHÓA KỸ NĂNG (Cách bằng dấu ,)</label>
          <Input
            id="skills"
            type="text"
            placeholder="vd: React, Node.js, Python"
            {...register('skills')}
            className={errors.skills ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.skills && <span className="text-xs text-rose-500 font-medium">{errors.skills.message}</span>}
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="expectedSalary">MỨC LƯƠNG KỲ VỌNG (VND)</label>
          <Input
            id="expectedSalary"
            type="number"
            placeholder="vd: 15000000"
            {...register('expectedSalary', {
              setValueAs: (value) => (value === '' ? undefined : Number(value)),
            })}
            className={errors.expectedSalary ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.expectedSalary && <span className="text-xs text-rose-500 font-medium">{errors.expectedSalary.message}</span>}
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="preferredLocation">CỦA BẾN HY VỌNG (ĐỊA ĐIỂM)</label>
          <Input
            id="preferredLocation"
            type="text"
            placeholder="vd: Hồ Chí Minh, Remote"
            {...register('preferredLocation')}
            className={errors.preferredLocation ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.preferredLocation && <span className="text-xs text-rose-500 font-medium">{errors.preferredLocation.message}</span>}
        </div>

        <div className="flex flex-col gap-2.5 md:col-span-2">
          <label className="text-[13px] font-bold text-[#1C252E] dark:text-white tracking-wide" htmlFor="portfolioLinks">LIÊN KẾT HỒ SƠ NGOÀI (Cách bằng dấu ,)</label>
          <Input
            id="portfolioLinks"
            type="text"
            placeholder="vd: https://github.com/abc, https://behance.net/xyz"
            {...register('portfolioLinks')}
            className={errors.portfolioLinks ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
          />
          {errors.portfolioLinks && <span className="text-xs text-rose-500 font-medium">{errors.portfolioLinks.message}</span>}
        </div>

        <div className="mt-6 flex justify-end md:col-span-2">
          <Button
            type="submit"
            variant="solid"
            color="primary"
            disabled={!isDirty || isPending}
            isLoading={isPending}
            className="w-full md:w-auto px-8 h-12 rounded-xl text-sm font-bold shadow-[0_8px_20px_-6px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-0.5"
          >
            {isPending ? 'Đang lưu...' : 'Lưu Hồ Sơ Năng Lực'}
          </Button>
        </div>
      </form>
  )
}
export default memo(CandidateInfoForm)
