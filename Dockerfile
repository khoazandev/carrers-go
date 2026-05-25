FROM golang:1.26.2-alpine AS build

RUN apk add --no-cache git

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/career-ops .

FROM alpine:3.21

RUN apk add --no-cache ca-certificates chromium git \
	&& addgroup -S app \
	&& adduser -S app -G app

ENV HOME=/tmp
ENV ROD_BROWSER_BIN=/usr/bin/chromium-browser

WORKDIR /workspace
COPY --from=build /out/career-ops /usr/local/bin/career-ops

USER app
ENTRYPOINT ["career-ops"]
