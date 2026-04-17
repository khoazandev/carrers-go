# Chế độ: interview-prep — Chuẩn bị Phỏng vấn

Khi người dùng yêu cầu chuẩn bị phỏng vấn ở một công ty cụ thể, hoặc khi điểm đánh giá (Score) ≥ 4.0 và trạng thái ứng tuyển được cập nhật thành `Interview`.

## Dữ liệu đầu vào

1. **Tên công ty** và **Vị trí** (Bắt buộc)
2. **Báo cáo đánh giá (Evaluation Report)** trong `reports/` (Nếu có)
3. **Ngân hàng câu chuyện** `interview-prep/story-bank.md`
4. **CV** `cv.md` + `article-digest.md`
5. **Hồ sơ cá nhân** `config/profile.yml` + `modes/_profile.md`

## Bước 1 — Nghiên cứu (Research)

Sử dụng WebSearch để trích xuất dữ liệu có cấu trúc, KHÔNG được tóm tắt chung chung. Trích dẫn nguồn rõ ràng.

| Cú pháp tìm kiếm | Dữ liệu cần trích xuất |
|------------------|------------------------|
| `"{company} {role} interview questions site:glassdoor.com"` | Câu hỏi thực tế, độ khó, thời gian, số vòng phỏng vấn |
| `"{company} interview process site:teamblind.com"` | Mô tả quy trình phỏng vấn, chế độ lương thưởng |
| `"{company} {role} interview site:leetcode.com/discuss"` | Các bài toán cụ thể, chủ đề System Design thường hỏi |
| `"{company} engineering blog"` | Tech stack, giá trị cốt lõi, ưu tiên kỹ thuật |
| `"{company} phỏng vấn review site:itviec.com"` | Review phỏng vấn thực tế từ ứng viên Việt Nam |
| `"{company} review công ty site:voz.vn OR site:topdev.vn"` | Văn hóa công ty, chế độ đãi ngộ, quy trình thực tế |

**KHÔNG ĐƯỢC TỰ BỊA CÂU HỎI.** Nếu câu hỏi được suy luận từ Job Description, phải gắn tag `[Suy luận từ JD]`.

## Bước 2 — Tổng quan Quy trình (Process Overview)

```markdown
## Tổng quan Quy trình
- **Số vòng:** {N} vòng, mất khoảng ~{X} ngày từ đầu đến cuối
- **Format:** {VD: HR Screening → Phỏng vấn Kỹ thuật → Bài Test thực hành → Culture Fit → Offer}
- **Độ khó:** {X}/5 (Trung bình trên Glassdoor/ITviec, dựa trên N reviews)
- **Trải nghiệm tích cực:** {X}%
- **Đặc điểm nổi bật:** {VD: "Thiên về Pair-programming thay vì giải thuật (LeetCode)", "Hỏi sâu về kiến trúc hệ thống thay vì lý thuyết"}
- **Nguồn trích dẫn:** {Links}
```

## Bước 3 — Phân tích từng Vòng Phỏng vấn

```markdown
### Vòng {N}: {Loại vòng phỏng vấn}
- **Thời lượng:** {X} phút
- **Người phỏng vấn:** {Đồng nghiệp / Line Manager / Head of Dept / HR}
- **Mục tiêu đánh giá:** {Kỹ năng cụ thể}
- **Câu hỏi thực tế đã ghi nhận:**
  - {Câu hỏi} — [Nguồn: ITviec 2026-Q1]
- **Cách chuẩn bị:** {1-2 hành động cụ thể}
```

## Bước 4 — Dự đoán Câu hỏi (Likely Questions)

### Câu hỏi Kỹ thuật (Technical)
Các câu hỏi về System Design, Live Coding, Kiến trúc, và Domain Knowledge (Kiến thức nghiệp vụ).

### Câu hỏi Hành vi (Behavioral)
Các câu hỏi về Kỹ năng lãnh đạo, Xử lý xung đột, Làm việc nhóm, và Thất bại trong quá khứ.
Đối với mỗi câu hỏi — chỉ ra **Câu chuyện nào trong `story-bank.md`** là phù hợp nhất để trả lời.

### Đặc thù theo Vị trí (Role-specific)
Các câu hỏi bám sát vào yêu cầu của Job Description (JD).

### Cờ đỏ trong Background (Red flags)
Những câu hỏi "xoáy" mà nhà tuyển dụng có khả năng cao sẽ hỏi về khoảng thời gian trống (gap year), nhảy việc liên tục, hoặc các yếu tố bất thường trong hồ sơ. (Đọc kỹ `_profile.md` và `cv.md` để tìm ra).

## Bước 5 — Lắp ráp Ngân hàng Câu chuyện (Story Bank Mapping)

| # | Câu hỏi dự đoán / Chủ đề | Câu chuyện tốt nhất từ story-bank.md | Mức độ phù hợp | Có lỗ hổng không? |
|---|--------------------------|--------------------------------------|----------------|-------------------|

- **Mạnh (strong)**: Câu chuyện trả lời trực diện vào câu hỏi.
- **Một phần (partial)**: Câu chuyện có liên quan nhưng cần điều chỉnh góc nhìn (reframing).
- **Không có (none)**: Không có câu chuyện nào phù hợp → Cảnh báo cho ứng viên chuẩn bị thêm.

## Bước 6 — Checklist Chuẩn bị Kỹ thuật (Technical Checklist)

```markdown
- [ ] {Chủ đề} — Tại sao: "{Bằng chứng từ bước nghiên cứu}"
- [ ] {Chủ đề} — Tại sao: "{Tech Blog của họ xác nhận đây là công nghệ cốt lõi}"
```

Ưu tiên theo tần suất xuất hiện và độ liên quan. Tối đa 10 mục.

## Bước 7 — Tín hiệu từ Công ty (Company Signals)

- **Giá trị cốt lõi (Core Values):** Nêu tên và trích dẫn nguồn (Thường hỏi ở vòng Culture Fit).
- **Từ vựng nội bộ (Glossary):** Các thuật ngữ riêng của công ty để tạo sự đồng điệu khi nói chuyện.
- **Những điều nên tránh (Anti-patterns):** Những điểm trừ thường thấy trong các bài review trượt phỏng vấn.
- **Hỏi lại nhà tuyển dụng:** Chuẩn bị 2-3 câu hỏi sắc bén, chứng minh bạn đã tìm hiểu rất sâu về công ty.

## Đặc thù Phỏng vấn IT tại Việt Nam 🇻🇳

### Các vòng phỏng vấn điển hình
1. **HR Screening** (20-30 phút): Đánh giá mức độ phù hợp văn hóa, kỳ vọng lương (Gross/Net), tiếng Anh, khả năng chịu áp lực.
2. **Technical Interview** (60-90 phút): Hỏi sâu về Tech stack đang dùng, lý thuyết OOP/SOLID, Database, Caching.
3. **Live Coding/Take-home Test** (45-60 phút): Thuật toán (Thường là Leetcode Easy/Medium) hoặc build một mini-app.
4. **System Design** (60 phút): Bắt buộc cho vị trí Mid/Senior trở lên (Đặc biệt ở VNG, Momo, Shopee, Grab, FPT).
5. **Culture Fit / Manager Interview** (30-45 phút): Đánh giá kỹ năng mềm, định hướng nghề nghiệp, khả năng gắn bó.

### Các câu hỏi thường gặp ở Việt Nam
- "Hãy giới thiệu bản thân" (Pitch 2-3 phút, cần súc tích và nêu bật key skills).
- "Lý do bạn rời công ty cũ là gì?"
- "Kỳ vọng lương của bạn? Mức này là Gross hay Net?"
- "Kể về một dự án khó nhất bạn từng làm và cách bạn vượt qua."
- "Bạn xử lý thế nào khi không đồng tình với Technical Lead hoặc PM?"
- System Design: "Thiết kế hệ thống chịu tải cao cho {Ví điện tử / Đặt xe / Cổng thanh toán}."

### Mô hình STAR+R (Áp dụng cho Tiếng Việt)
- **S (Tình huống - Situation):** Bối cảnh và vấn đề lúc đó là gì?
- **T (Nhiệm vụ - Task):** Trách nhiệm cụ thể của bạn là gì?
- **A (Hành động - Action):** BẠN (không phải "chúng tôi") đã làm những bước cụ thể nào?
- **R (Kết quả - Result):** Kết quả đạt được (Phải có con số đo lường cụ thể).
- **R (Bài học - Reflection):** Rút ra được kinh nghiệm gì, nếu làm lại sẽ làm gì tốt hơn?

## Kết xuất Dữ liệu (Output)

Lưu báo cáo vào file: `interview-prep/{company-slug}-{role-slug}.md`.

```markdown
# Chuẩn bị Phỏng vấn: {Tên Công ty} — {Tên Vị trí}

**Báo cáo JD:** {Link trỏ tới Evaluation report hoặc "N/A"}
**Ngày nghiên cứu:** {YYYY-MM-DD}
**Nguồn dữ liệu:** {N} review từ Glassdoor, {N} review từ ITviec/Voz, {N} nguồn khác
```

## Quy tắc Tuyệt đối (Strict Rules)

- **TUYỆT ĐỐI KHÔNG tự bịa ra câu hỏi và gán mác cho một nguồn bất kỳ.**
- **TUYỆT ĐỐI KHÔNG làm giả các chỉ số Rating trên ITviec/Glassdoor.**
- **Phải trích dẫn mọi thứ.** Mỗi câu hỏi, mỗi thống kê đều phải có URL nguồn hoặc tag `[Suy luận]`.
- Dùng Tiếng Việt là ngôn ngữ mặc định trừ khi JD yêu cầu tiếng Anh hoàn toàn.
- Ngôn từ phải thẳng thắn, trực diện, chuyên nghiệp. Đây là tài liệu chiến thuật, không phải văn mẫu truyền cảm hứng.
