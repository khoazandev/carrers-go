import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyProfileSchema } from '../schemas/company.schema'
import { useCreateCompany, useUpdateCompany } from '../hooks/useCompany'
import { Building2, MapPin, Globe, ExternalLink, Link2, AlignLeft, Briefcase, Users } from 'lucide-react'

export default function CompanyProfileForm({ company }) {
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      industry: '',
      companySize: '',
      location: '',
      socialLinks: {
        linkedin: '',
        facebook: '',
      },
    },
  })

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        location: company.location || '',
        socialLinks: {
          linkedin: company.socialLinks?.linkedin || '',
          facebook: company.socialLinks?.facebook || '',
        },
      })
    }
  }, [company, reset])

  const onSubmit = (data) => {
    if (company) {
      updateCompany.mutate({ id: company._id, data })
    } else {
      createCompany.mutate(data)
    }
  }

  const isLoading = createCompany.isPending || updateCompany.isPending

  const inputClasses = "w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/50 px-4 py-3 rounded-xl outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-foreground mb-2";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
        <Building2 className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Thông tin doanh nghiệp</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className={labelClasses}>
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Tên công ty <span className="text-error">*</span>
          </label>
          <input 
            type="text" 
            {...register('name')} 
            placeholder="Nhập tên công ty..." 
            className={`${inputClasses} ${errors.name ? 'border-error focus:border-error focus:ring-error' : ''}`}
          />
          {errors.name && <span className="text-xs text-error mt-1.5 block font-medium">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Ngành nghề
            </label>
            <input 
              type="text" 
              {...register('industry')} 
              placeholder="VD: IT, Tài chính..." 
              className={inputClasses}
            />
            {errors.industry && <span className="text-xs text-error mt-1.5 block font-medium">{errors.industry.message}</span>}
          </div>

          <div>
            <label className={labelClasses}>
              <Users className="w-4 h-4 text-muted-foreground" />
              Quy mô
            </label>
            <select {...register('companySize')} className={inputClasses}>
              <option value="">Chọn quy mô</option>
              <option value="1-10">1-10 nhân viên</option>
              <option value="11-50">11-50 nhân viên</option>
              <option value="51-200">51-200 nhân viên</option>
              <option value="201-500">201-500 nhân viên</option>
              <option value="501-1000">501-1000 nhân viên</option>
              <option value="1000+">1000+ nhân viên</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Địa chỉ
          </label>
          <input 
            type="text" 
            {...register('location')} 
            placeholder="Địa chỉ trụ sở chính" 
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>
            <Globe className="w-4 h-4 text-muted-foreground" />
            Website
          </label>
          <input 
            type="text" 
            {...register('website')} 
            placeholder="https://tencuaban.com" 
            className={`${inputClasses} ${errors.website ? 'border-error focus:border-error focus:ring-error' : ''}`}
          />
          {errors.website && <span className="text-xs text-error mt-1.5 block font-medium">{errors.website.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/20 border border-border rounded-xl">
          <div>
            <label className={labelClasses}>
              <Link2 className="w-4 h-4 text-muted-foreground" />
              LinkedIn <span className="text-muted-foreground font-normal text-xs">(Mạng xã hội)</span>
            </label>
            <input 
              type="text" 
              {...register('socialLinks.linkedin')} 
              placeholder="https://linkedin.com/company/..." 
              className={`${inputClasses} ${errors.socialLinks?.linkedin ? 'border-error focus:border-error focus:ring-error' : ''}`}
            />
            {errors.socialLinks?.linkedin && <span className="text-xs text-error mt-1.5 block font-medium">{errors.socialLinks.linkedin.message}</span>}
          </div>

          <div>
            <label className={labelClasses}>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              Facebook <span className="text-muted-foreground font-normal text-xs">(Mạng xã hội)</span>
            </label>
            <input 
              type="text" 
              {...register('socialLinks.facebook')} 
              placeholder="https://facebook.com/..." 
              className={`${inputClasses} ${errors.socialLinks?.facebook ? 'border-error focus:border-error focus:ring-error' : ''}`}
            />
             {errors.socialLinks?.facebook && <span className="text-xs text-error mt-1.5 block font-medium">{errors.socialLinks.facebook.message}</span>}
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            <AlignLeft className="w-4 h-4 text-muted-foreground" />
            Mô tả công ty
          </label>
          <textarea 
            {...register('description')} 
            rows="5" 
            placeholder="Giới thiệu về tầm nhìn, sứ mệnh, môi trường làm việc..."
            className={`${inputClasses} resize-none ${errors.description ? 'border-error focus:border-error focus:ring-error' : ''}`}
          ></textarea>
          {errors.description && <span className="text-xs text-error mt-1.5 block font-medium">{errors.description.message}</span>}
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center justify-center bg-primary text-primary-foreground focus-ring font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? 'Đang lưu...' : (company ? 'Lưu thay đổi' : 'Tạo mới hồ sơ')}
          </button>
        </div>
      </form>
    </div>
  )
}
