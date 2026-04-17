# Mode: auto-evaluate — AI-Powered JD Evaluation

Khi user cung cấp JD URL hoặc text, Antigravity sẽ tự động đánh giá và tạo report hoàn chỉnh.

## Quy trình

### Bước 1 — Thu thập Data
Đọc 3 nguồn:
1. **JD text** — từ `jds/` hoặc extract từ URL
2. **`cv.md`** — CV gốc của candidate
3. **`data/developer-profile.json`** — GitHub profile (nếu có)

### Bước 2 — Phân tích JD
Từ JD text, trích xuất:
- **Tên công ty** + **Tên vị trí**
- **Requirements bắt buộc** (must-have skills, experience)
- **Requirements ưu tiên** (nice-to-have)
- **Soft skills** yêu cầu
- **Keywords** quan trọng (cho ATS matching)

### Bước 3 — Cross-Reference
So sánh JD requirements vs candidate profile:

| JD Requirement | CV/GitHub Match | Status |
|---|---|---|
| React.js | ✅ SmartHire: 14 components, 75+ commits | HIT |
| Figma → Code | ✅ SmartHire: Figma designs → React | HIT |
| REST API | ✅ IELTS_WEB: 13+ APIs via Axios | HIT |
| WordPress | ❌ Không có trong profile | GAP |
| 1 year exp | ⚠️ Intern-level, 2 projects | PARTIAL |

### Bước 4 — Tạo Report (Blocks A-G)
Xuất report theo template chuẩn career-ops:

```
## A) Role Summary
- Title, company, archetype (Niche Fit / Growth Bet / Long Shot)
- Predicted score X.X/5

## B) CV Match Analysis
- Bảng so sánh từng requirement vs proof points
- Hit / Partial / Gap cho mỗi cái

## C) Strengths & Tech Lead Insights (từ CV + GitHub)
- Liệt kê từng điểm mạnh khớp với JD
- **QUAN TRỌNG:** Phải trích xuất dữ liệu "Deep Scan" từ file `developer-profile.json`. Nếu Job yêu cầu về Architecture, Clean Code, Agile... bắt buộc lấy các câu trong mảng `verified_bullets` (như "Demonstrated professional agile workflow..." hoặc "Engineered robust system architecture...") làm bằng chứng thép.

## D) Gaps (thiếu, cần spin)
- Liệt kê gaps + strategy xử lý (spin, omit, learn)

## E) Personalization Plan
- Bảng: Section | Current | Proposed Change | Reason
- Summary tweaks, section reorder, bullet emphasis
- **BẮT BUỘC:** Trong phần 'Proposed Change' của mục Work Experience/Projects, thay thế các gạch đầu dòng cũ bằng nguyên văn các câu lệnh `verified_bullets` từ `developer-profile.json` để push profile lên chuẩn độ sâu Tech Lead.

## F) Interview Prep
- 3 STAR stories mapped to JD requirements
- Technical questions dự đoán

## Keywords Extracted
- Danh sách keywords cho ATS matching
```

### Bước 5 — Lưu Report
Lưu vào `reports/NNN-company-YYYY-MM-DD.md`:
- Tính report number tiếp theo từ reports/ existing
- Format: `002-company-name-2026-04-13.md`

### Bước 6 — Auto Render CV
Sau khi report xong, tự chạy:
```bash
node cli.mjs render reports/NNN-company-YYYY-MM-DD.md --open
```

## Scoring System

| Score | Meaning |
|---|---|
| 5.0 | Perfect match — mọi requirement đều hit |
| 4.0-4.9 | Strong match — 1-2 minor gaps |
| 3.0-3.9 | Moderate — có gaps nhưng spin được |
| 2.0-2.9 | Weak — nhiều gaps, cần cân nhắc |
| < 2.0 | Skip — không phù hợp |

*Lưu ý: Cộng thêm +0.2 đến +0.5 điểm Bonus nếu GitHub `deep_scan` thể hiện rõ Git Hygiene (Atomic commits, Fix commits) khớp với tiêu chuẩn Engineer/Seniority của JD.*

## Archetype Classification

- **Niche Fit** (4.5+): Bạn đạt >90% requirements
- **Growth Bet** (3.5-4.4): Bạn đạt 70-90%, công ty có thể chấp nhận
- **Long Shot** (<3.5): Dưới 70%, chỉ nên apply nếu rất thích

## Ngôn ngữ Output
- Report viết bằng **tiếng Việt** (phù hợp thị trường VN)
- Keywords giữ **tiếng Anh** (cho ATS)
- Summary trong CV giữ **tiếng Anh**
