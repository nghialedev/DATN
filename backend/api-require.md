# Tài liệu API - Hệ thống quản lý dự án Agile

## Giới thiệu

Tài liệu này mô tả chi tiết các API endpoints cung cấp bởi backend, bao gồm thông tin về requests, responses và các yêu cầu đặc biệt để tích hợp với frontend ReactJS.

### Cấu trúc response chung

Tất cả các API đều trả về response với cấu trúc thống nhất:

```json
{
  "statusCode": number,    // Mã trạng thái HTTP (200, 201, 400, 404, v.v.)
  "message": string,       // Thông báo từ server
  "data": any,             // Dữ liệu trả về (nếu thành công)
  "status": boolean        // Trạng thái thành công/thất bại (tùy chọn)
}
```

### Xác thực và bảo mật

- Tất cả các endpoints (trừ đăng nhập, đăng ký) yêu cầu JWT token trong header Authorization
- Format header: `Authorization: Bearer {your_jwt_token}`

## Mục lục

1. [Authentication](#1-authentication)
2. [User Management](#2-user-management)
3. [Project Management](#3-project-management)
4. [Department Management](#4-department-management)
5. [Task Management](#5-task-management)
6. [User Story Management](#6-user-story-management)
7. [Project Task Status](#7-project-task-status)
8. [Project User Assignment](#8-project-user-assignment)
9. [Rate System](#9-rate-system)
10. [Message & Chat](#10-message-chat)
11. [User Tasks](#11-user-tasks)

## 1. Authentication

### 1.1. Đăng nhập

**Endpoint:** `POST /user/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "123456"
}
```

**Yêu cầu đặc biệt:**
- Email phải là email hợp lệ
- Password không được để trống, nên có độ dài tối thiểu 6 ký tự

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Created Successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "John Doe",
      "email": "john.doe@example.com",
      "gender": "male",
      "birth_date": "1995-01-01",
      "is_active": true,
      "profile": "image.png",
      "rate": 5,
      "role": "developer",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Email not found" | "Wrong password"
}
```

### 1.2. Đăng ký

**Endpoint:** `POST /user`

**Request Body:**
```json
{
  "department_id": 1,
  "username": "John Doe",
  "email": "john.doe@example.com",
  "password": "123456",
  "gender": "male",
  "birth_date": "1995-01-01",
  "profile": "image.png",
  "rate": 5
}
```

**Yêu cầu đặc biệt:**
- Email phải là email hợp lệ và unique trong hệ thống
- Username không được để trống
- Password không được để trống, nên có độ dài tối thiểu 6 ký tự
- Gender phải là "male" hoặc "female"
- Birth_date phải là ngày hợp lệ theo định dạng YYYY-MM-DD
- Profile là đường dẫn đến ảnh đại diện (tùy chọn)
- Rate là số nguyên từ 1-5 (tùy chọn)

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Tạo người dùng thành công",
  "data": {
    "newUser": {
      "id": 1,
      "username": "John Doe",
      "email": "john.doe@example.com",
      "gender": "male",
      "birth_date": "1995-01-01",
      "is_active": true,
      "profile": "image.png",
      "rate": 5,
      "role": "developer",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Email đã tồn tại, vui lòng sử dụng email khác"
}
```

## 2. User Management

### 2.1. Lấy danh sách người dùng

**Endpoint:** `GET /user`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách người dùng thành công",
  "data": [
    {
      "id": 1,
      "username": "John Doe",
      "email": "john.doe@example.com",
      "gender": "male",
      "birth_date": "1995-01-01",
      "is_active": true,
      "profile": "image.png",
      "rate": 5,
      "role": "developer",
      "department_id": {
        "id": 1,
        "department": "Tec-department"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // ... Danh sách người dùng khác
  ]
}
```

**Response lỗi (500):**
```json
{
  "statusCode": 500,
  "message": "Không thể lấy danh sách người dùng: {error_message}"
}
```

### 2.2. Lấy thông tin người dùng

**Endpoint:** `GET /user/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "id": 1,
    "username": "John Doe",
    "email": "john.doe@example.com",
    "gender": "male",
    "birth_date": "1995-01-01",
    "is_active": true,
    "profile": "image.png",
    "rate": 5,
    "role": "developer",
    "department_id": {
      "id": 1,
      "department": "Tec-department"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy người dùng với ID {id}"
}
```

### 2.3. Cập nhật thông tin người dùng

**Endpoint:** `PATCH /user/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "username": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123",
  "gender": "male",
  "birth_date": "1995-05-05",
  "profile": "new-image.png",
  "rate": 4,
  "department_id": 2
}
```

**Yêu cầu đặc biệt:**
- Tất cả các trường đều là tùy chọn, chỉ cập nhật các trường được gửi
- Email phải là email hợp lệ và unique trong hệ thống
- Password sẽ được hash trước khi lưu vào database
- Gender phải là "male" hoặc "female"
- Birth_date phải là ngày hợp lệ theo định dạng YYYY-MM-DD
- Rate phải là số nguyên từ 1-5

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Cập nhật thông tin người dùng thành công",
  "data": {
    "id": 1,
    "username": "John Updated",
    "email": "john.updated@example.com",
    "gender": "male",
    "birth_date": "1995-05-05",
    "is_active": true,
    "profile": "new-image.png",
    "rate": 4,
    "role": "developer",
    "department_id": {
      "id": 2,
      "department": "HR-department"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy người dùng với ID {id}"
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Email đã tồn tại trong hệ thống"
}
```

### 2.4. Xóa người dùng

**Endpoint:** `DELETE /user/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Xóa người dùng thành công",
  "data": {
    "id": 1
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy người dùng với ID {id}"
}
```

## 3. Project Management

### 3.1. Tạo dự án mới

**Endpoint:** `POST /project`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền tạo dự án
- Ngày bắt đầu và kết thúc phải là ngày hợp lệ
- Ngày kết thúc phải sau ngày bắt đầu

**Request Body:**
```json
{
  "name": "Project1",
  "start_date": "2024-01-30",
  "end_date": "2024-03-30",
  "client_id": 3
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Created Successfully",
  "data": {
    "id": 1,
    "name": "Project1",
    "start_date": "2024-01-30",
    "end_date": "2024-03-30",
    "client_id": 3,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Requires manager role"
}
```

### 3.2. Lấy danh sách dự án

**Endpoint:** `GET /project`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Created Successfully",
  "data": [
    {
      "id": 1,
      "name": "Project1",
      "start_date": "2024-01-30",
      "end_date": "2024-03-30",
      "client_id": 3,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách dự án khác
  ]
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "No Projects found"
}
```

### 3.3. Lấy thông tin chi tiết dự án

**Endpoint:** `GET /project/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Người dùng phải là thành viên của dự án để có thể xem chi tiết

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "Project1",
    "start_date": "2024-01-30",
    "end_date": "2024-03-30",
    "client_id": 3,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project with Id {id} not found"
}
```

**Response lỗi (406):**
```json
{
  "statusCode": 406,
  "message": "Resource not authorized"
}
```

### 3.4. Cập nhật thông tin dự án

**Endpoint:** `PATCH /project/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền cập nhật dự án

**Request Body:**
```json
{
  "name": "Project1 Updated",
  "start_date": "2024-02-01",
  "end_date": "2024-04-01",
  "client_id": 4
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Project with id {id} updated successfully",
  "data": {
    "generatedMaps": [],
    "raw": [],
    "affected": 1
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project with Id {id} not found"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Requires manager role"
}
```

### 3.5. Xóa dự án

**Endpoint:** `DELETE /project/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền xóa dự án

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Project with Id {id} deleted successfully"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project with Id {id} not found"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Requires manager role"
}
```

## 4. Department Management

### 4.1. Tạo phòng ban mới

**Endpoint:** `POST /departments`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "department": "Tec-department"
}
```

**Yêu cầu đặc biệt:**
- Tên phòng ban không được để trống

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Department successfully created",
  "data": {
    "id": 1,
    "department": "Tec-department",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

### 4.2. Lấy danh sách phòng ban

**Endpoint:** `GET /departments`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all departments",
  "data": [
    {
      "id": 1,
      "department": "Tec-department",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách phòng ban khác
  ]
}
```

### 4.3. Lấy thông tin chi tiết phòng ban

**Endpoint:** `GET /departments/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the department",
  "data": {
    "id": 1,
    "department": "Tec-department",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Department not found"
}
```

### 4.4. Cập nhật thông tin phòng ban

**Endpoint:** `PATCH /departments/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "department": "HR-department"
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Department successfully updated",
  "data": {
    "id": 1,
    "department": "HR-department",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Department not found"
}
```

### 4.5. Xóa phòng ban

**Endpoint:** `DELETE /departments/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Department successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Department not found"
}
```

## 5. Task Management

### 5.1. Tạo nhiệm vụ mới

**Endpoint:** `POST /tasks`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "department_id": 1,
  "userStory_id": 1,
  "story_point": 3,
  "working_hours": 2,
  "priority": "low",
  "description": "description data",
  "title": "task 1",
  "comment": "comment 1"
}
```

**Yêu cầu đặc biệt:**
- department_id và userStory_id phải là ID hợp lệ trong hệ thống
- title không được để trống, tối đa 100 ký tự
- priority phải là một trong các giá trị: "low", "medium", "high"
- story_point và working_hours phải là số dương

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "department_id": {
      "id": 1,
      "department": "Tec-department"
    },
    "userStory_id": {
      "id": 1,
      "title": "User Story 1"
    },
    "story_point": 3,
    "working_hours": 2,
    "priority": "low",
    "description": "description data",
    "title": "task 1",
    "comment": "comment 1",
    "created_at": "2024-01-15T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

### 5.2. Lấy danh sách nhiệm vụ

**Endpoint:** `GET /tasks`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "All Tasks fetched successfully",
  "data": [
    {
      "id": 1,
      "department_id": {
        "id": 1,
        "department": "Tec-department"
      },
      "userStory_id": {
        "id": 1,
        "title": "User Story 1"
      },
      "story_point": 3,
      "working_hours": 2,
      "priority": "low",
      "description": "description data",
      "title": "task 1",
      "comment": "comment 1",
      "created_at": "2024-01-15T00:00:00.000Z",
      "updated_at": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách nhiệm vụ khác
  ]
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Error message"
}
```

### 5.3. Lấy thông tin chi tiết nhiệm vụ

**Endpoint:** `GET /tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Task fetched successfully by {id}",
  "data": {
    "id": 1,
    "department_id": {
      "id": 1,
      "department": "Tec-department"
    },
    "userStory_id": {
      "id": 1,
      "title": "User Story 1"
    },
    "story_point": 3,
    "working_hours": 2,
    "priority": "low",
    "description": "description data",
    "title": "task 1",
    "comment": "comment 1",
    "created_at": "2024-01-15T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Error message"
}
```

### 5.4. Cập nhật thông tin nhiệm vụ

**Endpoint:** `PATCH /tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "story_point": 5,
  "working_hours": 4,
  "priority": "high",
  "description": "updated description",
  "title": "updated task title",
  "comment": "updated comment"
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Task updated successfully by {id}",
  "data": {
    "generatedMaps": [],
    "raw": [],
    "affected": 1
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Error message"
}
```

### 5.5. Xóa nhiệm vụ

**Endpoint:** `DELETE /tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền xóa nhiệm vụ

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Task deleted successfully by {id}",
  "data": {
    "generatedMaps": [],
    "raw": [],
    "affected": 1
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Error message"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

## 6. User Story Management

### 6.1. Tạo User Story mới

**Endpoint:** `POST /stories`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "title": "title ex",
  "description": "user story description",
  "story_point": 3,
  "priority": "low"
}
```

**Yêu cầu đặc biệt:**
- Title và description không được để trống
- Story_point phải là số nguyên dương
- Priority phải là một trong các giá trị: "low", "medium", "high"

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Story successfully created",
  "data": {
    "id": 1,
    "title": "title ex",
    "description": "user story description",
    "story_point": 3,
    "priority": "low",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

### 6.2. Lấy danh sách User Story

**Endpoint:** `GET /stories`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all stories",
  "data": [
    {
      "id": 1,
      "title": "title ex",
      "description": "user story description",
      "story_point": 3,
      "priority": "low",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách User Story khác
  ]
}
```

### 6.3. Lấy thông tin chi tiết User Story

**Endpoint:** `GET /stories/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the story",
  "data": {
    "id": 1,
    "title": "title ex",
    "description": "user story description",
    "story_point": 3,
    "priority": "low",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Story not found"
}
```

### 6.4. Cập nhật User Story

**Endpoint:** `PATCH /stories/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "title": "updated title",
  "description": "updated description",
  "story_point": 5,
  "priority": "medium"
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Story successfully updated",
  "data": {
    "id": 1,
    "title": "updated title",
    "description": "updated description",
    "story_point": 5,
    "priority": "medium",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Story not found"
}
```

### 6.5. Xóa User Story

**Endpoint:** `DELETE /stories/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Story successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Story not found"
}
```

## 7. Project Task Status

### 7.1. Tạo trạng thái nhiệm vụ mới

**Endpoint:** `POST /project-task-status`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền tạo trạng thái nhiệm vụ

**Request Body:**
```json
{
  "project_id": 1,
  "status": "Pending"
}
```

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Project task status successfully created",
  "data": {
    "id": 1,
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "status": "Pending",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

### 7.2. Lấy danh sách trạng thái nhiệm vụ

**Endpoint:** `GET /project-task-status`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all project task statuses",
  "data": [
    {
      "id": 1,
      "project_id": {
        "id": 1,
        "name": "Project1"
      },
      "status": "Pending",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách trạng thái khác
  ]
}
```

### 7.3. Lấy thông tin chi tiết trạng thái nhiệm vụ

**Endpoint:** `GET /project-task-status/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the project task status",
  "data": {
    "id": 1,
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "status": "Pending",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project task status not found"
}
```

### 7.4. Cập nhật trạng thái nhiệm vụ

**Endpoint:** `PATCH /project-task-status/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền cập nhật trạng thái nhiệm vụ

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Project task status successfully updated",
  "data": {
    "id": 1,
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "status": "In Progress",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project task status not found"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

### 7.5. Xóa trạng thái nhiệm vụ

**Endpoint:** `DELETE /project-task-status/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền xóa trạng thái nhiệm vụ

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Project task status successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project task status not found"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

## 8. Project User Assignment

### 8.1. Thêm người dùng vào dự án

**Endpoint:** `POST /project-user`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "project_id": 1,
  "user_id": 1
}
```

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "User successfully added to project",
  "data": {
    "id": 1,
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

### 8.2. Lấy danh sách người dùng trong dự án

**Endpoint:** `GET /project-user?project_id={project_id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Phải cung cấp project_id trong query params

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all users in project",
  "data": [
    {
      "id": 1,
      "project_id": {
        "id": 1,
        "name": "Project1"
      },
      "user_id": {
        "id": 1,
        "username": "John Doe",
        "email": "john.doe@example.com",
        "role": "developer"
      },
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách người dùng khác trong dự án
  ]
}
```

**Response lỗi (400):**
```json
{
  "message": "Project ID is required"
}
```

### 8.3. Lấy thông tin chi tiết phân công

**Endpoint:** `GET /project-user/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the project user",
  "data": {
    "id": 1,
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "user_id": {
      "id": 1,
      "username": "John Doe",
      "email": "john.doe@example.com",
      "role": "developer"
    },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project user not found"
}
```

### 8.4. Xóa người dùng khỏi dự án

**Endpoint:** `DELETE /project-user/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "User successfully removed from project"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Project user not found"
}
```

## 9. Rate System

### 9.1. Tạo đánh giá mới

**Endpoint:** `POST /rate`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "rate": 5,
  "month": "Jan",
  "year": "1990",
  "user_id": 1,
  "rated_by_user_id": 2
}
```

**Yêu cầu đặc biệt:**
- Rate phải là số nguyên từ 1-5
- Month và year phải là ngày hợp lệ
- user_id là người được đánh giá
- rated_by_user_id là người đánh giá

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Rate successfully created",
  "data": {
    "id": 1,
    "rate": 5,
    "month": "Jan",
    "year": "1990",
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "rated_by_user_id": {
      "id": 2,
      "username": "Jane Smith"
    },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

### 9.2. Lấy danh sách đánh giá (Manager only)

**Endpoint:** `GET /rate`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền truy cập

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all rates",
  "data": [
    {
      "id": 1,
      "rate": 5,
      "month": "Jan",
      "year": "1990",
      "user_id": {
        "id": 1,
        "username": "John Doe"
      },
      "rated_by_user_id": {
        "id": 2,
        "username": "Jane Smith"
      },
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách đánh giá khác
  ]
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

### 9.3. Lấy đánh giá của người dùng

**Endpoint:** `GET /rate/rate`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return user's rate",
  "data": {
    "average": 4.5,
    "rates": [
      {
        "id": 1,
        "rate": 5,
        "month": "Jan",
        "year": "1990",
        "rated_by_user_id": {
          "id": 2,
          "username": "Jane Smith"
        },
        "createdAt": "2024-01-15T00:00:00.000Z"
      },
      // ... Danh sách đánh giá của người dùng
    ]
  }
}
```

### 9.4. Cập nhật đánh giá

**Endpoint:** `PATCH /rate/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "rate": 4
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Rate successfully updated",
  "data": {
    "id": 1,
    "rate": 4,
    "month": "Jan",
    "year": "1990",
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "rated_by_user_id": {
      "id": 2,
      "username": "Jane Smith"
    },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Rate not found"
}
```

### 9.5. Xóa đánh giá (Manager only)

**Endpoint:** `DELETE /rate/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Yêu cầu đặc biệt:**
- Chỉ người dùng có role "manager" mới có quyền xóa đánh giá

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Rate successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Rate not found"
}
```

**Response lỗi (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - requires manager role"
}
```

## 10. Message & Chat

### 10.1. WebSocket

#### 10.1.1. Kết nối WebSocket

**Endpoint:** `/socket.io`

**Yêu cầu đặc biệt:**
- Client cần kết nối sử dụng thư viện socket.io-client
- Có thể gửi token JWT trong handshake để xác thực

#### 10.1.2. Gửi tin nhắn

**Event:** `sendMessage`

**Data:**
```json
{
  "sender": "user_id_or_name",
  "text": "Hello, how are you?"
}
```

#### 10.1.3. Nhận tin nhắn

**Event:** `message`

**Data:**
```json
{
  "sender": "user_id_or_name",
  "text": "Hello, how are you?"
}
```

### 10.2. Tạo tin nhắn mới

**Endpoint:** `POST /message`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "sender_id": 1,
  "receiver_id": 2,
  "project_id": 1,
  "message": "Hello, how are you?"
}
```

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "Message successfully created",
  "data": {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "project_id": 1,
    "message": "Hello, how are you?",
    "seen": false,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### 10.3. Lấy danh sách tin nhắn

**Endpoint:** `GET /message`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all messages",
  "data": [
    {
      "id": 1,
      "sender_id": {
        "id": 1,
        "username": "John Doe"
      },
      "receiver_id": {
        "id": 2,
        "username": "Jane Smith"
      },
      "project_id": {
        "id": 1,
        "name": "Project1"
      },
      "message": "Hello, how are you?",
      "seen": false,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách tin nhắn khác
  ]
}
```

### 10.4. Lấy chi tiết tin nhắn

**Endpoint:** `GET /message/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the message",
  "data": {
    "id": 1,
    "sender_id": {
      "id": 1,
      "username": "John Doe"
    },
    "receiver_id": {
      "id": 2,
      "username": "Jane Smith"
    },
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "message": "Hello, how are you?",
    "seen": false,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Message not found"
}
```

### 10.5. Cập nhật tin nhắn (đánh dấu đã đọc)

**Endpoint:** `PATCH /message/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "seen": true
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Message successfully updated",
  "data": {
    "id": 1,
    "sender_id": {
      "id": 1,
      "username": "John Doe"
    },
    "receiver_id": {
      "id": 2,
      "username": "Jane Smith"
    },
    "project_id": {
      "id": 1,
      "name": "Project1"
    },
    "message": "Hello, how are you?",
    "seen": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Message not found"
}
```

### 10.6. Xóa tin nhắn

**Endpoint:** `DELETE /message/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Message successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "Message not found"
}
```

## 11. User Tasks

### 11.1. Gán nhiệm vụ cho người dùng

**Endpoint:** `POST /user-tasks`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "user_id": 1,
  "task_id": 2,
  "project_task_status_id": 1,
  "start_date": 1709836800,
  "end_date": 1709923200,
  "actual_working_time": 8
}
```

**Yêu cầu đặc biệt:**
- user_id, task_id và project_task_status_id phải là ID hợp lệ trong hệ thống
- start_date và end_date phải là timestamp hợp lệ, end_date phải lớn hơn start_date
- actual_working_time phải là số dương, đơn vị là giờ

**Response thành công (201):**
```json
{
  "statusCode": 201,
  "message": "User task successfully created",
  "data": {
    "id": 1,
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "task_id": {
      "id": 2,
      "title": "Task 2"
    },
    "project_task_status_id": {
      "id": 1,
      "status": "Pending"
    },
    "start_date": 1709836800,
    "end_date": 1709923200,
    "actual_working_time": 8,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (400):**
```json
{
  "statusCode": 400,
  "message": "Bad request"
}
```

### 11.2. Lấy danh sách nhiệm vụ của người dùng

**Endpoint:** `GET /user-tasks`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return all user tasks",
  "data": [
    {
      "id": 1,
      "user_id": {
        "id": 1,
        "username": "John Doe"
      },
      "task_id": {
        "id": 2,
        "title": "Task 2",
        "description": "Task description",
        "priority": "medium"
      },
      "project_task_status_id": {
        "id": 1,
        "status": "Pending"
      },
      "start_date": 1709836800,
      "end_date": 1709923200,
      "actual_working_time": 8,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    // ... Danh sách nhiệm vụ của người dùng khác
  ]
}
```

### 11.3. Lấy thông tin chi tiết nhiệm vụ của người dùng

**Endpoint:** `GET /user-tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "Return the user task",
  "data": {
    "id": 1,
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "task_id": {
      "id": 2,
      "title": "Task 2",
      "description": "Task description",
      "priority": "medium"
    },
    "project_task_status_id": {
      "id": 1,
      "status": "Pending"
    },
    "start_date": 1709836800,
    "end_date": 1709923200,
    "actual_working_time": 8,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "User task not found"
}
```

### 11.4. Cập nhật nhiệm vụ của người dùng

**Endpoint:** `PATCH /user-tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "project_task_status_id": 2,
  "actual_working_time": 10
}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "User task successfully updated",
  "data": {
    "id": 1,
    "user_id": {
      "id": 1,
      "username": "John Doe"
    },
    "task_id": {
      "id": 2,
      "title": "Task 2"
    },
    "project_task_status_id": {
      "id": 2,
      "status": "In Progress"
    },
    "start_date": 1709836800,
    "end_date": 1709923200,
    "actual_working_time": 10,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "User task not found"
}
```

### 11.5. Xóa nhiệm vụ của người dùng

**Endpoint:** `DELETE /user-tasks/{id}`

**Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200):**
```json
{
  "statusCode": 200,
  "message": "User task successfully deleted"
}
```

**Response lỗi (404):**
```json
{
  "statusCode": 404,
  "message": "User task not found"
}
``` 