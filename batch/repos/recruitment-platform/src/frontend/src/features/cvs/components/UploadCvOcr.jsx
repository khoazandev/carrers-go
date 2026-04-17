import { useState, useDeferredValue, useRef } from 'react'
import { FileUp, FileText, CheckCircle2, FileType2 } from 'lucide-react'
import { useParseOcrCv, useUploadCv, useCreateOnlineCv } from '../hooks/useCv'

export default function UploadCvOcr() {
  const [selectedFile, setSelectedFile] = useState(null)
  
  // States of the editor
  const [draftText, setDraftText] = useState('')
  const [cvTitle, setCvTitle] = useState('')

  // Mutations
  const parseOcr = useParseOcrCv()
  const uploadStaticCv = useUploadCv()
  const createOnlineCv = useCreateOnlineCv()
  
  const fileInputRef = useRef(null)

  // Memoize heavy text re-renders
  const deferredText = useDeferredValue(draftText)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setCvTitle(file.name.split('.')[0] || 'My CV')
    setDraftText('')

    parseOcr.mutate(file, {
      onSuccess: (res) => {
        const extractedText = res.data?.data?.text || res.data?.text || 'Không trích xuất được text. Vui lòng kiểm tra lại file.'
        setDraftText(extractedText)
      }
    })
  }

  const handleTextChange = (e) => {
    setDraftText(e.target.value)
  }

  const handleSaveStatic = () => {
    if (!selectedFile) return
    uploadStaticCv.mutate(
      { file: selectedFile, title: cvTitle },
      { onSuccess: () => setSelectedFile(null) }
    )
  }

  const handleSaveAsOnline = () => {
    if (!deferredText) return
    const data = {
      title: cvTitle || 'Online CV',
      parsedData: {
        summary: deferredText,
        skills: [],
        education: [],
        experience: [],
        projects: []
      }
    }
    createOnlineCv.mutate(data, { onSuccess: () => setSelectedFile(null) })
  }

  return (
    <div className="w-full flex flex-col gap-10">
      
      {/* Upload Dropzone */}
      <div className="w-full flex flex-col items-center">
        <div 
          className={`w-full border-2 border-dashed rounded-[2rem] p-10 md:p-14 flex flex-col items-center text-center cursor-pointer transition-all duration-500 group
            ${parseOcr.isPending ? 'border-[rgba(145,158,171,0.2)] bg-[rgba(145,158,171,0.04)] cursor-not-allowed' : 'border-[#22c55e]/40 bg-[#22c55e]/[0.02] hover:bg-[#22c55e]/5 hover:border-[#22c55e]/60'}
          `}
          onClick={() => !parseOcr.isPending && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
            disabled={parseOcr.isPending}
          />
          
          {parseOcr.isPending ? (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-12 h-12 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2">Đang quét OCR...</h3>
              <p className="text-[#637381] text-sm">Hệ thống AI đang bóc tách nội dung PDF/Word của bạn (chạy ngầm)</p>
            </div>
          ) : selectedFile ? (
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-2xl shadow-md flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
               </div>
               <h3 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2 line-clamp-1">{selectedFile.name}</h3>
               <p className="text-[#637381] font-semibold text-sm">Bấm hoặc kéo thả để thay đổi file khác</p>
             </div>
          ) : (
            <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-5px_rgba(34,197,94,0.1)] group-hover:border-[#22C55E]/30 transition-all duration-500">
                  <FileUp className="w-10 h-10 text-[#22c55e]" />
               </div>
               <h3 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-3">Tải file CV của bạn lên đây</h3>
               <p className="text-[#637381] font-medium max-w-sm leading-relaxed">Hỗ trợ PDF, DOC, DOCX. Dung lượng tối đa 5MB. Khuyên dùng định dạng chuẩn PDF để AI quét chính xác nhất.</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor & Previewer */}
      {selectedFile && !parseOcr.isPending && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 w-full bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-3xl p-6 md:p-8 shadow-sm">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[rgba(145,158,171,0.12)]">
            <div className="w-full max-w-md">
              <label className="block text-[11px] font-bold tracking-widest text-[#919EAB] uppercase mb-2">Tên CV (Gợi nhớ)</label>
              <input 
                value={cvTitle} 
                onChange={(e) => setCvTitle(e.target.value)} 
                maxLength={40}
                className="w-full h-12 px-4 rounded-xl border border-[rgba(145,158,171,0.2)] bg-transparent text-[#1C252E] dark:text-white font-bold focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button 
                className="flex-1 md:flex-none h-12 px-6 rounded-xl font-bold border border-[rgba(145,158,171,0.2)] text-[#1C252E] dark:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all disabled:opacity-50" 
                onClick={handleSaveStatic}
                disabled={uploadStaticCv.isPending}
              >
                {uploadStaticCv.isPending ? 'Đang lưu...' : 'Lưu Tĩnh'}
              </button>
              <button 
                className="flex-1 md:flex-none h-12 px-6 rounded-xl font-bold bg-[#1C252E] dark:bg-white text-white dark:text-[#1C252E] hover:bg-[#22c55e] dark:hover:bg-[#22c55e] hover:text-white transition-all disabled:opacity-50 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_20px_-6px_rgba(34,197,94,0.4)]"
                onClick={handleSaveAsOnline}
                disabled={createOnlineCv.isPending}
              >
                {createOnlineCv.isPending ? 'Đang tạo...' : 'Tạo CV Trực Tuyến'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="block text-[10px] font-bold tracking-widest text-[#919EAB] uppercase mb-3 flex items-center gap-2"><FileType2 className="w-4 h-4 text-[#22c55e]"/> Text Độ Chính Xác Cao (Editable)</label>
              <textarea
                className="w-full h-[400px] p-5 rounded-2xl border border-[rgba(145,158,171,0.2)] bg-[rgba(145,158,171,0.04)] text-[#1C252E] dark:text-white font-mono text-sm focus:border-[#22c55e] focus:bg-[rgba(34,197,94,0.02)] transition-all outline-none resize-none leading-relaxed"
                value={draftText}
                onChange={handleTextChange}
                placeholder="Nội dung bóc tách AI sẽ hiện tại đây. Bạn có thể sửa trực tiếp..."
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px] font-bold tracking-widest text-[#919EAB] uppercase mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-[#22c55e]"/> Data Render Preview</label>
              <div className="w-full h-[400px] p-6 rounded-2xl border border-[rgba(145,158,171,0.2)] bg-transparent overflow-y-auto custom-scrollbar">
                 <div className="whitespace-pre-wrap font-medium text-sm text-[#637381] dark:text-[#C4CDD5] leading-relaxed">
                   {deferredText || <span className="italic opacity-60">Bản xem trước Data Model...</span>}
                 </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
