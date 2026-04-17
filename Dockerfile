FROM node:20-alpine

# Cài đặt git và một số tool cơ bản cần thiết cho Github analyzer
RUN apk add --no-cache git

WORKDIR /app

# Copy các file package
COPY package.json package-lock.json* ./

# Cài đặt production dependencies (gồm Playwright browsers nếu cần)
RUN npm ci --only=production
RUN npx playwright install --with-deps chromium

# Copy toàn bộ mã nguồn
COPY . .

# Expose nếu có tool command nào mở web UI (hiện tại CLI-only, không yêu cầu expose)
# ENTRYPOINT mặc định cho CLI
ENTRYPOINT ["node", "cli.mjs"]
