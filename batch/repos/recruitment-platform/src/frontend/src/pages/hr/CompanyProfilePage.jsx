import {
  CompanyLogoUpload,
  CompanyProfileForm,
  CompanyStaffManager,
} from '@features/companies/components'
import { useGetMyCompany } from '@features/companies/hooks/useCompany'
import { LoadingSpinner } from '@shared/components'
import { Building2, ShieldAlert } from 'lucide-react'

export default function CompanyProfilePage() {
  const { data: company, isLoading, error } = useGetMyCompany()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <LoadingSpinner />
        <p className="text-muted-foreground font-medium">Đang tải thông tin công ty...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 fade-in h-[80vh] flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-premium max-w-lg w-full">
          <ShieldAlert className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Không tải được thông tin công ty</h2>
          <p className="text-muted-foreground">{error.response?.data?.message || 'Đã có lỗi xảy ra khi tải hồ sơ doanh nghiệp.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Building2 size={24} />
            </div>
            Hồ sơ Doanh nghiệp
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Cập nhật thông tin công ty của bạn để thu hút ứng viên tiềm năng tốt nhất
          </p>
        </div>
      </div>

      {company ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
              <CompanyLogoUpload company={company} />
            </div>
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
              <CompanyProfileForm company={company} />
            </div>
          </div>
          
          <div className="xl:col-span-1 space-y-8">
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6 sticky top-[96px]">
              <CompanyStaffManager company={company} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed rounded-2xl p-10 mt-8 text-center flex flex-col items-center max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Chào mừng bạn!</h2>
          <p className="text-muted-foreground max-w-lg mb-8">
            Tài khoản của bạn chưa được liên kết với hồ sơ công ty nào.
            Vui lòng tạo hồ sơ doanh nghiệp để bắt đầu quá trình tuyển dụng.
          </p>
          <div className="w-full text-left bg-muted/20 p-6 rounded-2xl border border-border">
             <CompanyProfileForm company={null} />
          </div>
        </div>
      )}
    </div>
  )
}
