/**
 * Module quản lý công việc (Tasks Management)
 * Tương tác với API: http://localhost:3000/tasks
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

// API Helper function để các module khác có thể truy cập dữ liệu nhiệm vụ
window.taskAPI = {
  // 5.2. Lấy danh sách nhiệm vụ (GET /tasks)
  getAllTasks: function(callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    // Hiển thị thông báo đang tải
    const tableBody = document.getElementById('taskTableBody');
    if (tableBody) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';
    }
    
    fetch('http://localhost:3000/tasks', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for tasks:', result);
        
        // Kiểm tra cấu trúc response - có thể là pagination hoặc mảng trực tiếp
        let tasksArray = null;
        
        if (result && result.tasks && Array.isArray(result.tasks)) {
          // Đây là cấu trúc pagination với mảng tasks bên trong
          console.log('Nhận được dữ liệu dạng phân trang');
          tasksArray = result.tasks;
        } else if (Array.isArray(result)) {
          // Đây là mảng trực tiếp
          console.log('Nhận được dữ liệu dạng mảng');
          tasksArray = result;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          console.log('Nhận được dữ liệu dạng API cũ');
          tasksArray = result.data;
        } else {
          console.error('Không thể lấy danh sách nhiệm vụ:', result.message || 'Dữ liệu không đúng định dạng');
          tasksArray = null;
        }
        
        callback(tasksArray);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API nhiệm vụ:', error);
        callback(null);
      });
  },
  
  // 5.3. Lấy thông tin chi tiết nhiệm vụ (GET /tasks/{id})
  getTaskById: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/tasks/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Task detail response:', result);
        
        // Kiểm tra cấu trúc response - có thể là task trực tiếp hoặc có wrapper
        if (result && result.id) {
          // Đây là task trực tiếp
          callback(result);
        } else if (result && result.task) {
          // Đây là task trong wrapper
          callback(result.task);
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          callback(result.data);
        } else {
          console.error('Không thể lấy thông tin nhiệm vụ:', result.message || 'Dữ liệu không đúng định dạng');
          callback(null);
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API nhiệm vụ:', error);
        callback(null);
      });
  },
  
  // 5.1. Tạo nhiệm vụ mới (POST /tasks)
  createTask: function(taskData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(taskData),
      redirect: 'follow'
    };
    
    fetch('http://localhost:3000/tasks', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả tạo nhiệm vụ:', result);
        
        // Kiểm tra cấu trúc response
        if (result && result.id) {
          // Đây là task trực tiếp
          callback(result, null);
        } else if (result && result.task && result.task.id) {
          // Đây là task trong wrapper
          callback(result.task, null);
        } else if (result.statusCode === 200 || result.statusCode === 201) {
          // Cấu trúc API cũ
          callback(result.data, null);
        } else {
          callback(null, result.message || 'Không thể tạo nhiệm vụ mới');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API tạo nhiệm vụ:', error);
        callback(null, 'Lỗi kết nối đến máy chủ');
      });
  },
  
  // 5.4. Cập nhật thông tin nhiệm vụ (PATCH /tasks/{id})
  updateTask: function(id, taskData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(taskData),
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/tasks/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả cập nhật nhiệm vụ:', result);
        
        // Kiểm tra cấu trúc response
        if (result && result.id) {
          // Đây là task trực tiếp
          callback(result, null);
        } else if (result && result.task && result.task.id) {
          // Đây là task trong wrapper
          callback(result.task, null);
        } else if (result.statusCode === 200) {
          // Cấu trúc API cũ
          callback(result.data, null);
        } else {
          callback(null, result.message || 'Không thể cập nhật nhiệm vụ');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API cập nhật nhiệm vụ:', error);
        callback(null, 'Lỗi kết nối đến máy chủ');
      });
  },
  
  // Xóa nhiệm vụ (DELETE /tasks/{id}) - nếu cần
  deleteTask: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'DELETE',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/tasks/${id}`, requestOptions)
      .then(response => {
        if (response.ok && response.status === 204) {
          // Xóa thành công và không có nội dung trả về
          console.log('Xóa nhiệm vụ thành công (status 204)');
          callback(true, null);
          return null;
        }
        return response.json();
      })
      .then(result => {
        if (result === null) return; // Đã xử lý ở trên
        
        console.log('Kết quả xóa nhiệm vụ:', result);
        
        // Kiểm tra nhiều cấu trúc response có thể
        if (result === true || (result && result.success === true)) {
          callback(true, null);
        } else if (result.statusCode === 200) {
          callback(true, null);
        } else {
          callback(false, result.message || 'Không thể xóa nhiệm vụ');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API xóa nhiệm vụ:', error);
        callback(false, 'Lỗi kết nối đến máy chủ');
      });
  }
};

// Các biến global
let tasksData = [];

// Định dạng ngày tháng
function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Chuyển đổi độ ưu tiên sang tiếng Việt
function getPriorityInVietnamese(priority) {
  switch(priority) {
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return 'Không xác định';
  }
}

// Tải danh sách nhiệm vụ
function loadTasks() {
  window.taskAPI.getAllTasks(function(tasks) {
    if (tasks) {
      tasksData = tasks;
      displayTasks(tasks);
    } else {
      document.getElementById('taskTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Không thể tải dữ liệu. Vui lòng thử lại sau.</td></tr>`;
    }
  });
}

// Hiển thị danh sách nhiệm vụ trong bảng
function displayTasks(tasks) {
  const tableBody = document.getElementById('taskTableBody');
  if (!tableBody) {
    console.error('Không tìm thấy phần tử taskTableBody');
    return;
  }
  
  // Xóa dữ liệu cũ
  tableBody.innerHTML = '';
  
  // Xử lý trường hợp tasks là đối tượng phân trang thay vì mảng
  let tasksArray = tasks;
  
  // Nếu tasks là đối tượng có thuộc tính tasks là mảng
  if (tasks && !Array.isArray(tasks) && tasks.tasks && Array.isArray(tasks.tasks)) {
    console.log('Phát hiện đối tượng phân trang, sử dụng mảng tasks bên trong');
    tasksArray = tasks.tasks;
  }
  
  // Kiểm tra nếu không có nhiệm vụ nào
  if (!tasksArray || tasksArray.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">Không có nhiệm vụ nào</td></tr>`;
    return;
  }
  
  // Đảm bảo tasks là một mảng
  if (!Array.isArray(tasksArray)) {
    console.error('Dữ liệu nhiệm vụ không phải là mảng:', tasksArray);
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Dữ liệu không đúng định dạng</td></tr>`;
    return;
  }
  
  // Hiển thị dữ liệu nhiệm vụ
  tasksArray.forEach((task, index) => {
    // Tạo phần tử tr
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
        <button class="btn btn-info btn-sm view-task" data-id="${task.id}">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm edit-task" data-id="${task.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    
    // Thêm vào tableBody
    tableBody.appendChild(row);
  });
  
  // Thêm event listener cho các nút
  attachTaskButtonListeners();
}

// Tạo Modal xem chi tiết nhiệm vụ
function createViewTaskModal(task) {
  // Kiểm tra nếu modal đã tồn tại thì xóa đi
  const existingModal = document.getElementById(`viewTaskModal-${task.id}`);
  if (existingModal) {
    existingModal.remove();
  }
  
  // Tạo modal mới
  const modalHTML = `
    <div class="modal fade" id="viewTaskModal-${task.id}" tabindex="-1" aria-labelledby="viewTaskModalLabel-${task.id}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewTaskModalLabel-${task.id}">Chi tiết nhiệm vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <h6>Tiêu đề:</h6>
              <p>${task.title || 'Không có tiêu đề'}</p>
            </div>
            <div class="mb-3">
              <h6>Mô tả:</h6>
              <p>${task.description || 'Không có mô tả'}</p>
            </div>
            <div class="mb-3">
              <h6>Story Point:</h6>
              <p>${task.story_point || 0}</p>
            </div>
            <div class="mb-3">
              <h6>Giờ làm việc:</h6>
              <p>${task.working_hours || 0} giờ</p>
            </div>
            <div class="mb-3">
              <h6>Độ ưu tiên:</h6>
              <p>${getPriorityInVietnamese(task.priority)}</p>
            </div>
            <div class="mb-3">
              <h6>Thời gian tạo:</h6>
              <p>${formatDateTime(task.createdAt)}</p>
            </div>
            <div class="mb-3">
              <h6>Cập nhật lần cuối:</h6>
              <p>${formatDateTime(task.updatedAt)}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Thêm modal vào DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Hiển thị modal
  const modal = new bootstrap.Modal(document.getElementById(`viewTaskModal-${task.id}`));
  modal.show();
}

// Modal chỉnh sửa nhiệm vụ
function createEditTaskModal(task) {
  // Kiểm tra nếu modal đã tồn tại thì xóa đi
  const existingModal = document.getElementById(`editTaskModal-${task.id}`);
  if (existingModal) {
    existingModal.remove();
  }
  
  // Tạo modal mới
  const modalHTML = `
    <div class="modal fade" id="editTaskModal-${task.id}" tabindex="-1" aria-labelledby="editTaskModalLabel-${task.id}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTaskModalLabel-${task.id}">Chỉnh sửa nhiệm vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="editTaskForm-${task.id}">
              <div class="mb-3">
                <label for="title-${task.id}" class="form-label">Tiêu đề</label>
                <input type="text" class="form-control" id="title-${task.id}" value="${task.title || ''}" required>
              </div>
              <div class="mb-3">
                <label for="description-${task.id}" class="form-label">Mô tả</label>
                <textarea class="form-control" id="description-${task.id}" rows="3">${task.description || ''}</textarea>
              </div>
              <div class="mb-3">
                <label for="storyPoint-${task.id}" class="form-label">Story Point</label>
                <input type="number" class="form-control" id="storyPoint-${task.id}" value="${task.story_point || 0}" min="0">
              </div>
              <div class="mb-3">
                <label for="workingHours-${task.id}" class="form-label">Giờ làm việc</label>
                <input type="number" class="form-control" id="workingHours-${task.id}" value="${task.working_hours || 0}" min="0" step="0.5">
              </div>
              <div class="mb-3">
                <label for="priority-${task.id}" class="form-label">Độ ưu tiên</label>
                <select class="form-select" id="priority-${task.id}">
                  <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Cao</option>
                  <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Trung bình</option>
                  <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Thấp</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" id="saveEditTask-${task.id}">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Thêm modal vào DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Thêm event listener cho nút lưu
  document.getElementById(`saveEditTask-${task.id}`).addEventListener('click', function() {
    saveEditTask(task.id);
  });
  
  // Hiển thị modal
  const modal = new bootstrap.Modal(document.getElementById(`editTaskModal-${task.id}`));
  modal.show();
}

// Lưu thay đổi khi chỉnh sửa nhiệm vụ
function saveEditTask(taskId) {
  // Lấy dữ liệu từ form
  const title = document.getElementById(`title-${taskId}`).value;
  const description = document.getElementById(`description-${taskId}`).value;
  const storyPoint = document.getElementById(`storyPoint-${taskId}`).value;
  const workingHours = document.getElementById(`workingHours-${taskId}`).value;
  const priority = document.getElementById(`priority-${taskId}`).value;
  
  // Kiểm tra dữ liệu
  if (!title) {
    alert('Vui lòng nhập tiêu đề nhiệm vụ');
    return;
  }
  
  // Tạo đối tượng dữ liệu
  const taskData = {
    title: title,
    description: description,
    story_point: parseInt(storyPoint),
    working_hours: parseFloat(workingHours),
    priority: priority
  };
  
  // Gọi API cập nhật
  window.taskAPI.updateTask(taskId, taskData, function(data, error) {
    if (error) {
      alert(`Lỗi: ${error}`);
      return;
    }
    
    // Đóng modal
    const modalElement = document.getElementById(`editTaskModal-${taskId}`);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    // Thông báo thành công
    alert('Cập nhật nhiệm vụ thành công!');
    
    // Tải lại dữ liệu
    loadTasks();
  });
}

// Tạo nhiệm vụ mới
function createNewTask() {
  // Lấy dữ liệu từ form
  const title = document.getElementById('newTaskTitle').value;
  const description = document.getElementById('newTaskDescription').value;
  const storyPoint = document.getElementById('newTaskStoryPoint').value;
  const workingHours = document.getElementById('newTaskWorkingHours').value;
  const priority = document.getElementById('newTaskPriority').value;
  
  // Kiểm tra dữ liệu
  if (!title) {
    alert('Vui lòng nhập tiêu đề nhiệm vụ');
    return;
  }
  
  // Tạo đối tượng dữ liệu
  const taskData = {
    title: title,
    description: description,
    story_point: parseInt(storyPoint),
    working_hours: parseFloat(workingHours),
    priority: priority
  };
  
  // Gọi API tạo mới
  window.taskAPI.createTask(taskData, function(data, error) {
    if (error) {
      alert(`Lỗi: ${error}`);
      return;
    }
    
    // Đóng modal
    const modalElement = document.getElementById('addTaskModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    // Reset form
    document.getElementById('addTaskForm').reset();
    
    // Thông báo thành công
    alert('Tạo nhiệm vụ mới thành công!');
    
    // Tải lại dữ liệu
    loadTasks();
  });
}

// Xác nhận và xóa nhiệm vụ
function confirmAndDeleteTask(taskId) {
  if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
    window.taskAPI.deleteTask(taskId, function(success, error) {
      if (error) {
        alert(`Lỗi: ${error}`);
        return;
      }
      
      // Thông báo thành công
      alert('Xóa nhiệm vụ thành công!');
      
      // Tải lại dữ liệu
      loadTasks();
    });
  }
}

// Thêm event listener cho các nút trong bảng nhiệm vụ
function attachTaskButtonListeners() {
  // Event listener cho nút xem chi tiết
  document.querySelectorAll('.view-task').forEach(button => {
    button.addEventListener('click', function() {
      const taskId = this.getAttribute('data-id');
      window.taskAPI.getTaskById(taskId, function(task) {
        if (task) {
          createViewTaskModal(task);
        } else {
          alert('Không tìm thấy thông tin nhiệm vụ!');
        }
      });
    });
  });
  
  // Event listener cho nút chỉnh sửa
  document.querySelectorAll('.edit-task').forEach(button => {
    button.addEventListener('click', function() {
      const taskId = this.getAttribute('data-id');
      window.taskAPI.getTaskById(taskId, function(task) {
        if (task) {
          createEditTaskModal(task);
        } else {
          alert('Không tìm thấy thông tin nhiệm vụ!');
        }
      });
    });
  });
  
  // Event listener cho nút xóa
  document.querySelectorAll('.delete-task').forEach(button => {
    button.addEventListener('click', function() {
      const taskId = this.getAttribute('data-id');
      confirmAndDeleteTask(taskId);
    });
  });
}

// Lọc nhiệm vụ
function filterTasks() {
  const priorityFilter = document.getElementById('priorityFilter').value;
  
  // Nếu không có filter nào được chọn, hiển thị tất cả
  if (!priorityFilter) {
    displayTasks(tasksData);
    return;
  }
  
  // Lọc dữ liệu
  const filteredTasks = tasksData.filter(task => {
    // Lọc theo độ ưu tiên
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });
  
  // Hiển thị kết quả lọc
  displayTasks(filteredTasks);
}

// Tìm kiếm nhiệm vụ
function searchTasks() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  
  // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
  if (!searchTerm) {
    displayTasks(tasksData);
    return;
  }
  
  // Tìm kiếm trong dữ liệu
  const searchResults = tasksData.filter(task => {
    return (
      (task.title && task.title.toLowerCase().includes(searchTerm)) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    );
  });
  
  // Hiển thị kết quả tìm kiếm
  displayTasks(searchResults);
}

// Event listeners khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra token
  const token = getToken();
  if (!token) {
    window.location.href = '../pages-login/pages-login.html';
    return;
  }
  
  // Tải dữ liệu ban đầu
  loadTasks();
  
  // Thêm event listener cho nút tạo nhiệm vụ mới
  const addTaskButton = document.getElementById('addTaskButton');
  if (addTaskButton) {
    addTaskButton.addEventListener('click', createNewTask);
  }
  
  // Thêm event listener cho nút chỉnh sửa nhiệm vụ
  const editTaskButton = document.getElementById('editTaskButton');
  if (editTaskButton) {
    editTaskButton.addEventListener('click', function() {
      const taskId = document.getElementById('editTaskId').value;
      saveEditTask(taskId);
    });
  }
  
  // Thêm event listener cho bộ lọc
  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter) {
    priorityFilter.addEventListener('change', filterTasks);
  }
  
  // Thêm event listener cho tìm kiếm
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', searchTasks);
  }
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchTasks();
        e.preventDefault();
      }
    });
  }
});
