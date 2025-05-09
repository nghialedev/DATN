# Tài liệu yêu cầu đối với Frontend - Hệ thống quản lý dự án (Agile Project Management)

## 1. Tổng quan

Tài liệu này mô tả các yêu cầu chi tiết đối với phần frontend của hệ thống quản lý dự án Agile, sử dụng ReactJS và ReactDash Template. Frontend cần xây dựng dựa trên backend NestJS đã phát triển, đảm bảo tương thích với tất cả API và cấu trúc dữ liệu hiện có.

### Công nghệ sử dụng

- ReactJS (Phiên bản mới nhất)
- ReactDash Template (làm nền tảng giao diện)
- Redux/Redux Toolkit (quản lý state)
- Axios (gọi API)
- Socket.io-client (cho tính năng chat realtime)
- React Router (điều hướng)
- Formik & Yup (xử lý form và validation)
- React Query (quản lý data và caching)
- JWT (xác thực)


## 2. Cấu hình kết nối với Backend

### 2.1. Cấu hình API


### 2.2. Cấu hình Socket.io


## 3. Các trang và chức năng chính

### 3.1. Hệ thống xác thực (Authentication)

#### 3.1.1. Đăng nhập

**API liên quan:**
- `POST /user/login` - Body: `{ email, password }`

**Yêu cầu giao diện:**
- Form đăng nhập với các trường: email, password
- Validate email theo định dạng, password không để trống
- Hiển thị thông báo lỗi khi đăng nhập thất bại
- Lưu token JWT vào localStorage sau khi đăng nhập thành công
- Chuyển hướng đến Dashboard sau khi đăng nhập

**Mô tả chi tiết:**
- Sử dụng Formik và Yup để xử lý form và validation
- Thêm animation loading khi đang submit form
- Thiết kế giao diện đẹp, chuyên nghiệp với logo công ty và background phù hợp

#### 3.1.2. Đăng ký

**API liên quan:**
- `POST /user` - Body: `{ department_id, username, email, password, gender, birth_date, profile, rate }`

**Yêu cầu giao diện:**
- Form đăng ký với đầy đủ các trường thông tin
- Validate tất cả các trường bắt buộc
- Hiển thị dropdown để chọn phòng ban (cần load danh sách phòng ban từ API)
- Upload ảnh đại diện (profile)
- Thông báo thành công và chuyển hướng đến trang đăng nhập sau khi đăng ký

**Mô tả chi tiết:**
- Chia form thành nhiều bước (step) để tăng trải nghiệm người dùng
- Hiển thị preview ảnh đại diện khi upload
- Thêm chức năng kiểm tra email đã tồn tại hay chưa

### 3.2. Dashboard

**Yêu cầu giao diện:**
- Hiển thị tổng quan về các dự án đang tham gia
- Thống kê số lượng task theo trạng thái (chưa bắt đầu, đang thực hiện, hoàn thành)
- Biểu đồ hiển thị tiến độ dự án
- Danh sách các task được gán gần đây
- Widget thông báo và tin nhắn mới

**Mô tả chi tiết:**
- Sử dụng các component từ ReactDash Template: Card, Chart, Alert
- Tạo dashboard có khả năng responsive trên các thiết bị
- Thêm khả năng tuỳ chỉnh hiển thị các widget theo ý muốn người dùng
- Biểu đồ sử dụng thư viện Chart.js hoặc Recharts để hiển thị dữ liệu

### 3.3. Quản lý người dùng

**API liên quan:**
- `GET /user` - Lấy danh sách người dùng
- `GET /user/:id` - Lấy thông tin chi tiết người dùng
- `PATCH /user/:id` - Cập nhật thông tin người dùng
- `DELETE /user/:id` - Xóa người dùng

**Yêu cầu giao diện:**
- Bảng danh sách người dùng với các thông tin: username, email, phòng ban, vai trò
- Trang chi tiết thông tin người dùng
- Form chỉnh sửa thông tin người dùng
- Modal xác nhận xóa người dùng

**Mô tả chi tiết:**
- Bảng dữ liệu cần có khả năng phân trang, tìm kiếm, lọc
- Phân quyền hiển thị: chỉ Manager mới có quyền xóa người dùng
- Hiển thị avatar người dùng trong danh sách
- Thêm khả năng export danh sách người dùng sang Excel/CSV

### 3.4. Quản lý dự án

**API liên quan:**
- `POST /project` - Tạo dự án mới (Manager)
- `GET /project` - Lấy danh sách dự án
- `GET /project/:id` - Lấy thông tin chi tiết dự án
- `PATCH /project/:id` - Cập nhật thông tin dự án (Manager)
- `DELETE /project/:id` - Xóa dự án (Manager)

**Yêu cầu giao diện:**
- Bảng danh sách dự án với các thông tin: tên, ngày bắt đầu, ngày kết thúc, khách hàng
- Trang chi tiết dự án hiển thị: thông tin cơ bản, danh sách thành viên, các user story, các nhiệm vụ
- Form tạo và chỉnh sửa dự án
- Biểu đồ Gantt hiển thị tiến độ dự án
- Thẻ trạng thái dự án (đang thực hiện, hoàn thành, trễ hạn)

**Mô tả chi tiết:**
- Sử dụng React Gantt Chart để hiển thị tiến độ dự án
- Thêm chức năng lọc dự án theo trạng thái, thời gian
- Hiển thị percent hoàn thành của dự án dựa trên số lượng task đã hoàn thành
- Chức năng mời thành viên tham gia dự án (tích hợp với API project_user)

### 3.5. Quản lý User Story

**API liên quan:**
- `POST /stories` - Tạo user story mới
- `GET /stories` - Lấy danh sách user story
- `GET /stories/:id` - Lấy thông tin chi tiết user story
- `PATCH /stories/:id` - Cập nhật user story
- `DELETE /stories/:id` - Xóa user story

**Yêu cầu giao diện:**
- Bảng danh sách user story với các thông tin: tiêu đề, mô tả, story point, độ ưu tiên
- Form tạo và chỉnh sửa user story
- Hiển thị danh sách các task thuộc user story

**Mô tả chi tiết:**
- Tích hợp với trang chi tiết dự án
- Thêm chức năng kéo thả (drag & drop) để tổ chức lại thứ tự các user story
- Hiển thị tiến độ hoàn thành của mỗi user story dựa trên các task

### 3.6. Quản lý nhiệm vụ (Task)

**API liên quan:**
- `POST /tasks` - Tạo task mới
- `GET /tasks` - Lấy danh sách task
- `GET /tasks/:id` - Lấy thông tin chi tiết task
- `PATCH /tasks/:id` - Cập nhật task
- `DELETE /tasks/:id` - Xóa task (Manager)

**API User-Task liên quan:**
- `POST /user-tasks` - Gán task cho người dùng
- `GET /user-tasks` - Lấy danh sách user task
- `PATCH /user-tasks/:id` - Cập nhật trạng thái task
- `DELETE /user-tasks/:id` - Xóa user task

**API Project Task Status liên quan:**
- `POST /project-task-status` - Tạo trạng thái task mới
- `GET /project-task-status` - Lấy danh sách trạng thái task
- `PATCH /project-task-status/:id` - Cập nhật trạng thái
- `DELETE /project-task-status/:id` - Xóa trạng thái

**Yêu cầu giao diện:**
- Bảng Kanban hiển thị các task theo trạng thái
- Form tạo và chỉnh sửa task
- Chi tiết task hiển thị: tiêu đề, mô tả, người được gán, story point, độ ưu tiên, giờ làm việc, trạng thái, bình luận
- Chức năng kéo thả task giữa các trạng thái
- Hiển thị thời gian còn lại và tiến độ của task

**Mô tả chi tiết:**
- Sử dụng thư viện react-beautiful-dnd để làm Kanban board
- Thêm chức năng lọc task theo người được gán, độ ưu tiên, trạng thái
- Hiển thị biểu đồ burndown cho sprint
- Tích hợp chức năng báo cáo thời gian làm việc thực tế

### 3.7. Quản lý phòng ban

**API liên quan:**
- `POST /departments` - Tạo phòng ban mới
- `GET /departments` - Lấy danh sách phòng ban
- `GET /departments/:id` - Lấy thông tin chi tiết phòng ban
- `PATCH /departments/:id` - Cập nhật phòng ban
- `DELETE /departments/:id` - Xóa phòng ban

**Yêu cầu giao diện:**
- Bảng danh sách phòng ban
- Form tạo và chỉnh sửa phòng ban
- Hiển thị danh sách thành viên trong phòng ban
- Biểu đồ hiển thị số lượng nhân viên theo phòng ban

**Mô tả chi tiết:**
- Chỉ người dùng có vai trò Manager mới có quyền tạo, sửa, xóa phòng ban
- Thêm chức năng tìm kiếm và lọc phòng ban
- Hiển thị số lượng dự án mà phòng ban đang tham gia

### 3.8. Gán thành viên vào dự án

**API liên quan:**
- `POST /project-user` - Thêm người dùng vào dự án
- `GET /project-user?project_id=:id` - Lấy danh sách người dùng trong dự án
- `DELETE /project-user/:id` - Xóa người dùng khỏi dự án

**Yêu cầu giao diện:**
- Form thêm người dùng vào dự án
- Bảng danh sách người dùng trong dự án
- Chức năng xóa người dùng khỏi dự án

**Mô tả chi tiết:**
- Tích hợp với trang chi tiết dự án
- Hiển thị vai trò của người dùng trong dự án
- Tìm kiếm người dùng theo tên, email, phòng ban

### 3.9. Hệ thống đánh giá

**API liên quan:**
- `POST /rate` - Tạo đánh giá mới
- `GET /rate` - Lấy danh sách đánh giá (Manager)
- `GET /rate/rate` - Lấy đánh giá của người dùng
- `PATCH /rate/:id` - Cập nhật đánh giá
- `DELETE /rate/:id` - Xóa đánh giá (Manager)

**Yêu cầu giao diện:**
- Form đánh giá người dùng
- Hiển thị đánh giá trung bình của người dùng
- Biểu đồ hiển thị đánh giá theo thời gian

**Mô tả chi tiết:**
- Sử dụng component Rating với sao để đánh giá
- Giới hạn đánh giá từ 1-5 sao
- Thêm trường comment cho đánh giá
- Chỉ Manager mới có quyền xem tất cả đánh giá

### 3.10. Chức năng chat và tin nhắn

**API và WebSocket liên quan:**
- WebSocket Gateway - Kết nối chat realtime
- `POST /message` - Tạo tin nhắn mới
- `GET /message` - Lấy danh sách tin nhắn
- `GET /message/:id` - Lấy chi tiết tin nhắn
- `PATCH /message/:id` - Cập nhật tin nhắn (đánh dấu đã đọc)
- `DELETE /message/:id` - Xóa tin nhắn

**Yêu cầu giao diện:**
- Giao diện chat với danh sách người dùng/cuộc trò chuyện
- Khung chat hiển thị tin nhắn theo thời gian
- Form gửi tin nhắn với hỗ trợ emoji
- Thông báo khi có tin nhắn mới
- Hiển thị trạng thái đã đọc/chưa đọc

**Mô tả chi tiết:**
- Sử dụng Socket.io-client để kết nối với ChatGateway
- Lưu lịch sử chat vào localStorage hoặc IndexedDB để tối ưu hiệu suất
- Phân loại tin nhắn theo dự án hoặc cá nhân
- Thêm chức năng tìm kiếm tin nhắn

## 4. Các yêu cầu phi chức năng

### 4.1. Responsive Design

Giao diện cần hoạt động tốt trên các thiết bị sau:
- Desktop (1920x1080 và lớn hơn)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

### 4.2. Performance

- Tối ưu kích thước bundle với code splitting
- Sử dụng React.lazy và Suspense để lazy load các component
- Tối ưu hóa render với React.memo, useMemo và useCallback
- Sử dụng React Query để cache API requests

### 4.3. Accessibility

- Đảm bảo các tiêu chuẩn WCAG 2.1 level AA
- Hỗ trợ keyboard navigation
- Sử dụng semantic HTML
- Tương thích với screen reader

### 4.4. Internationalization

- Hỗ trợ đa ngôn ngữ (ít nhất Tiếng Việt và Tiếng Anh)
- Sử dụng react-i18next để quản lý ngôn ngữ
- Lưu ngôn ngữ ưa thích của người dùng trong localStorage

### 4.5. Theme

- Hỗ trợ Light mode và Dark mode
- Sử dụng CSS variables để quản lý theme
- Tự động phát hiện theme ưa thích của hệ thống

## 5. Hướng dẫn triển khai

### 5.1. Cài đặt và chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm start

# Build ứng dụng cho production
npm run build
```

### 5.2. Cấu hình Môi trường

Tạo file `.env` tại thư mục gốc:

```
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000
```

### 5.3. Triển khai lên server

- Cấu hình CI/CD với GitHub Actions hoặc GitLab CI
- Deploy lên Netlify, Vercel hoặc AWS S3 + CloudFront

## 6. Ước tính thời gian phát triển

- Thiết lập dự án và cấu hình: 2 ngày
- Xây dựng cơ sở (layouts, routing, authentication): 3 ngày
- Phát triển các tính năng chính: 15 ngày
- Testing và debugging: 5 ngày
- Tối ưu hóa và finishing touches: 3 ngày

Tổng thời gian ước tính: 28 ngày (khoảng 5-6 tuần)

## 7. Kết luận

Frontend sẽ được xây dựng với ReactJS và ReactDash Template, tập trung vào UX/UI chuyên nghiệp và hiệu suất cao. Các chức năng sẽ được phát triển để tương thích hoàn toàn với backend NestJS hiện có, tận dụng tối đa các API đã được cung cấp. Giao diện sẽ đảm bảo responsive, thân thiện với người dùng và có tính mở rộng cao.
