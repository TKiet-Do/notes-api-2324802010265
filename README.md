# notes-api-2324802010265

Bài thực hành 1 – Hello Cloud API (môn Điện toán đám mây).

**Sinh viên:** Đỗ Tuấn Kiệt  
**MSSV:** 2324802010265

## Mô tả

API đơn giản bằng Node.js + Express trả về thông tin hệ thống (hostname, CPU, RAM, hệ điều hành, uptime). Kèm trang kết quả so sánh máy cá nhân và GitHub Codespace theo 5 đặc tính NIST.

## Cách chạy

```bash
npm install
npm start
```

Server mặc định chạy tại cổng 3000. Truy cập `http://localhost:3000/` để xem kết quả JSON.

## Chạy test

```bash
npm test
```

## Cấu trúc thư mục

```
src/
  app.js        # Express app
  server.js     # Khởi chạy server
test/
  app.test.js   # Test tự động (node:test)
docs/
  index.html    # Trang kết quả bài lab
```
