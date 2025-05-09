# ProjectManagement-Backend

## Giới thiệu
Backend cho hệ thống quản lý dự án được phát triển bằng NestJS, TypeORM và PostgreSQL.

## Cài đặt

### Yêu cầu
- Node.js (>= 14.x)
- PostgreSQL (>= 12.x)

### Các bước cài đặt

1. Clone dự án:
```bash
git clone <repository-url>
cd ProjectManagement-Backend
```

2. Cài đặt các dependency:
```bash
npm install
```

3. Tạo file .env từ mẫu sau:
```
# Application
APP_PORT=3000

# Database Configuration - PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=project_management

# JWT
jwtSecret=your_jwt_secret_key
```

4. Tạo database trong PostgreSQL:
```sql
CREATE DATABASE project_management;
```

5. Khởi chạy ứng dụng:
```bash
npm run start:dev
```

## Chuyển từ MySQL sang PostgreSQL

Dự án đã được cập nhật để chuyển từ MySQL sang PostgreSQL. Các thay đổi bao gồm:

1. Thay đổi cấu hình kết nối trong `app.module.ts`:
   - Đổi `type: 'mysql'` thành `type: 'postgres'`

2. Cập nhật các kiểu dữ liệu trong entities:
   - `int` -> `integer`
   - `double` -> `float`
   - `enum` -> `text`
   - `varchar` (không có giới hạn length) -> `text`

3. Sử dụng package `pg` để kết nối với PostgreSQL.

**Lưu ý**: Khi chạy lần đầu với `synchronize: true`, TypeORM sẽ tự động tạo các bảng và quan hệ trong PostgreSQL.

## API Documentation
Sau khi khởi chạy ứng dụng, bạn có thể truy cập tài liệu API thông qua Swagger UI tại: http://localhost:3000/api

## Tính năng chính
- Quản lý người dùng và phân quyền
- Quản lý dự án và phân công
- Quản lý nhiệm vụ và theo dõi tiến độ
- Quản lý phòng ban và nhóm
- Chat và trao đổi thông tin