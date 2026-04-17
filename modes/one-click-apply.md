# Mode: one-click-apply — Quy trình Apply 1 lệnh

Khi user nói: **"Apply cho job này: <URL>"**, Antigravity thực hiện toàn bộ pipeline:

## Trigger
User nói bất kỳ dạng nào:
- "Apply cho job này: https://..."
- "Tạo CV cho JD này: https://..."
- "Đánh giá và apply: https://..."
- Hoặc paste JD text trực tiếp

## Pipeline (6 bước tự động)

### Step 1: Extract JD
```bash
node cli.mjs pipeline extract <url>
```
- Đọc output từ `jds/` hoặc parse text user paste
- Nếu URL không extract được → yêu cầu user paste text

### Step 2: Load Context
Đọc 3 file:
- `cv.md` — CV gốc  
- `data/developer-profile.json` — GitHub profile (nếu chưa có → gợi ý chạy `node cli.mjs github-profile khoazandev`)
- `config/profile.yml` — Contact info

### Step 3: Evaluate (AI — do Antigravity thực hiện)
Theo quy trình trong `modes/evaluate.md`:
1. Parse JD requirements
2. Cross-reference vs CV + GitHub profile
3. Tính match score
4. Generate report blocks A-G
5. Lưu report vào `reports/NNN-company-YYYY-MM-DD.md`

### Step 4: Render CV
```bash
node cli.mjs render reports/NNN-company-YYYY-MM-DD.md --open
```
- Tự inject keywords từ report vào Core Competencies
- Reorder bullets theo JD relevance
- Output HTML vào `output/`

### Step 5: Generate PDF
```bash
node cli.mjs pdf output/cv-le-van-khoa-company.html output/cv-le-van-khoa-company-YYYY-MM-DD.pdf
```

### Step 6: Update Tracker
Thêm entry vào `data/applications.md`:
```markdown
| NNN | Company | Role | Score | Date | Status | URL |
```

## Output cho User
Sau khi xong, trình bày:

```
═══════════════════════════════════════════════
✅ APPLICATION READY

🏢 Company: [tên]
💼 Role: [vị trí]  
📊 Match Score: X.X/5 ([Archetype])
🔑 Keywords injected: N
🚀 Tech Lead Insights: [Tóm tắt 1 bullet xịn nhất từ Deep Scan profile nếu có]
📄 Report: reports/NNN-xxx.md
📄 CV HTML: output/cv-xxx.html
📄 CV PDF: output/cv-xxx-YYYY-MM-DD.pdf

⚠️ Gaps to address:
  - [gap 1]: [strategy]
  - [gap 2]: [strategy]

💡 Next: Review CV, then submit application
═══════════════════════════════════════════════
```

## Fallback Rules

1. **JD extract fails** → "Paste JD text vào đây, tôi sẽ evaluate"
2. **developer-profile.json missing** → "Chạy `node cli.mjs github-profile khoazandev` trước"
3. **Score < 2.5** → Cảnh báo: "JD này match thấp (X.X/5). Vẫn muốn tạo CV?"
4. **PDF generator fails** → "PDF failed, mở HTML để print thủ công"

## Không làm
- KHÔNG tự submit application (user tự nộp)
- KHÔNG gửi email tự động
- KHÔNG sửa cv.md gốc (chỉ tạo output mới)
