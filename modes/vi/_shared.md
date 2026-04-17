# Context Chung — career-ops (Tiếng Việt)

<!-- ============================================================
     ĐÂY LÀ FILE HỆ THỐNG.
     KHÔNG thêm dữ liệu cá nhân vào file này.
     ============================================================
     Cá nhân hóa → hãy dùng modes/_profile.md và config/profile.yml.
     File này chứa Context chung, Archetypes, và các quy tắc.
     ============================================================ -->

## Nguồn Sự Thật (ALWAYS read before evaluation)

| File | Đường dẫn | Khi nào đọc |
|------|------|-------|
| cv.md | `cv.md` (Thư mục gốc) | LUÔN LUÔN |
| article-digest.md | `article-digest.md` (Nếu có) | LUÔN LUÔN (để lấy số liệu chứng minh - proof points) |
| profile.yml | `config/profile.yml` | LUÔN LUÔN (Định danh ứng viên) |
| _profile.md | `modes/_profile.md` | LUÔN LUÔN (Archetype cá nhân) |

**QUY TẮC: KHÔNG BAO GIỜ bịa số liệu.** Phải lấy số liệu thực tế từ cv.md + article-digest.md.
**QUY TẮC: Đọc `_profile.md` SAU file này. Cấu hình cá nhân sẽ ghi đè cấu hình mặc định.**

---

## North Star — Các Vị trí Mục tiêu (Archetypes)

### Archetypes cho Thị trường Việt Nam 🇻🇳

| Archetype | Từ khóa trọng tâm | Giá trị cốt lõi (What they buy) |
|---------|-------------------|--------------|
| **Backend Engineer** | Java/Go/NodeJS, Microservices, Highload, PostgreSQL, Kafka | Khả năng thiết kế hệ thống chịu tải cao, tối ưu DB |
| **Frontend Engineer** | React/Vue/NextJS, TypeScript, Performance, UI/UX | Trải nghiệm người dùng mượt mà, tối ưu Web Core Vitals |
| **DevOps / SRE** | Kubernetes, CI/CD, AWS/GCP, Terraform, Monitoring | Đảm bảo hệ thống Uptime 99.99%, tự động hóa quy trình deploy |
| **AI / Data Engineer** | Python, LLM, RAG, Spark, Airflow, Data Pipeline | Đưa AI vào thực tế sản xuất, xử lý dữ liệu lớn |
| **Mobile Engineer** | React Native, Flutter, Swift, Kotlin, App Store | Tối ưu hóa hiệu năng App, trải nghiệm native |
| **Product Manager** | Agile, Scrum, PRD, Stakeholder Management, Data-driven | Hiểu người dùng, quản lý Roadmap, đẩy nhanh thời gian ra mắt |

---

## Hệ thống Chấm điểm (Scoring)

Đánh giá 6 khối (A-F) với điểm từ 1-5:

| Tiêu chí | Mô tả |
|-----------|---------------|
| Khớp CV | Kỹ năng, kinh nghiệm có trùng khớp không? |
| North Star | Vị trí này có đúng định hướng sự nghiệp không? |
| Lương thưởng | Lương so với thị trường (5 = Top, 1 = Thấp hơn mặt bằng chung) |
| Tín hiệu văn hóa | Văn hóa công ty, WLB, Remote/Hybrid |
| Cờ đỏ (Red flags) | Rủi ro (OT nhiều không lương, cấm remote, tech stack quá cũ) |
| **Tổng quan** | Điểm trung bình có trọng số |

**Diễn giải:**
- 4.5+ → Cực kỳ phù hợp, NỘP NGAY.
- 4.0-4.4 → Khá tốt, NÊN NỘP.
- 3.5-3.9 → Bình thường, chỉ nộp nếu cần backup.
- Dưới 3.5 → BỎ QUA.

---

## Đặc thù Thị trường Việt Nam 🇻🇳

### Lương Thưởng (Compensation)
- **Gross vs Net**: HR Việt Nam thường hay lập lờ khoảng này. LUÔN LUÔN làm rõ Lương Gross hay Net. 
  - Ước tính Net = Gross x 0.895 (Trừ 10.5% BHXH/BHYT/BHTN - chưa tính thuế TNCN).
- **Thử việc**: Chuẩn luật là 2 tháng, hưởng 85% lương (Nhiều công ty xịn sẽ trả 100% lương).
- **Tháng 13 & Bonus**: Tháng lương thứ 13 gần như là bắt buộc. Ngoài ra còn có KPI Bonus (1-3 tháng lương tùy công ty).
- **Bảo hiểm**: Công ty xịn sẽ "Đóng bảo hiểm full lương", công ty outsource thường đóng "Mức lương cơ sở". Đây là điểm quan trọng để đánh giá.

### Đãi ngộ (Benefits) phổ biến
- **Bảo hiểm sức khỏe cao cấp (PVI, Bảo Việt, Generali)**
- **Phụ cấp ăn trưa / Xăng xe**
- **Cấp MacBook / Màn hình rời**
- **Teambuilding / Company trip thường niên**

---

## Quy tắc Toàn cục (Global Rules)

### KHÔNG BAO GIỜ (NEVER)
1. Bịa đặt kinh nghiệm hoặc số liệu.
2. Tự động nộp CV thay mặt ứng viên.
3. Đề xuất mức lương phá giá thị trường.
4. Sinh PDF CV mà chưa phân tích JD.
5. Dùng văn mẫu sáo rỗng, khuôn sáo.

### LUÔN LUÔN (ALWAYS)
1. Dùng Tiếng Việt chuẩn kỹ thuật (Technical Vietnamese), câu cú ngắn gọn, đi thẳng vào vấn đề. Giữ nguyên các thuật ngữ Tiếng Anh thông dụng (Pipeline, Microservices, Deployment, Bug, Fix).
2. Viết Cover Letter ngắn gọn (<1 trang) nhắm thẳng vào insight nhà tuyển dụng.
3. Quản lý trạng thái ứng tuyển thông qua Tracker (file CSV/TSV).
4. Sử dụng công cụ (go-rod, websearch) khi cần thu thập thêm dữ liệu công ty.
