// 1. React
import { useState } from 'react'
import { FileText, Upload, Pencil, Trash2, Star, ExternalLink, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// 2. Shared Components
import { Tabs } from '@shared/components/ui/tabs'
import { Card } from '@shared/components/ui/card'
import { useDocumentTitle } from '@shared/hooks'

// 3. Features
import { OnlineCvBuilder, UploadCvOcr } from '@features/cvs/components'
import { useGetMyCvs, useDeleteCv, useSetDefaultCv } from '@features/cvs/hooks/useCv'

export default function CvManagerPage() {
  useDocumentTitle('Quản Lý CV | SmartHire')
  const [activeTab, setActiveTab] = useState('my-cvs')

  const { data: cvList = [], isLoading } = useGetMyCvs()
  const deleteMutation = useDeleteCv()
  const setDefaultMutation = useSetDefaultCv()

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa CV "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleSetDefault = (id) => {
    setDefaultMutation.mutate(id)
  }

  const tabOptions = [
    { id: 'my-cvs', label: `CV của tôi (${cvList.length})` },
    { id: 'upload', label: 'Tải Lên PDF/Word' },
    { id: 'builder', label: 'Tạo CV Online' },
  ]

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500 relative z-10">
      
      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <span className="inline-block text-[#22C55E] text-sm font-bold tracking-widest uppercase mb-4">
          Hồ Sơ Ứng Tuyển
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1C252E] dark:text-white mb-6">
          Quản Lý Mọi Khía Cạnh CV
        </h1>
        <p className="text-lg md:text-xl text-[#637381] dark:text-[#C4CDD5] max-w-2xl mx-auto">
          Tải lên tệp gốc hoặc dùng biểu mẫu động để tự động điền dữ liệu dựa trên nhận diện quang học (OCR).
        </p>
      </div>

      {/* Tabs Control */}
      <div className="flex justify-center mb-12 relative z-20">
        <Tabs 
          tabs={tabOptions} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          className="w-full max-w-2xl mx-auto shadow-sm"
        />
      </div>

      {/* Content Area */}
      <div className="relative w-full transition-all duration-500 z-10">

        {/* Tab: My CVs */}
        {activeTab === 'my-cvs' && (
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-4" />
                <p className="text-[#919EAB] font-medium">Đang tải danh sách CV...</p>
              </div>
            ) : cvList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvList.map((cv) => (
                  <div 
                    key={cv._id} 
                    className="group relative bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.15)] dark:border-[rgba(145,158,171,0.1)] rounded-2xl p-6 hover:border-[#22c55e]/40 hover:shadow-[0_12px_40px_-10px_rgba(34,197,94,0.12)] transition-all duration-300"
                  >
                    {/* Default Badge */}
                    {cv.isDefault && (
                      <div className="absolute top-4 right-4 bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Mặc định
                      </div>
                    )}

                    {/* CV Icon */}
                    <div className="w-14 h-14 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#22c55e]/10 transition-colors">
                      <FileText className="w-7 h-7 text-[#637381] dark:text-[#919EAB] group-hover:text-[#22c55e] transition-colors" />
                    </div>

                    {/* CV Info */}
                    <h3 className="text-[15px] font-bold text-[#1C252E] dark:text-white mb-1 truncate pr-16">
                      {cv.title || 'CV không tên'}
                    </h3>
                    <div className="flex items-center gap-3 text-[12px] text-[#919EAB] font-medium mb-5">
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${
                        cv.sourceType === 'builder' 
                          ? 'bg-blue-100/80 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                          : 'bg-amber-100/80 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {cv.sourceType === 'builder' ? 'Builder' : 'Upload'}
                      </span>
                      <span>{formatDate(cv.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[rgba(145,158,171,0.1)]">
                      {!cv.isDefault && (
                        <button
                          onClick={() => handleSetDefault(cv._id)}
                          disabled={setDefaultMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-[#637381] dark:text-[#919EAB] hover:text-[#22c55e] hover:bg-[#22c55e]/[0.06] transition-all"
                          title="Đặt mặc định"
                        >
                          <Star className="w-3.5 h-3.5" /> Mặc định
                        </button>
                      )}
                      {cv.fileUrl && (
                        <a
                          href={cv.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-[#637381] dark:text-[#919EAB] hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/[0.06] transition-all"
                          title="Xem file"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Xem
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(cv._id, cv.title)}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-[#637381] dark:text-[#919EAB] hover:text-rose-500 hover:bg-rose-500/[0.06] transition-all ml-auto"
                        title="Xóa CV"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 mx-auto bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] rounded-3xl flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-[#919EAB]/50" />
                </div>
                <h3 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2">Chưa có CV nào</h3>
                <p className="text-[#637381] dark:text-[#919EAB] mb-6 max-w-md mx-auto">Hãy tải lên CV hoặc tạo mới bằng trình tạo online để bắt đầu ứng tuyển.</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#1C252E] dark:bg-white text-white dark:text-[#1C252E] font-bold hover:bg-[#22c55e] dark:hover:bg-[#22c55e] hover:text-white transition-all shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)]"
                >
                  <Upload className="w-4 h-4" /> Tải lên CV đầu tiên
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Upload */}
        {activeTab === 'upload' && (
           <Card variant="glass" className="w-full p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
             <UploadCvOcr />
           </Card>
        )}
        
        {/* Tab: Builder */}
        {activeTab === 'builder' && (
           <Card variant="glass" className="w-full p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
             <OnlineCvBuilder />
           </Card>
        )}
      </div>
      
    </div>
  )
}
