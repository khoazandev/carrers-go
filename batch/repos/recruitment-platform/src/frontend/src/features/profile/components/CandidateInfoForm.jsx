import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@shared/utils/cn'

const splitCommaSeparated = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

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

  const submitHandler = useCallback((data) => {
    onSubmit({
      ...data,
      skills: splitCommaSeparated(data.skills),
      portfolioLinks: splitCommaSeparated(data.portfolioLinks),
      expectedSalary: data.expectedSalary ?? undefined,
    })
  }, [onSubmit])

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
        
        <div className="space-y-2">
          <label htmlFor="skills" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Kỹ năng (cách nhau bởi dấu phẩy)</label>
          <input
            id="skills"
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.skills ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
            )}
            placeholder="vd: React, Node.js, Python"
            {...register('skills')}
          />
          {errors.skills && <span className="text-xs text-red-500 font-medium px-1">{errors.skills.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="expectedSalary" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Lương mong muốn (VND/Tháng)</label>
            <input
              id="expectedSalary"
              type="number"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
                errors.expectedSalary ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
              )}
              placeholder="vd: 15000000"
              {...register('expectedSalary', {
                setValueAs: (value) => (value === '' ? undefined : Number(value)),
              })}
            />
            {errors.expectedSalary && <span className="text-xs text-red-500 font-medium px-1">{errors.expectedSalary.message}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="preferredLocation" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Địa điểm làm việc mong muốn</label>
            <input
              id="preferredLocation"
              type="text"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
                errors.preferredLocation ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
              )}
              placeholder="vd: Hồ Chí Minh, Remote"
              {...register('preferredLocation')}
            />
            {errors.preferredLocation && <span className="text-xs text-red-500 font-medium px-1">{errors.preferredLocation.message}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolioLinks" className="text-sm font-semibold text-[#1C252E] dark:text-white block">Liên kết Portfolio (cách nhau bởi dấu phẩy)</label>
          <input
            id="portfolioLinks"
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] border outline-none transition-all text-sm text-[#1C252E] dark:text-white",
              errors.portfolioLinks ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-transparent focus:border-[#22c55e] focus:bg-white dark:focus:bg-[#1C252E] focus:ring-1 focus:ring-[#22c55e]"
            )}
            placeholder="vd: https://github.com/abc, https://behance.net/xyz"
            {...register('portfolioLinks')}
          />
          {errors.portfolioLinks && <span className="text-xs text-red-500 font-medium px-1">{errors.portfolioLinks.message}</span>}
        </div>

        <div className="pt-2 flex justify-end mt-2 border-t border-[rgba(145,158,171,0.12)] pt-6">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#10b981] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu thông tin ứng viên'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(CandidateInfoForm)
