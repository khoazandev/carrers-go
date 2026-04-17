import PendingCompanyList from '@features/admin/components/PendingCompanyList'
import { Building2 } from 'lucide-react'

export default function ManageCompaniesPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2 flex flex-col md:flex-row items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          Quản Lý Xét Duyệt Doanh Nghiệp
        </h1>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium mt-3">
          Kiểm duyệt, cấp phép hoặc từ chối các Hồ sơ đăng ký thông tin Tuyển dụng của đối tác Doanh nghiệp trên nền tảng.
        </p>
      </div>

      <div className="mt-8">
        <PendingCompanyList />
      </div>
    </div>
  )
}
