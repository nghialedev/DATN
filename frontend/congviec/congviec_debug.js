/**
 * File debug cho module quản lý công việc (Tasks Management)
 */

// Lấy token xác thực từ localStorage hoặc sessionStorage
function getToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

// Tạo headers chuẩn cho các request API
function createHeaders() {
  const token = getToken();
  if (!token) {
    window.location.href = '../pages-login/pages-login.html';
    return null;
  }
  
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');
  return headers;
}

// API Helper function cho module Task
window.taskAPI = {
  // Lấy danh sách nhiệm vụ
  getAllTasks: function(callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    // Hiển thị thông báo đang tải
    document.getElementById('taskTableBody').innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';
    
    fetch('http://localhost:3000/tasks', requestOptions)
      .then(response => {
        console.log('Raw API response status:', response.status);
        return response.json();
      })
      .then(result => {
        // Log toàn bộ response để kiểm tra
        console.log('API response for tasks (raw):', result);
        
        // Kiểm tra cấu trúc dữ liệu và trả về dữ liệu phù hợp
        let tasksArray = null;
        
        if (result && result.tasks && Array.isArray(result.tasks)) {
          // Cấu trúc phân trang: { tasks: [...], total: N, page: P, limit: L }
          console.log('Đã nhận được dữ liệu dạng phân trang với', result.tasks.length, 'nhiệm vụ');
          tasksArray = result.tasks;
        } else if (Array.isArray(result)) {
          // Mảng trực tiếp: [ {task1}, {task2}, ... ]
          console.log('Đã nhận được dữ liệu dạng mảng với', result.length, 'nhiệm vụ');
          tasksArray = result;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc wrapper: { statusCode: 200, data: [...], message: "..." }
          console.log('Đã nhận được dữ liệu dạng wrapper với statusCode', result.statusCode);
          tasksArray = result.data;
        } else {
          console.error('Không nhận dạng được cấu trúc dữ liệu:', result);
        }
        
        if (tasksArray && Array.isArray(tasksArray)) {
          callback(tasksArray);
        } else {
          console.error('Không thể trích xuất mảng nhiệm vụ từ dữ liệu');
          document.getElementById('taskTableBody').innerHTML = '<tr><td colspan="7" class="text-center text-danger">Không thể trích xuất dữ liệu nhiệm vụ</td></tr>';
          callback(null);
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API nhiệm vụ:', error);
        document.getElementById('taskTableBody').innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối đến máy chủ</td></tr>';
        callback(null);
      });
  }
};

// Hiển thị danh sách nhiệm vụ trong bảng
function displayTasks(tasks) {
  const tableBody = document.getElementById('taskTableBody');
  if (!tableBody) {
    console.error('Không tìm thấy phần tử taskTableBody');
    return;
  }
  
  // Kiểm tra nếu không có nhiệm vụ nào
  if (!tasks || tasks.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có nhiệm vụ nào</td></tr>';
    return;
  }
  
  // Log dữ liệu trước khi hiển thị
  console.log('Dữ liệu nhiệm vụ nhận được để hiển thị:', tasks);
  
  // Xóa dữ liệu cũ
  tableBody.innerHTML = '';
  
  // Hiển thị từng nhiệm vụ
  tasks.forEach((task, index) => {
    const row = document.createElement('tr');
    
    // Hiển thị độ ưu tiên với màu sắc tương ứng
    let priorityBadge = '';
    switch(task.priority) {
      case 'high':
        priorityBadge = '<span class="badge bg-danger">Cao</span>';
        break;
      case 'medium':
        priorityBadge = '<span class="badge bg-warning text-dark">Trung bình</span>';
        break;
      case 'low':
        priorityBadge = '<span class="badge bg-info">Thấp</span>';
        break;
      default:
        priorityBadge = '<span class="badge bg-secondary">Không xác định</span>';
    }
    
    // Định dạng nội dung
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${task.title || 'Không có tiêu đề'}</td>
      <td>${task.story_point || 0}</td>
      <td>${task.working_hours || 0} giờ</td>
      <td>${priorityBadge}</td>
      <td>${task.description || 'Không có mô tả'}</td>
      <td>
        <button class="btn btn-info btn-sm">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    
    // Thêm vào tableBody
    tableBody.appendChild(row);
  });
}

// Tải và hiển thị danh sách nhiệm vụ
function loadTasks() {
  console.log('Bắt đầu tải dữ liệu nhiệm vụ...');
  window.taskAPI.getAllTasks(function(tasks) {
    console.log('Callback được gọi với dữ liệu:', tasks);
    if (tasks) {
      displayTasks(tasks);
    } else {
      document.getElementById('taskTableBody').innerHTML = '<tr><td colspan="7" class="text-center text-danger">Không thể tải dữ liệu. Vui lòng thử lại sau.</td></tr>';
    }
  });
}

// Event listeners khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM đã tải xong, bắt đầu khởi tạo...');
  
  // Kiểm tra token
  const token = getToken();
  if (!token) {
    console.log('Không tìm thấy token, chuyển hướng đến trang đăng nhập');
    window.location.href = '../pages-login/pages-login.html';
    return;
  }
  
  console.log('Token hợp lệ, tải danh sách nhiệm vụ');
  // Tải dữ liệu ban đầu
  loadTasks();
});
