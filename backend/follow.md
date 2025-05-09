# Hướng dẫn Test API bằng Swagger

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Truy cập Swagger UI](#truy-cập-swagger-ui)
3. [Luồng test API hợp lý](#luồng-test-api-hợp-lý)
   - [Bước 1: Đăng ký và xác thực người dùng](#bước-1-đăng-ký-và-xác-thực-người-dùng)
   - [Bước 2: Quản lý Departments (Phòng ban)](#bước-2-quản-lý-departments-phòng-ban)
   - [Bước 3: Quản lý Projects (Dự án)](#bước-3-quản-lý-projects-dự-án)
   - [Bước 4: Quản lý User Story](#bước-4-quản-lý-user-story)
   - [Bước 5: Quản lý Tasks (Công việc)](#bước-5-quản-lý-tasks-công-việc)
   - [Bước 6: Quản lý User-Tasks (Phân công công việc)](#bước-6-quản-lý-user-tasks-phân-công-công-việc)
   - [Bước 7: Quản lý Bugs (Lỗi)](#bước-7-quản-lý-bugs-lỗi)
   - [Bước 8: Quản lý Messages (Tin nhắn)](#bước-8-quản-lý-messages-tin-nhắn)
4. [Tips khi test API](#tips-khi-test-api)

## Giới thiệu

Tài liệu này hướng dẫn cách test API của hệ thống quản lý dự án theo một luồng hợp lý và đầy đủ thông qua giao diện Swagger. Việc test theo luồng này giúp đảm bảo dữ liệu được tạo ra có liên kết với nhau và phản ánh đúng quy trình thực tế của hệ thống.

## Truy cập Swagger UI

1. Khởi động server bằng lệnh `npm run start:dev`
2. Mở trình duyệt và truy cập địa chỉ: `http://localhost:3000/api` (mặc định là port 3000, thay đổi nếu cần)
3. Giao diện Swagger UI sẽ hiển thị tất cả các endpoints có sẵn trong API

## Luồng test API hợp lý

### Bước 1: Đăng ký và xác thực người dùng

#### 1.1. Đăng ký người dùng
- Sử dụng endpoint `/auth/register` với phương thức POST
- Cung cấp thông tin cần thiết:
  ```json
  {
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com",
    "gender": "male",
    "birth_date": "1990-01-01",
    "role": "manager"
  }
  ```
- Lưu lại `id` của người dùng từ kết quả trả về

#### 1.2. Đăng nhập
- Sử dụng endpoint `/auth/login` với phương thức POST
- Sử dụng thông tin đăng nhập:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- Lưu lại `accessToken` từ kết quả trả về
- Sao chép token này và nhấn vào nút "Authorize" ở đầu trang Swagger UI
- Dán token vào trường "Value" theo định dạng: `Bearer [your_token]`
- Nhấn "Authorize" để sử dụng token cho các request tiếp theo

### Bước 2: Quản lý Departments (Phòng ban)

#### 2.1. Tạo Department
- Sử dụng endpoint `/departments` với phương thức POST
- Tạo các department:
  ```json
  {
    "department": "Engineering"
  }
  ```
- Tạo thêm các phòng ban khác: "Design", "QA", "Marketing"
- Lưu lại `id` của các department

### Bước 3: Quản lý Projects (Dự án)

#### 3.1. Tạo Project
- Sử dụng endpoint `/project` với phương thức POST
- Tạo một dự án mới:
  ```json
  {
    "name": "Project Management System",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "client_id": 1
  }
  ```
- Lưu lại `id` của project

#### 3.2. Gán Department vào Project
- Sử dụng endpoint `/project-departments` với phương thức POST
- Gán phòng ban Engineering vào project:
  ```json
  {
    "project_id": 1,
    "department_id": 1
  }
  ```
- Gán thêm các phòng ban khác nếu cần

#### 3.3. Tạo Project Task Status
- Sử dụng endpoint `/project-task-status` với phương thức POST
- Tạo các trạng thái:
  ```json
  {
    "project_id": 1,
    "status": "To Do"
  }
  ```
- Tạo thêm các trạng thái: "In Progress", "Testing", "Done"
- Lưu lại `id` của các trạng thái

#### 3.4. Thêm User vào Project
- Sử dụng endpoint `/project-user` với phương thức POST
  ```json
  {
    "project_id": 1,
    "user_id": 1
  }
  ```

### Bước 4: Quản lý User Story

#### 4.1. Tạo User Story
- Sử dụng endpoint `/story` với phương thức POST
- Tạo user story:
  ```json
  {
    "title": "User Authentication",
    "description": "As a user, I want to be able to log in to the system",
    "story_point": 5,
    "priority": "high"
  }
  ```
- Tạo thêm các user story khác
- Lưu lại `id` của các story

### Bước 5: Quản lý Tasks (Công việc)

#### 5.1. Tạo Task
- Sử dụng endpoint `/tasks` với phương thức POST
- Tạo task:
  ```json
  {
    "department_id": 1,
    "userStory_id": 1,
    "story_point": 3,
    "working_hours": 8,
    "priority": "high",
    "description": "Implement login API endpoint",
    "title": "Login API",
    "comment": "Use JWT for authentication"
  }
  ```
- Tạo thêm các task khác
- Lưu lại `id` của các task

### Bước 6: Quản lý User-Tasks (Phân công công việc)

#### 6.1. Phân công Task cho User
- Sử dụng endpoint `/user-tasks` với phương thức POST
- Gán task cho user:
  ```json
  {
    "user_id": 1,
    "task_id": 1,
    "project_task_status_id": 1,
    "start_date": "2023-01-10",
    "end_date": "2023-01-15",
    "actual_working_time": 8
  }
  ```

### Bước 7: Quản lý Bugs (Lỗi)

#### 7.1. Tạo Bug
- Sử dụng endpoint `/user-bugs` với phương thức POST
- Tạo bug:
  ```json
  {
    "userTask_id": 1,
    "project_task_status_id": 1,
    "story_point": 2,
    "working_hours": 4,
    "priority": 1,
    "title": "Authentication fails with special characters",
    "comment": "Need to fix input validation",
    "description": "When using special characters in the username, the login fails"
  }
  ```

### Bước 8: Quản lý Messages (Tin nhắn)

#### 8.1. Gửi tin nhắn
- Sử dụng endpoint `/message` với phương thức POST
- Gửi tin nhắn:
  ```json
  {
    "sender_id": 1,
    "receiver_id": 1,
    "project_id": 1,
    "message": "Cần hoàn thành task login API trước ngày mai"
  }
  ```

## Tips khi test API

1. **Lưu trữ ID**: Luôn lưu lại ID của các đối tượng sau khi tạo để sử dụng cho các request tiếp theo.

2. **Kiểm tra Response Code**: Đảm bảo các request trả về status code 200 hoặc 201.

3. **Kiểm tra GET endpoint**: Sau khi thực hiện POST, hãy sử dụng GET để kiểm tra dữ liệu đã được tạo đúng chưa.

4. **Xử lý lỗi**: Nếu gặp lỗi 400 hoặc 500, kiểm tra response body để xem thông báo lỗi chi tiết.

5. **Authorization**: Nếu token hết hạn, thực hiện lại bước đăng nhập để lấy token mới.

6. **Lưu ý về khóa ngoại**: Khi tạo đối tượng có tham chiếu đến đối tượng khác, đảm bảo đối tượng tham chiếu đã tồn tại trong hệ thống.

7. **Thứ tự test**: Nên test theo thứ tự như được liệt kê trong tài liệu này để tránh lỗi về khóa ngoại. 