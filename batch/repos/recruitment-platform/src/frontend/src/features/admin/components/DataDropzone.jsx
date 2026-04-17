import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

export default function DataDropzone({ endpoint, label, acceptedTypes, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
       setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes || { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading('Đang xử lý tải lên nội dung...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      });
      toast.success('Nhập dữ liệu thành công!', { id: toastId });
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi upload file. Kiểm tra lại kết nối.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[260px] p-8 text-center
          ${isDragReject ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10' : 
            isDragActive ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 
            file ? 'border-green-400 bg-green-50 dark:bg-green-500/10' : 
            'border-[rgba(145,158,171,0.32)] bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)] hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-500/5'}
        `}
      >
        <input {...getInputProps()} />
        {
          file ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shadow-inner">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[#1C252E] dark:text-white font-extrabold text-xl">{file.name}</p>
                <p className="text-[#637381] dark:text-[#919EAB] font-semibold text-[15px] mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-2 shadow-inner">
                <UploadCloud className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[#1C252E] dark:text-white font-extrabold text-xl mb-1">
                  {isDragActive ? 'Thả file vào đây ngay ...' : (label || 'Kéo thả file CSV vào đây')}
                </p>
                <p className="text-[#637381] dark:text-[#919EAB] font-semibold text-[15px]">
                  Hoặc <span className="text-green-600 dark:text-green-400 font-bold underline decoration-green-300 underline-offset-4">Nhấp để mở thư mục</span>
                </p>
              </div>
              <p className="text-[11px] font-extrabold text-[#919EAB] uppercase tracking-widest mt-2 border border-[rgba(145,158,171,0.32)] px-4 py-1.5 rounded-full">
                Chỉ hỗ trợ .CSV
              </p>
            </div>
          )
        }
      </div>

      {file && (
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={(e) => { e.stopPropagation(); setFile(null); }} 
            disabled={isUploading}
            className="rounded-xl px-8 h-12 font-bold border-[rgba(145,158,171,0.32)]"
          >
            Hủy Bỏ
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }} 
            disabled={isUploading}
            isLoading={isUploading}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold px-10 h-12 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-0.5"
          >
             {isUploading ? 'Đang Đồng Bộ Luồng...' : 'Xác nhận Upload Dữ Liệu'}
          </Button>
        </div>
      )}
    </div>
  );
}
