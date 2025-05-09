# Tài liệu Yêu cầu Sản phẩm (PRD) - Hệ thống Quản lý Dự án Agile

## 1. Tổng quan

### 1.1. Mục đích

Phát triển giao diện người dùng (Frontend) cho hệ thống quản lý dự án Agile, kết nối với backend NestJS đã hoàn thiện. Frontend sẽ được xây dựng dựa trên template ReactDash với ReactJS, cung cấp trải nghiệm người dùng hiện đại và trực quan.

### 1.2. Phạm vi

Phần frontend sẽ bao gồm tất cả các tính năng cần thiết để quản lý dự án theo phương pháp Agile:
- Quản lý người dùng và phân quyền
- Quản lý dự án và phân công
- Quản lý nhiệm vụ và theo dõi tiến độ
- Quản lý phòng ban và nhóm
- Chat và trao đổi thông tin

### 1.3. Công nghệ sử dụng

- **Frontend Framework:** ReactJS (phiên bản mới nhất)
- **UI Template:** ReactDash (đã có sẵn)
- **Quản lý state:** Redux/Redux Toolkit
- **HTTP Client:** Axios
- **Realtime Communication:** Socket.io-client
- **Form Processing:** Formik & Yup
- **Data Fetching:** React Query
- **Authentication:** JWT
- **Styling:** Tailwind CSS (từ ReactDash template)

## 2. Kết nối với Backend

### 2.1. Cấu hình API

- Base URL: `http://localhost:3000` hoặc server URL thực tế
- Tất cả các request phải có JWT token trong Authorization header (trừ đăng nhập, đăng ký)
- Format: `Authorization: Bearer {token}`
- Tạo service layer riêng cho mỗi module (UserService, ProjectService, etc)

### 2.2. Cấu hình Socket.io

- Kết nối đến: `http://localhost:3000` (cùng URL với API server)
- Xác thực WebSocket bằng JWT token
- Lắng nghe và xử lý các sự kiện từ server (message, notification)

## 3. Các trang và chức năng chính

### 3.1. Hệ thống xác thực

#### 3.1.1. Đăng nhập

- **UI Component:** Form đăng nhập responsive với logo và background phù hợp
- **Chức năng:**
  - Validation email và password
  - Thông báo lỗi tương ứng
  - Lưu token JWT vào localStorage
  - Chuyển hướng đến Dashboard
  - Loading state khi đang xử lý đăng nhập

#### 3.1.2. Đăng ký

- **UI Component:** Multi-step form đăng ký
- **Chức năng:**
  - Validation tất cả các trường thông tin
  - Upload ảnh đại diện
  - Kiểm tra email đã tồn tại
  - Chọn phòng ban từ dropdown
  - Preview ảnh đại diện

### 3.2. Dashboard

- **UI Components:**
  - Tổng quan dự án với biểu đồ
  - Thống kê task theo trạng thái
  - Biểu đồ tiến độ dự án
  - Danh sách task gần đây
  - Widget thông báo và tin nhắn
  
- **Chức năng:**
  - Hiển thị real-time data từ backend
  - Dashboard có khả năng responsive
  - Cho phép tùy chỉnh hiển thị widget
  - Filter và sort dữ liệu

### 3.3. Quản lý người dùng (Admin/Manager)

- **UI Components:**
  - Bảng danh sách người dùng với pagination
  - Trang chi tiết thông tin người dùng
  - Form chỉnh sửa thông tin
  - Modal xác nhận xóa

- **Chức năng:**
  - CRUD người dùng (tùy theo quyền)
  - Tìm kiếm, lọc, phân trang
  - Export danh sách sang Excel/CSV
  - Hiển thị avatar

### 3.4. Quản lý dự án

- **UI Components:**
  - Bảng danh sách dự án
  - Trang chi tiết dự án
  - Biểu đồ Gantt tiến độ
  - Form tạo/chỉnh sửa dự án

- **Chức năng:**
  - CRUD dự án (tùy theo quyền)
  - Hiển thị tiến độ và trạng thái
  - Quản lý thành viên dự án
  - Lọc dự án theo trạng thái, thời gian

### 3.5. Quản lý User Story

- **UI Components:**
  - Danh sách User Story
  - Form tạo/chỉnh sửa
  - Hiển thị các task liên quan

- **Chức năng:**
  - CRUD User Story
  - Drag & drop sắp xếp thứ tự ưu tiên
  - Hiển thị tiến độ hoàn thành
  - Filter theo ưu tiên, trạng thái

### 3.6. Quản lý nhiệm vụ (Task)

- **UI Components:**
  - Bảng Kanban theo trạng thái
  - Form tạo/chỉnh sửa task
  - Chi tiết task (modal hoặc trang)
  - Thời gian và tiến độ task

- **Chức năng:**
  - CRUD task
  - Drag & drop giữa các trạng thái
  - Filter theo người được gán, ưu tiên, trạng thái
  - Báo cáo thời gian làm việc
  - Biểu đồ burndown

### 3.7. Quản lý phòng ban

- **UI Components:**
  - Bảng danh sách phòng ban
  - Form tạo/chỉnh sửa
  - Danh sách thành viên
  - Biểu đồ thống kê

- **Chức năng:**
  - CRUD phòng ban (chỉ Manager)
  - Tìm kiếm, lọc phòng ban
  - Hiển thị số lượng dự án tham gia

### 3.8. Gán thành viên vào dự án

- **UI Components:**
  - Form thêm người dùng vào dự án
  - Bảng danh sách người dùng trong dự án
  - Nút xóa người dùng khỏi dự án

- **Chức năng:**
  - Thêm/xóa người dùng khỏi dự án
  - Tìm kiếm người dùng
  - Hiển thị vai trò

### 3.9. Hệ thống đánh giá

- **UI Components:**
  - Form đánh giá người dùng
  - Hiển thị đánh giá trung bình
  - Biểu đồ đánh giá theo thời gian

- **Chức năng:**
  - Đánh giá từ 1-5 sao
  - Thêm comment
  - Xem lịch sử đánh giá

### 3.10. Chức năng chat và tin nhắn

- **UI Components:**
  - Giao diện chat với danh sách người dùng
  - Khung chat hiển thị tin nhắn
  - Form gửi tin nhắn với emoji
  - Thông báo tin nhắn mới

- **Chức năng:**
  - Chat realtime bằng Socket.io
  - Lưu lịch sử chat
  - Hiển thị trạng thái đã đọc
  - Tìm kiếm tin nhắn

## 4. Yêu cầu phi chức năng

### 4.1. Responsive Design

- **Desktop:** 1920x1080 và lớn hơn
- **Laptop:** 1366x768
- **Tablet:** 768x1024
- **Mobile:** 375x667

### 4.2. Performance

- Code splitting cho tối ưu bundle size
- Lazy loading components với React.lazy và Suspense
- Tối ưu hóa render với React.memo, useMemo và useCallback
- Caching API requests với React Query

### 4.3. Accessibility

- Tuân thủ WCAG 2.1 level AA
- Hỗ trợ keyboard navigation
- Semantic HTML
- Tương thích với screen reader

### 4.4. Internationalization

- Hỗ trợ Tiếng Việt và Tiếng Anh
- Sử dụng react-i18next
- Lưu ngôn ngữ ưa thích trong localStorage

### 4.5. Theme

- Light mode và Dark mode
- CSS variables cho quản lý theme
- Tự động phát hiện theme ưa thích của hệ thống

## 5. Hướng dẫn triển khai

### 5.1. Cài đặt và chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Build ứng dụng cho production
npm run build
```

### 5.2. Cấu trúc thư mục

```
/src
  /assets        # Hình ảnh, fonts, etc.
  /components    # UI Components tái sử dụng
  /hooks         # Custom hooks
  /layouts       # Layout containers
  /pages         # Các trang ứng dụng
  /services      # API services
  /store         # Redux store
  /utils         # Helper functions
  /contexts      # React contexts
  App.jsx        # Root component
  main.jsx       # Entry point
```

### 5.3. Tận dụng ReactDash Template

- Sử dụng các components sẵn có từ ReactDash (Card, Chart, Table, etc.)
- Áp dụng theme và styling từ template
- Tích hợp biểu đồ và visualizations từ template

## 6. Trải nghiệm người dùng (UX)

### 6.1. Thiết kế tương tác

- Chuyển đổi trang mượt mà với animations
- Phản hồi ngay lập tức khi người dùng tương tác
- Loading states và skeletons khi fetching data
- Thông báo toast cho các actions

### 6.2. Tổ chức giao diện

- Navigation rõ ràng, dễ tiếp cận
- Bố cục nhất quán giữa các trang
- Sử dụng breadcrumbs để navigation
- Thiết kế hướng đến mục tiêu của người dùng

## 7. Kế hoạch phát triển

### 7.1. Ưu tiên phát triển

1. Xác thực và Dashboard
2. Quản lý dự án và nhiệm vụ
3. Quản lý user story và Kanban board
4. Chat và thông báo realtime
5. Báo cáo và biểu đồ

### 7.2. Timeline

- **Tuần 1:** Setup dự án, authentication, routing, layout
- **Tuần 2-3:** Dashboard, quản lý dự án và người dùng
- **Tuần 4-5:** Kanban board, user stories, tasks
- **Tuần 6:** Chat và realtime features
- **Tuần 7:** Testing, optimization và hoàn thiện

## 8. Testing và QA

### 8.1. Unit Testing

- Viết tests cho các components quan trọng
- Test các custom hooks
- Mock API calls

### 8.2. Integration Testing

- Test các luồng chính (đăng nhập, tạo dự án, v.v.)
- Kiểm tra tương tác giữa các components

### 8.3. Browser Testing

- Đảm bảo hoạt động trên các trình duyệt phổ biến
- Kiểm tra responsive trên các thiết bị

## 9. Triển khai và bảo trì

### 9.1. Triển khai

- CI/CD với GitHub Actions hoặc GitLab CI
- Deploy lên Netlify, Vercel hoặc AWS S3 + CloudFront

### 9.2. Monitoring

- Sử dụng Sentry.io hoặc LogRocket để theo dõi lỗi
- Google Analytics hoặc Matomo cho user analytics

## 10. Kết luận

Frontend hệ thống quản lý dự án sẽ được xây dựng với ReactJS và template ReactDash, tập trung vào UX/UI chuyên nghiệp và hiệu suất cao. Giao diện sẽ tuân thủ các chuẩn responsive, thân thiện với người dùng và dễ dàng mở rộng. Tận dụng các components có sẵn trong template, kết hợp với thiết kế riêng biệt cho hệ thống quản lý dự án Agile sẽ tạo ra một sản phẩm đẹp mắt và chức năng đầy đủ. 