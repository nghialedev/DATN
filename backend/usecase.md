# Tài liệu Use Case - Hệ thống quản lý dự án Agile

## Giới thiệu

Tài liệu này mô tả chi tiết các trường hợp sử dụng (use cases) của hệ thống quản lý dự án Agile, bao gồm các chức năng chính và luồng xử lý của từng chức năng.

## 1. Quản lý xác thực (Authentication)

### 1.1. Đăng nhập

**Mô tả:** Cho phép người dùng đăng nhập vào hệ thống bằng email và mật khẩu.

**Tác nhân:** Tất cả người dùng

**Điều kiện tiên quyết:** Người dùng đã đăng ký tài khoản trong hệ thống.

**Luồng chính:**
1. Người dùng nhập email và mật khẩu
2. Hệ thống kiểm tra tính hợp lệ của email và mật khẩu
3. Nếu thông tin hợp lệ, hệ thống tạo JWT token và trả về thông tin người dùng
4. Người dùng được chuyển đến trang chính của hệ thống

**Luồng thay thế:**
- Nếu email không tồn tại: Hệ thống thông báo "Email not found"
- Nếu mật khẩu không đúng: Hệ thống thông báo "Wrong password"

**API liên quan:** `POST /user/login`

### 1.2. Đăng ký

**Mô tả:** Cho phép người dùng tạo tài khoản mới trong hệ thống.

**Tác nhân:** Người dùng chưa có tài khoản

**Điều kiện tiên quyết:** Không có

**Luồng chính:**
1. Người dùng nhập thông tin cá nhân (tên, email, mật khẩu, giới tính, ngày sinh, phòng ban, v.v.)
2. Hệ thống kiểm tra tính hợp lệ của thông tin
3. Nếu thông tin hợp lệ, hệ thống tạo tài khoản mới và JWT token
4. Người dùng được chuyển đến trang chính của hệ thống

**Luồng thay thế:**
- Nếu email đã tồn tại: Hệ thống thông báo "Email đã tồn tại, vui lòng sử dụng email khác"

**API liên quan:** `POST /user`

## 2. Quản lý người dùng (User Management)

### 2.1. Xem danh sách người dùng

**Mô tả:** Cho phép xem danh sách tất cả người dùng trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách người dùng
2. Hệ thống hiển thị danh sách tất cả người dùng với thông tin cơ bản

**API liên quan:** `GET /user`

### 2.2. Xem thông tin chi tiết người dùng

**Mô tả:** Cho phép xem thông tin chi tiết của một người dùng cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một người dùng từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của người dùng đó

**Luồng thay thế:**
- Nếu không tìm thấy người dùng: Hệ thống thông báo "Không tìm thấy người dùng với ID {id}"

**API liên quan:** `GET /user/{id}`

### 2.3. Cập nhật thông tin người dùng

**Mô tả:** Cho phép cập nhật thông tin cá nhân của người dùng.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang thông tin cá nhân
2. Người dùng chỉnh sửa thông tin cần thay đổi
3. Hệ thống kiểm tra tính hợp lệ của thông tin
4. Nếu thông tin hợp lệ, hệ thống cập nhật thông tin người dùng

**Luồng thay thế:**
- Nếu email đã tồn tại: Hệ thống thông báo "Email đã tồn tại trong hệ thống"
- Nếu không tìm thấy người dùng: Hệ thống thông báo "Không tìm thấy người dùng với ID {id}"

**API liên quan:** `PATCH /user/{id}`

### 2.4. Xóa người dùng

**Mô tả:** Cho phép xóa một người dùng khỏi hệ thống.

**Tác nhân:** Quản trị viên

**Điều kiện tiên quyết:** Người dùng đã đăng nhập với quyền quản trị viên.

**Luồng chính:**
1. Quản trị viên chọn xóa một người dùng từ danh sách
2. Hệ thống hiển thị xác nhận xóa
3. Quản trị viên xác nhận xóa
4. Hệ thống xóa người dùng khỏi hệ thống

**Luồng thay thế:**
- Nếu không tìm thấy người dùng: Hệ thống thông báo "Không tìm thấy người dùng với ID {id}"

**API liên quan:** `DELETE /user/{id}`

## 3. Quản lý dự án (Project Management)

### 3.1. Tạo dự án mới

**Mô tả:** Cho phép tạo một dự án mới trong hệ thống.

**Tác nhân:** Người dùng có vai trò "manager"

**Điều kiện tiên quyết:** Người dùng đã đăng nhập với vai trò "manager".

**Luồng chính:**
1. Manager nhập thông tin dự án (tên, ngày bắt đầu, ngày kết thúc, client)
2. Hệ thống kiểm tra tính hợp lệ của thông tin
3. Nếu thông tin hợp lệ, hệ thống tạo dự án mới

**Luồng thay thế:**
- Nếu người dùng không có quyền manager: Hệ thống thông báo "Forbidden - Requires manager role"
- Nếu thông tin không hợp lệ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `POST /project`

### 3.2. Xem danh sách dự án

**Mô tả:** Cho phép xem danh sách tất cả các dự án trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách dự án
2. Hệ thống hiển thị danh sách tất cả các dự án với thông tin cơ bản

**Luồng thay thế:**
- Nếu không có dự án nào: Hệ thống thông báo "No Projects found"

**API liên quan:** `GET /project`

### 3.3. Xem thông tin chi tiết dự án

**Mô tả:** Cho phép xem thông tin chi tiết của một dự án cụ thể.

**Tác nhân:** Người dùng đã đăng nhập và là thành viên của dự án

**Điều kiện tiên quyết:** Người dùng đã đăng nhập và là thành viên của dự án.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một dự án từ danh sách
2. Hệ thống kiểm tra quyền truy cập
3. Nếu người dùng có quyền, hệ thống hiển thị thông tin chi tiết của dự án

**Luồng thay thế:**
- Nếu không tìm thấy dự án: Hệ thống thông báo "Project with Id {id} not found"
- Nếu người dùng không phải thành viên của dự án: Hệ thống thông báo "Resource not authorized"

**API liên quan:** `GET /project/{id}`

### 3.4. Cập nhật thông tin dự án

**Mô tả:** Cho phép cập nhật thông tin của một dự án.

**Tác nhân:** Người dùng có vai trò "manager"

**Điều kiện tiên quyết:** Người dùng đã đăng nhập với vai trò "manager".

**Luồng chính:**
1. Manager truy cập trang chi tiết dự án
2. Manager chỉnh sửa thông tin cần thay đổi
3. Hệ thống kiểm tra tính hợp lệ của thông tin
4. Nếu thông tin hợp lệ, hệ thống cập nhật thông tin dự án

**Luồng thay thế:**
- Nếu người dùng không có quyền manager: Hệ thống thông báo "Forbidden - Requires manager role"
- Nếu không tìm thấy dự án: Hệ thống thông báo "Project with Id {id} not found"

**API liên quan:** `PATCH /project/{id}`

### 3.5. Xóa dự án

**Mô tả:** Cho phép xóa một dự án khỏi hệ thống.

**Tác nhân:** Người dùng có vai trò "manager"

**Điều kiện tiên quyết:** Người dùng đã đăng nhập với vai trò "manager".

**Luồng chính:**
1. Manager chọn xóa một dự án từ danh sách
2. Hệ thống hiển thị xác nhận xóa
3. Manager xác nhận xóa
4. Hệ thống xóa dự án khỏi hệ thống

**Luồng thay thế:**
- Nếu người dùng không có quyền manager: Hệ thống thông báo "Forbidden - Requires manager role"
- Nếu không tìm thấy dự án: Hệ thống thông báo "Project with Id {id} not found"

**API liên quan:** `DELETE /project/{id}`

## 4. Quản lý phòng ban (Department Management)

### 4.1. Xem danh sách phòng ban

**Mô tả:** Cho phép xem danh sách tất cả các phòng ban trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách phòng ban
2. Hệ thống hiển thị danh sách tất cả các phòng ban

**API liên quan:** `GET /departments`

## 5. Quản lý nhiệm vụ (Task Management)

### 5.1. Tạo nhiệm vụ mới

**Mô tả:** Cho phép tạo một nhiệm vụ mới trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng nhập thông tin nhiệm vụ (tiêu đề, mô tả, story point, giờ làm việc, ưu tiên, v.v.)
2. Hệ thống kiểm tra tính hợp lệ của thông tin
3. Nếu thông tin hợp lệ, hệ thống tạo nhiệm vụ mới

**Luồng thay thế:**
- Nếu thông tin không hợp lệ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `POST /tasks`

### 5.2. Xem danh sách nhiệm vụ

**Mô tả:** Cho phép xem danh sách tất cả các nhiệm vụ trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách nhiệm vụ
2. Hệ thống hiển thị danh sách tất cả các nhiệm vụ với thông tin cơ bản

**Luồng thay thế:**
- Nếu không có nhiệm vụ nào: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `GET /tasks`

### 5.3. Xem thông tin chi tiết nhiệm vụ

**Mô tả:** Cho phép xem thông tin chi tiết của một nhiệm vụ cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một nhiệm vụ từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của nhiệm vụ đó

**Luồng thay thế:**
- Nếu không tìm thấy nhiệm vụ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `GET /tasks/{id}`

### 5.4. Cập nhật thông tin nhiệm vụ

**Mô tả:** Cho phép cập nhật thông tin của một nhiệm vụ.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang chi tiết nhiệm vụ
2. Người dùng chỉnh sửa thông tin cần thay đổi
3. Hệ thống kiểm tra tính hợp lệ của thông tin
4. Nếu thông tin hợp lệ, hệ thống cập nhật thông tin nhiệm vụ

**Luồng thay thế:**
- Nếu không tìm thấy nhiệm vụ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `PATCH /tasks/{id}`

## 6. Quản lý User Story

### 6.1. Tạo User Story mới

**Mô tả:** Cho phép tạo một User Story mới trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng nhập thông tin User Story (tiêu đề, mô tả, story point, ưu tiên)
2. Hệ thống kiểm tra tính hợp lệ của thông tin
3. Nếu thông tin hợp lệ, hệ thống tạo User Story mới

**Luồng thay thế:**
- Nếu thông tin không hợp lệ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `POST /stories`

### 6.2. Xem danh sách User Story

**Mô tả:** Cho phép xem danh sách tất cả các User Story trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách User Story
2. Hệ thống hiển thị danh sách tất cả các User Story với thông tin cơ bản

**API liên quan:** `GET /stories`

### 6.3. Xem thông tin chi tiết User Story

**Mô tả:** Cho phép xem thông tin chi tiết của một User Story cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một User Story từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của User Story đó

**Luồng thay thế:**
- Nếu không tìm thấy User Story: Hệ thống thông báo "Story not found"

**API liên quan:** `GET /stories/{id}`

### 6.4. Cập nhật thông tin User Story

**Mô tả:** Cho phép cập nhật thông tin của một User Story.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang chi tiết User Story
2. Người dùng chỉnh sửa thông tin cần thay đổi
3. Hệ thống kiểm tra tính hợp lệ của thông tin
4. Nếu thông tin hợp lệ, hệ thống cập nhật thông tin User Story

**Luồng thay thế:**
- Nếu không tìm thấy User Story: Hệ thống thông báo "Story not found"

**API liên quan:** `PATCH /stories/{id}`

## 7. Quản lý trạng thái nhiệm vụ dự án (Project Task Status)

### 7.1. Xem danh sách trạng thái nhiệm vụ

**Mô tả:** Cho phép xem danh sách tất cả các trạng thái nhiệm vụ trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách trạng thái nhiệm vụ
2. Hệ thống hiển thị danh sách tất cả các trạng thái nhiệm vụ

**API liên quan:** `GET /project-task-status`

### 7.2. Xem thông tin chi tiết trạng thái nhiệm vụ

**Mô tả:** Cho phép xem thông tin chi tiết của một trạng thái nhiệm vụ cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một trạng thái nhiệm vụ từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của trạng thái nhiệm vụ đó

**Luồng thay thế:**
- Nếu không tìm thấy trạng thái nhiệm vụ: Hệ thống thông báo "Project task status not found"

**API liên quan:** `GET /project-task-status/{id}`

## 8. Quản lý phân công người dùng vào dự án (Project User Assignment)

### 8.1. Thêm người dùng vào dự án

**Mô tả:** Cho phép thêm một người dùng vào một dự án.

**Tác nhân:** Người dùng có vai trò "manager"

**Điều kiện tiên quyết:** Người dùng đã đăng nhập với vai trò "manager".

**Luồng chính:**
1. Manager chọn một dự án và một người dùng
2. Hệ thống thêm người dùng vào dự án

**Luồng thay thế:**
- Nếu thông tin không hợp lệ: Hệ thống thông báo lỗi tương ứng

**API liên quan:** `POST /project-user`

### 8.2. Xem danh sách người dùng trong dự án

**Mô tả:** Cho phép xem danh sách tất cả người dùng trong một dự án cụ thể.

**Tác nhân:** Người dùng đã đăng nhập và là thành viên của dự án

**Điều kiện tiên quyết:** Người dùng đã đăng nhập và là thành viên của dự án.

**Luồng chính:**
1. Người dùng truy cập trang danh sách người dùng trong dự án
2. Hệ thống hiển thị danh sách tất cả người dùng trong dự án đó

**Luồng thay thế:**
- Nếu không cung cấp project_id: Hệ thống thông báo "Project ID is required"

**API liên quan:** `GET /project-user?project_id={project_id}`

### 8.3. Xem thông tin chi tiết phân công

**Mô tả:** Cho phép xem thông tin chi tiết của một phân công cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một phân công từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của phân công đó

**Luồng thay thế:**
- Nếu không tìm thấy phân công: Hệ thống thông báo "Project user not found"

**API liên quan:** `GET /project-user/{id}`

## 9. Hệ thống đánh giá (Rate System)

### 9.1. Đánh giá người dùng

**Mô tả:** Cho phép đánh giá một người dùng trong hệ thống.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn đánh giá một người dùng khác
2. Người dùng nhập điểm đánh giá (từ 1-5)
3. Hệ thống lưu đánh giá

**API liên quan:** Không có thông tin cụ thể trong tài liệu API

## 10. Tin nhắn & Trò chuyện (Message & Chat)

### 10.1. Tạo tin nhắn mới

**Mô tả:** Cho phép gửi tin nhắn đến một người dùng khác trong dự án.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn một người nhận và một dự án
2. Người dùng nhập nội dung tin nhắn
3. Hệ thống gửi tin nhắn đến người nhận

**API liên quan:** `POST /message`

### 10.2. Xem danh sách tin nhắn

**Mô tả:** Cho phép xem danh sách tất cả các tin nhắn.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách tin nhắn
2. Hệ thống hiển thị danh sách tất cả các tin nhắn

**API liên quan:** `GET /message`

### 10.3. Xem thông tin chi tiết tin nhắn

**Mô tả:** Cho phép xem thông tin chi tiết của một tin nhắn cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng chọn xem chi tiết một tin nhắn từ danh sách
2. Hệ thống hiển thị thông tin chi tiết của tin nhắn đó
   m,n
**Luồng thay thế:**
- Nếu không tìm thấy tin nhắn: Hệ thống thông báo "Message not found"

**API liên quan:** `GET /message/{id}`

## 11. Nhiệm vụ người dùng (User Tasks)

### 11.1. Xem danh sách nhiệm vụ của người dùng

**Mô tả:** Cho phép xem danh sách tất cả các nhiệm vụ của một người dùng cụ thể.

**Tác nhân:** Người dùng đã đăng nhập

**Điều kiện tiên quyết:** Người dùng đã đăng nhập vào hệ thống.

**Luồng chính:**
1. Người dùng truy cập trang danh sách nhiệm vụ cá nhân
2. Hệ thống hiển thị danh sách tất cả các nhiệm vụ của người dùng đó

**API liên quan:** Không có thông tin cụ thể trong tài liệu API