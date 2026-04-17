Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 Đang thiết lập Beeknoee AI API cho Claude Code" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# Kiểm tra xem file .env có tồn tại không
if (Test-Path ".env") {
    Write-Host "[*] Đang đọc cấu hình từ file .env..." -ForegroundColor Blue
    Get-Content ".env" | Foreach-Object {
        # Bỏ qua dòng trống hoặc comment
        if ($_ -match "^\s*#" -or [string]::IsNullOrWhiteSpace($_)) { return }
        
        # Tách key và value
        $key, $value = $_ -split '=', 2
        $key = $key.Trim()
        $value = $value.Trim() -replace '^"(.*)"$', '$1' -replace "^'(.*)'$", '$1'
        
        # Set biến môi trường
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "[x] Đã thiết lập $key" -ForegroundColor Green
    }
} else {
    Write-Host "[!] Cảnh báo: Không tìm thấy file .env. Vui lòng tạo file .env bằng cách chạy lệnh hoặc copy từ mẫu." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Bắt đầu khởi chạy Claude Code ($env:CLAUDE_MODEL)..." -ForegroundColor Yellow

# Chạy Claude Code kèm theo model được chỉ định
if ($env:CLAUDE_MODEL) {
    claude --model $env:CLAUDE_MODEL
} else {
    claude
}
