# notes-api-2324802010265

Báo cáo Thực hành môn Điện toán đám mây (Bài 1 & Bài 2).

**Sinh viên:** Đỗ Tuấn Kiệt  
**MSSV:** 2324802010265  
**GitHub:** [TKiet-Do](https://github.com/TKiet-Do)  
**Package GHCR:** [ghcr.io/tkiet-do/notes-api:1.0](https://github.com/users/TKiet-Do/packages/container/package/notes-api)

---

## 1. Bài thực hành 1 – Hello Cloud API

API đơn giản bằng Node.js + Express trả về thông tin hệ thống (hostname, CPU, RAM, hệ điều hành, thời gian hoạt động). Kèm trang kết quả so sánh máy cá nhân và GitHub Codespace theo 5 đặc tính NIST.

### Cài đặt và khởi chạy cục bộ

```bash
npm install
npm start
```

Server mặc định lắng nghe tại cổng `3000`. Truy cập `http://localhost:3000/` để kiểm tra kết quả JSON.

### Kiểm thử tự động

```bash
npm test
```

---

## 2. Bài thực hành 2 – Docker Container, GHCR & Mô phỏng CloudSim Plus

Đóng gói ứng dụng `notes-api` thành Docker container image nhẹ (dựa trên nền `node:22-alpine`), phát hành lên GitHub Packages (GHCR), quản trị tài nguyên container với cgroups và tiến hành mô phỏng hạ tầng điện toán đám mây bằng CloudSim Plus.

### 2.1. Đóng gói (Build) Docker Image

Sử dụng Dockerfile đã cấu hình sẵn (`USER node`, cổng `3000`):

```bash
docker build -t notes-api:1.0 .
```

Kiểm tra kích thước image sau khi build:

```bash
docker images notes-api:1.0
```

### 2.2. Khởi chạy Container & Giới hạn tài nguyên

Khởi chạy container `notes1` (không giới hạn bộ nhớ):

```bash
docker run -d --name notes1 -p 3001:3000 notes-api:1.0
```

Khởi chạy container `notes2` (áp đặt giới hạn bộ nhớ 128MB qua cgroups):

```bash
docker run -d --name notes2 --memory 128m -p 3002:3000 notes-api:1.0
```

Kiểm tra mức sử dụng tài nguyên thực tế của các container:

```bash
docker stats --no-stream
```

Đo thời gian khởi động container:

```bash
time docker run --rm notes-api:1.0 node -e "console.log('started')"
```

### 2.3. Tải (Pull) Image từ GitHub Container Registry (GHCR)

Image đã được xuất bản công khai trên GitHub Packages:

```bash
docker pull ghcr.io/tkiet-do/notes-api:1.0
docker run -d --name notes-ghcr -p 3003:3000 ghcr.io/tkiet-do/notes-api:1.0
```

Kiểm tra API từ container tải về:

```bash
curl http://localhost:3003/
```

### 2.4. Mô phỏng Đám mây với CloudSim Plus

Tập tin kịch bản mô phỏng đặt tại `cloudsim/BasicFirstExample.java`.

Các kịch bản thực nghiệm:
- **Lần 0 (Mặc định):** 1 Host 8 lõi, 2 VM 4 lõi, 4 Cloudlet 2 lõi, bộ lập lịch `CloudletSchedulerTimeShared` (hoàn thành lúc 20.1s).
- **Lần 1 (Tăng VMS từ 2 lên 4):** Host thiếu lõi (4x4 = 16 > 8), Vm 2 và Vm 3 rơi vào `failed list`, các Cloudlet bắt đầu trễ lúc 25.6s và hoàn thành lúc 45.6s.
- **Lần 2 (Tăng CLOUDLETS từ 4 lên 8):** Thiếu RAM và băng thông, chỉ 4 cloudlet SUCCESS lúc 65.7s kèm cảnh báo bỏ lỡ sự kiện do VM bị hủy sớm.
- **Lần 3 (CloudletSchedulerSpaceShared):** Hoàn thành lúc 20.1s (bằng lần 0 vì mỗi VM 4 lõi đủ cho 2 cloudlet 2 lõi, không phát sinh tranh chấp lõi).

Lệnh thực thi mô phỏng qua Maven:

```bash
mvn clean compile exec:java -Dexec.mainClass="org.cloudsimplus.examples.BasicFirstExample"
```

---

## 3. Cấu trúc thư mục

```
.
├── Dockerfile                   # Đặc tả đóng gói Docker image nhẹ (node:22-alpine)
├── package.json                 # Thông tin dự án và dependencies
├── package-lock.json
├── cloudsim/
│   └── BasicFirstExample.java   # Kịch bản mô phỏng CloudSim Plus
├── docs/
│   ├── index.html               # Trang báo cáo tổng hợp Bài 1 & Bài 2
│   └── evidence/                # Minh chứng số liệu thực nghiệm thực tế
│       ├── api-notes1.json      # Phản hồi API từ container notes1
│       ├── api-notes2.json      # Phản hồi API từ container notes2
│       ├── cloudsim-run0.txt    # Nhật ký mô phỏng CloudSim Lần 0
│       ├── cloudsim-run1.txt    # Nhật ký mô phỏng CloudSim Lần 1
│       ├── cloudsim-run2.txt    # Nhật ký mô phỏng CloudSim Lần 2
│       ├── cloudsim-run3.txt    # Nhật ký mô phỏng CloudSim Lần 3
│       ├── docker-images.txt    # Kích thước image notes-api:1.0
│       ├── docker-stats.txt     # Thống kê docker stats (notes1 vs notes2)
│       ├── kernel.txt           # So sánh kernel trong và ngoài container
│       ├── pull-test.json       # Phản hồi API từ image pull từ GHCR
│       └── startup-time.txt     # Số liệu đo thời gian khởi động container
├── src/
│   ├── app.js                   # Ứng dụng Express
│   └── server.js                # Điểm khởi chạy server
└── test/
    └── app.test.js              # Kiểm thử tự động API
```
