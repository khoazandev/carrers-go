import { useState, useEffect } from 'react'
import { Card } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { LoadingSpinner } from '@shared/components'
import { FileEdit, CheckCircle2, FileText, Settings, HelpCircle, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ReactQuill from 'react-quill-new'
import 'quill/dist/quill.snow.css'

// Mock API Call
const mockSaveContent = (type, content) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(`smarthire-content-${type}`, content)
      resolve({ success: true })
    }, 1200)
  })
}

// Initial Mock Content
const initialTerms = `
<h1>Điều Khoản Dịch Vụ - SmartHire</h1>
<p>Cập nhật lần cuối: Tháng 4, 2026</p>
<br/>
<p>Chào mừng bạn đến với SmartHire. Bằng việc truy cập..., bạn đồng ý tuân thủ các điều khoản sau...</p>
`
const initialFAQ = `
<h1>Câu Hỏi Thường Gặp (FAQ)</h1>
<br/>
<h3>1. Làm sao để đăng tin tuyển dụng?</h3>
<p>Tài khoản Doanh nghiệp sau khi được Nền tảng phê duyệt...</p>
`

export default function ManageContentsPage() {
  const [activeTab, setActiveTab] = useState('terms')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load config
    setIsLoading(true)
    setTimeout(() => {
      const saved = localStorage.getItem(`smarthire-content-${activeTab}`)
      if (saved) {
        setContent(saved)
      } else {
        setContent(activeTab === 'terms' ? initialTerms : initialFAQ)
      }
      setIsLoading(false)
    }, 600)
  }, [activeTab])

  const handleSave = async () => {
    setIsSaving(true)
    await mockSaveContent(activeTab, content)
    setIsSaving(false)
    toast.success('Đã xuất bản nội dung thành công!')
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
              <FileEdit className="w-6 h-6" />
            </div>
            Trình Xây Dựng Nội Dung (CMS)
          </h1>
          <p className="text-[#637381] dark:text-[#919EAB] font-medium mt-3 max-w-2xl">
            Sử dụng công cụ Rich-Text để chỉnh sửa các trang nội dung tĩnh như Điều khoản Dịch vụ và Câu hỏi thường gặp hiển thị ra ngoài hệ thống.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
          <button 
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all ${activeTab === 'terms' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 'bg-transparent text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.08)]'}`}
          >
            <FileText className="w-5 h-5" /> Điều khoản (TOS)
          </button>
          
          <button 
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all ${activeTab === 'faq' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 'bg-transparent text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.08)]'}`}
          >
            <HelpCircle className="w-5 h-5" /> Câu hỏi (FAQ)
          </button>
          
          <button 
            disabled
            className="px-4 py-3 rounded-2xl flex items-center gap-3 font-semibold bg-transparent text-[#919EAB] dark:text-[#637381] opacity-50 cursor-not-allowed"
          >
            <Settings className="w-5 h-5" /> Cấu hình Footer
          </button>
        </div>

        {/* Editor Zone */}
        <div className="flex-1">
          <Card variant="glass" className="w-full bg-[#FAFBFA] dark:bg-[#141A21] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)] p-0 flex flex-col h-[700px]">
            {isLoading ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center p-8">
                <LoadingSpinner />
                <p className="mt-4 text-[#919EAB] font-bold animate-pulse">Đang tải bản thảo...</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-[rgba(145,158,171,0.12)] flex justify-between items-center bg-white dark:bg-[#1C252E]">
                  <div className="font-bold text-[#1C252E] dark:text-white">
                    {activeTab === 'terms' ? 'Cập nhật Điều Khoản Dịch Vụ' : 'Cập nhật FAQ Nền tảng'}
                  </div>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="h-10 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold"
                  >
                    {isSaving ? <LoadingSpinner className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
                    Lưu nội dung
                  </Button>
                </div>
                
                {/* Editor Container */}
                <div className="flex-1 bg-white dark:bg-[#1C252E] overflow-hidden quill-wrapper p-2">
                  <style>{`
                    .quill-wrapper .ql-container {
                      font-family: inherit;
                      font-size: 16px;
                      border: none;
                      height: calc(100% - 42px);
                      color: var(--foreground);
                    }
                    .quill-wrapper .ql-toolbar {
                      border: none;
                      border-bottom: 1px solid rgba(145,158,171,0.12);
                      background: rgba(145,158,171,0.04);
                      border-radius: 8px 8px 0 0;
                    }
                    .dark .quill-wrapper .ql-stroke {
                      stroke: #919EAB;
                    }
                    .dark .quill-wrapper .ql-fill {
                      fill: #919EAB;
                    }
                    .dark .quill-wrapper .ql-picker {
                      color: #919EAB;
                    }
                    .dark .quill-wrapper .ql-editor.ql-blank::before {
                      color: #637381;
                    }
                  `}</style>
                  <ReactQuill 
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className="h-full"
                    placeholder="Nhập nội dung tĩnh ở đây..."
                  />
                </div>
              </>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}
