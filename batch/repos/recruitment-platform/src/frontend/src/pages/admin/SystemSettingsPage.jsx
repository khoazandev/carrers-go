import React, { useState } from 'react';
import DataDropzone from '../../features/admin/components/DataDropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, DownloadCloud, Database, HardDriveDownload } from 'lucide-react';
import { Card } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';

export default function SystemSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportUsers = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Đang khởi tạo luồng giải nén dữ liệu qua Buffer Stream...');
    
    try {
      const response = await axios.get('/api/admin/users/export', {
        withCredentials: true,
        responseType: 'blob' 
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `users_export_${dateStr}.csv`;
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Dữ liệu Cập nhật & Tải Xuống thành công!', { id: toastId });
    } catch (err) {
      console.error('Export Data Error:', err);
      toast.error('Có lỗi xảy ra trong quá trình xuất dữ liệu API.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1C252E] dark:text-white mb-2 flex flex-col md:flex-row items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          Trạm Quản Trị Hệ Thống (Master Data)
        </h1>
        <p className="text-[#637381] dark:text-[#919EAB] font-medium mt-3">
          Công cụ nhập/xuất báo cáo và xử lý Master Data số lượng lớn chuyên dụng, thiết kế ngăn chặn sập tài nguyên phía Backend.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Import Region */}
        <Card variant="glass" className="p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
          <div className="flex items-start gap-4 mb-6 border-b border-[rgba(145,158,171,0.12)] pb-6">
            <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2">Tải lên CSDL (Import System Configs)</h2>
              <p className="text-sm font-medium text-[#637381] dark:text-[#919EAB] leading-relaxed">
                Hỗ trợ cập nhật hàng rào Master Data (Category/Tagging) bằng file gốc tiêu chuẩn. Hệ thống tự động kiểm tra (validation) dữ liệu rác trước khi Commit vào CSDL.
              </p>
            </div>
          </div>
          
          <div className="w-full">
            <DataDropzone 
              endpoint="/api/admin/master-data/import" 
              label="Kéo thả File Nguồn (.csv)"
              acceptedTypes={{ 'text/csv': ['.csv'] }}
              onUploadSuccess={() => { /* Optionally refresh tables here */ }}
            />
          </div>
        </Card>

        {/* Export Region */}
        <Card variant="glass" className="p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-[rgba(145,158,171,0.12)]">
          <div className="flex items-start gap-4 mb-6 border-b border-[rgba(145,158,171,0.12)] pb-6">
            <div className="p-3 bg-[#FFAB00]/10 text-[#FFAB00] rounded-xl shrink-0">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C252E] dark:text-white mb-2">Trích xuất CSDL (Streaming Exports)</h2>
              <p className="text-sm font-medium text-[#637381] dark:text-[#919EAB] leading-relaxed">
                Xuất trọn bộ hệ thống người dùng. Quá trình diễn ra hoàn toàn tự động thông qua giao thức luồng Stream Buffer, triệt tiêu tối đa rủi ro giật hay vỡ quy mô (Runtime Memory OOM) khi Data đạt mốc hàng triệu bản ghi.
              </p>
            </div>
          </div>
          
          <div className="bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.04)] p-6 rounded-2xl border border-[rgba(145,158,171,0.12)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-[15px] font-bold text-[#1C252E] dark:text-white mb-1">Dataset Backup Trực Tuyến</h3>
              <p className="text-sm font-medium text-[#637381] dark:text-[#919EAB]">Mảng Users (Đầy đủ thuộc tính Email, Tình trạng, Chức vụ, Timestamps).</p>
            </div>
            <Button 
              onClick={handleExportUsers} 
              disabled={isExporting} 
              isLoading={isExporting}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold h-12 px-6 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-0.5 whitespace-nowrap w-full md:w-auto"
            >
              <HardDriveDownload className="w-5 h-5 mr-2" />
              {isExporting ? 'Đang Ép Luồng...' : 'Export File Phân Tích'}
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
