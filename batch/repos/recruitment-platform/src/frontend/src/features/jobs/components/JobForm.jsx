import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../jobSchemas.js';
import { Briefcase, MapPin, DollarSign, AlignLeft, CheckCircle2, ChevronDown } from 'lucide-react';

const JobForm = ({ initialValues, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      requirements: '',
      employmentType: 'full-time',
      location: '',
      salaryRange: { min: null, max: null }
    },
  });

  const handleFormSubmit = (data) => {
    // Clean payload before submitting (e.g strip NaNs)
    if (isNaN(data.salaryRange?.min)) data.salaryRange.min = undefined;
    if (isNaN(data.salaryRange?.max)) data.salaryRange.max = undefined;
    
    onSubmit(data);
  };

  const inputClasses = "w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/50 px-4 py-3 rounded-xl outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-foreground mb-2";

  return (
    <form className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      
      {/* Title */}
      <div>
        <label className={labelClasses}>
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          Tiêu đề công việc <span className="text-error">*</span>
        </label>
        <input 
          type="text" 
          className={inputClasses}
          {...register('title')} 
          placeholder="VD: Senior Frontend Developer (React/Vite)" 
        />
        {errors.title && <span className="text-xs text-error mt-1.5 block font-medium">{errors.title.message}</span>}
      </div>

      {/* Row 1: Type & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            Loại hình <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select className={`${inputClasses} appearance-none cursor-pointer pr-10`} {...register('employmentType')}>
              <option value="full-time">Toàn thời gian (Full-time)</option>
              <option value="part-time">Bán thời gian (Part-time)</option>
              <option value="contract">Hợp đồng (Contract)</option>
              <option value="freelance">Tự do (Freelance)</option>
              <option value="internship">Thực tập sinh (Internship)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.employmentType && <span className="text-xs text-error mt-1.5 block font-medium">{errors.employmentType.message}</span>}
        </div>

        <div>
          <label className={labelClasses}>
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Địa điểm làm việc <span className="text-error">*</span>
          </label>
          <input 
            type="text" 
            className={inputClasses}
            {...register('location')} 
            placeholder="TP.HCM, Hà Nội..." 
          />
          {errors.location && <span className="text-xs text-error mt-1.5 block font-medium">{errors.location.message}</span>}
        </div>
      </div>

      {/* Row 2: Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/20 border border-border rounded-xl">
        <div>
          <label className={labelClasses}>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            Lương tối thiểu <span className="text-muted-foreground font-normal text-xs">(Tùy chọn - USD)</span>
          </label>
          <input 
            type="number" 
            className={inputClasses}
            {...register('salaryRange.min', { valueAsNumber: true })} 
            placeholder="1000" 
          />
          {errors.salaryRange?.min && <span className="text-xs text-error mt-1.5 block font-medium">{errors.salaryRange.min.message}</span>}
        </div>
        <div>
          <label className={labelClasses}>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            Lương tối đa <span className="text-muted-foreground font-normal text-xs">(Tùy chọn - USD)</span>
          </label>
          <input 
            type="number" 
            className={inputClasses}
            {...register('salaryRange.max', { valueAsNumber: true })} 
            placeholder="3000" 
          />
          {errors.salaryRange?.max && <span className="text-xs text-error mt-1.5 block font-medium">{errors.salaryRange.max.message}</span>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>
          <AlignLeft className="w-4 h-4 text-muted-foreground" />
          Mô tả công việc <span className="text-error">*</span>
        </label>
        <textarea 
          rows="5" 
          className={`${inputClasses} resize-none`}
          {...register('description')} 
          placeholder="Mô tả chi tiết quyền lợi, môi trường làm việc..." 
        />
        {errors.description && <span className="text-xs text-error mt-1.5 block font-medium">{errors.description.message}</span>}
      </div>

      {/* Requirements */}
      <div>
        <label className={labelClasses}>
          <AlignLeft className="w-4 h-4 text-muted-foreground" />
          Yêu cầu ứng viên <span className="text-error">*</span>
        </label>
        <textarea 
          rows="5" 
          className={`${inputClasses} resize-none`}
          {...register('requirements')} 
          placeholder="Yêu cầu về kỹ năng, kinh nghiệm chuyên môn..." 
        />
        {errors.requirements && <span className="text-xs text-error mt-1.5 block font-medium">{errors.requirements.message}</span>}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border flex justify-end">
        <button 
          type="submit" 
          className="inline-flex items-center justify-center bg-primary text-primary-foreground focus-ring font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" 
          disabled={isLoading}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu tin tuyển dụng'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
