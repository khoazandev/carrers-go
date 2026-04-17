# career-ops — Chế độ Tiếng Việt (`modes/vi/`)

Thư mục này chứa phiên bản Tiếng Việt của các chế độ career-ops dành cho ứng viên làm việc tại thị trường Việt Nam hoặc ứng tuyển vào các vị trí yêu cầu tiếng Việt.

## Khi nào nên sử dụng?

Sử dụng `modes/vi/` nếu bạn đáp ứng ít nhất một trong các điều kiện sau:

- Bạn đang ứng tuyển các **vị trí tại Việt Nam** (ITviec, TopDev, TopCV, VietnamWorks, LinkedIn VN).
- **CV của bạn bằng tiếng Việt** hoặc bạn thường xuyên chuyển đổi giữa tiếng Việt và tiếng Anh tùy theo JD.
- Bạn cần AI viết thư xin việc, trả lời câu hỏi phỏng vấn bằng **tiếng Việt tự nhiên, chuẩn kỹ thuật**, thay vì văn phong dịch máy.
- Bạn làm việc với **đặc thù thị trường Việt Nam**: Lương Gross/Net, Đóng bảo hiểm Full lương, BHXH/BHYT, Tháng lương thứ 13, Thử việc 2 tháng hưởng 85% lương.

Nếu phần lớn JD là tiếng Anh, bạn có thể dùng chế độ mặc định ở `modes/`. Tuy nhiên, chế độ tiếng Anh sẽ không hiểu hết các mánh khóe và đặc thù của thị trường nội địa.

## Cách kích hoạt?

### Cách 1 — Theo từng phiên làm việc (Per session)

Hãy nói với AI (Claude/Antigravity) khi bắt đầu:

> "Hãy sử dụng chế độ tiếng Việt trong `modes/vi/`."
> hoặc "Đánh giá Job này bằng tiếng Việt nhé — dùng `modes/vi/_shared.md` và `modes/vi/oferta.md`."

### Cách 2 — Tự động thông qua profile (Khuyên dùng)

Thêm vào file `config/profile.yml`:

```yaml
language:
  primary: vi
  modes_dir: modes/vi
```

Vào đầu phiên, nhắc nhẹ AI: "Nhớ đọc `profile.yml` nhé, tôi đã set `language.modes_dir` thành tiếng Việt rồi."

## Tiến độ Việt Hóa

| File | Bản gốc | Mục đích |
|------|----------|------------|
| `_shared.md` | `modes/_shared.md` (EN) | Context chung, Archetypes, Quy tắc toàn cục, Đặc thù thị trường VN |
| `oferta.md` | `modes/oferta.md` (ES) | Đánh giá toàn diện Job Description (Block A-F) |
| `apply.md` | `modes/apply.md` (ES) | Trợ lý điền form ứng tuyển (Cover Letter, Hỏi đáp) |
| `pipeline.md` | `modes/pipeline.md` (ES) | Hàng đợi URL / Second Brain để xử lý hàng loạt |
| `interview-prep.md` | `modes/interview-prep.md` (EN) | Chuẩn bị phỏng vấn (Đã dịch) |

## Từ vựng (Glossary)

| Tiếng Anh | Tiếng Việt (trong dự án này) |
|---------|-------------------------------|
| Job posting | Tin tuyển dụng / JD |
| Application | Hồ sơ ứng tuyển |
| Cover letter | Thư xin việc (Cover Letter) |
| Resume / CV | CV / Sơ yếu lý lịch |
| Salary | Lương |
| Compensation | Đãi ngộ |
| Skills | Kỹ năng |
| Interview | Phỏng vấn |
| Hiring manager | Quản lý tuyển dụng / Line Manager |
| Recruiter | Headhunter / HR / Recruiter |
| AI | Trí tuệ nhân tạo (AI) |
| Requirements | Yêu cầu công việc |
| Notice period | Thời gian báo nghỉ (Notice period) |
| Probation | Thử việc |
| Remote | Làm việc từ xa (Remote) |
| Hybrid | Hybrid (Kết hợp lên công ty và remote) |
| On-site | Làm việc tại văn phòng (On-site) |
| Gross salary | Lương Gross (Trưa trừ thuế/bảo hiểm) |
| Net salary | Lương Net (Thực nhận) |
| Social insurance | Bảo hiểm xã hội (BHXH) |
| 13th month salary | Lương tháng 13 |
| Performance bonus | Thưởng hiệu suất (KPI/Performance bonus) |
