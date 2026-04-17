# Chế độ: pipeline — Hàng đợi URL

Xử lý tự động danh sách URL việc làm trong `data/pipeline.md`.

## Luồng xử lý
1. Đọc `data/pipeline.md`, tìm các mục đánh dấu `- [ ]` dưới phần "Chờ xử lý" (Pending).
2. Với mỗi URL:
   - Dùng lệnh CLI Go `career-ops pipeline extract <URL>` để cào JD.
   - Nếu lỗi -> Cảnh báo `- [!]`.
   - Nếu OK -> Chạy đánh giá `oferta` (Tạo Block A-F).
   - Đổi trạng thái thành `- [x] #NNN | Công ty | Vị trí | Điểm | PDF`.
3. Chạy đa luồng (Goroutines) nếu có nhiều URL.
4. Tổng hợp thành bảng kết quả cuối cùng báo cáo cho ứng viên.

**Hỗ trợ định dạng URL:**
- ITviec, TopDev, VietnamWorks, LinkedIn.
- Link trực tiếp tới trang tuyển dụng (Careers page).
