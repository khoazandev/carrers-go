import { apiClient, API } from '@shared/services'

const cvService = {
  // Lấy danh sách CV
  getMyCvs: () => apiClient.get(API.CVS.BASE),

  // Tạo CV Online (Builder)
  createOnlineCv: (data) => apiClient.post(API.CVS.BASE, data),

  // Cập nhật CV Online
  updateOnlineCv: (id, data) => apiClient.put(API.CVS.BY_ID(id), data),

  // Upload tĩnh 1 CV PDF
  uploadCv: (formData) => apiClient.post(API.CVS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Set default
  setDefault: (id) => apiClient.patch(API.CVS.SET_DEFAULT(id)),

  // Parse text từ file CV (OCR/PDF extract)
  parseOcrPreview: (formData) => apiClient.post(API.CVS.PARSE_OCR, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Xóa CV
  deleteCv: (id) => apiClient.delete(API.CVS.BY_ID(id)),
}

export default cvService
