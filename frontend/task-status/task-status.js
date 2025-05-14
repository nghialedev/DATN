/**
 * Module quản lý trạng thái nhiệm vụ (Task Status Management)
 * Tương tác với API: /project-task-status
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

// Hàm định dạng ngày giờ
function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// API Helper function cho module Task Status
const taskStatusAPI = {
  // 7.1. Lấy danh sách trạng thái nhiệm vụ (GET /project-task-status)
  getAllTaskStatuses: function(callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    // Hiển thị thông báo đang tải
    document.getElementById('statusTableBody').innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
    
    fetch('http://localhost:3000/project-task-status', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for task statuses:', result);
        
        // Xử lý dữ liệu trả về
        let statuses = [];
        
        if (Array.isArray(result)) {
          // Mảng trực tiếp
          statuses = result;
        } else if (result && result.data && Array.isArray(result.data)) {
          // Trong trường hợp API trả về { data: [...] }
          statuses = result.data;
        } else if (result && result.statuses && Array.isArray(result.statuses)) {
          // Trong trường hợp API trả về { statuses: [...] }
          statuses = result.statuses;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          statuses = Array.isArray(result.data) ? result.data : [result.data];
        } else {
          console.error('Không thể xác định cấu trúc dữ liệu từ API');
          document.getElementById('statusTableBody').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi cấu trúc dữ liệu</td></tr>';
          return;
        }
        
        if (callback) callback(statuses);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API lấy trạng thái:', error);
        document.getElementById('statusTableBody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối: ${error.message}</td></tr>`;
      });
  },
  
  // 7.2. Lấy thông tin chi tiết trạng thái nhiệm vụ (GET /project-task-status/{id})
  getTaskStatusById: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/project-task-status/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for task status details:', result);
        
        // Xử lý dữ liệu trả về
        let status = null;
        
        if (result && result.id) {
          // Đối tượng trạng thái trực tiếp
          status = result;
        } else if (result && result.data && result.data.id) {
          // Trong trường hợp API trả về { data: {...} }
          status = result.data;
        } else if (result && result.status && result.status.id) {
          // Trong trường hợp API trả về { status: {...} }
          status = result.status;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          status = result.data;
        } else {
          console.error('Không thể xác định cấu trúc dữ liệu chi tiết từ API');
          if (callback) callback(null);
          return;
        }
        
        if (callback) callback(status);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API lấy chi tiết trạng thái:', error);
        if (callback) callback(null);
      });
  },
  
  // Thêm trạng thái mới
  createTaskStatus: function(statusData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(statusData),
      redirect: 'follow'
    };
    
    fetch('http://localhost:3000/project-task-status', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for creating task status:', result);
        
        // Xử lý kết quả
        let success = false;
        let message = '';
        let data = null;
        
        if (result && (result.id || (result.data && result.data.id))) {
          success = true;
          data = result.id ? result : result.data;
          message = 'Thêm trạng thái thành công!';
        } else if (result && result.statusCode === 201) {
          success = true;
          data = result.data;
          message = result.message || 'Thêm trạng thái thành công!';
        } else {
          success = false;
          message = result.message || 'Không thể thêm trạng thái. Vui lòng thử lại.';
        }
        
        if (callback) callback(success, message, data);
      })
      .catch(error => {
        console.error('Lỗi khi tạo trạng thái mới:', error);
        if (callback) callback(false, 'Lỗi kết nối: ' + error.message, null);
      });
  },
  
  // Cập nhật trạng thái
  updateTaskStatus: function(id, statusData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(statusData),
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/project-task-status/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for updating task status:', result);
        
        // Xử lý kết quả
        let success = false;
        let message = '';
        let data = null;
        
        if (result && (result.id || (result.data && result.data.id))) {
          success = true;
          data = result.id ? result : result.data;
          message = 'Cập nhật trạng thái thành công!';
        } else if (result && result.statusCode === 200) {
          success = true;
          data = result.data;
          message = result.message || 'Cập nhật trạng thái thành công!';
        } else {
          success = false;
          message = result.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại.';
        }
        
        if (callback) callback(success, message, data);
      })
      .catch(error => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        if (callback) callback(false, 'Lỗi kết nối: ' + error.message, null);
      });
  },
  
  // Xóa trạng thái
  deleteTaskStatus: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'DELETE',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/project-task-status/${id}`, requestOptions)
      .then(response => {
        if (response.status === 204) return { success: true };
        return response.json();
      })
      .then(result => {
        console.log('API response for deleting task status:', result);
        
        // Xử lý kết quả
        let success = false;
        let message = '';
        
        if (result && result.success) {
          success = true;
          message = 'Xóa trạng thái thành công!';
        } else if (result && result.statusCode === 200) {
          success = true;
          message = result.message || 'Xóa trạng thái thành công!';
        } else {
          success = false;
          message = result.message || 'Không thể xóa trạng thái. Vui lòng thử lại.';
        }
        
        if (callback) callback(success, message);
      })
      .catch(error => {
        console.error('Lỗi khi xóa trạng thái:', error);
        if (callback) callback(false, 'Lỗi kết nối: ' + error.message);
      });
  }
};

// Hiển thị danh sách trạng thái
function displayTaskStatuses(statuses) {
  const tableBody = document.getElementById('statusTableBody');
  if (!tableBody) {
    console.error('Không tìm thấy phần tử statusTableBody');
    return;
  }
  
  // Xóa dữ liệu cũ
  tableBody.innerHTML = '';
  
  // Kiểm tra nếu không có dữ liệu
  if (!statuses || statuses.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Không có trạng thái nào</td></tr>';
    return;
  }
  
  // Hiển thị dữ liệu
  statuses.forEach((status, index) => {
    // Xử lý thông tin dự án
    let projectName = 'N/A';
    if (status.project) {
      projectName = status.project.name || `Dự án #${status.project.id}`;
    } else if (status.project_id) {
      projectName = `Dự án #${status.project_id}`;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>${status.name || 'Không có tên'}</td>
      <td>${projectName}</td>
      <td class="text-center">${formatDateTime(status.created_at || status.createdAt)}</td>
      <td class="text-center">${formatDateTime(status.updated_at || status.updatedAt)}</td>
      <td class="text-center">
        <button class="btn btn-primary btn-sm view-status" data-id="${status.id}" title="Xem chi tiết">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm edit-status" data-id="${status.id}" title="Sửa">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm delete-status" data-id="${status.id}" title="Xóa">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Thêm event listeners cho các nút
  attachButtonListeners();
}

// Thêm event listeners cho các nút trong bảng
function attachButtonListeners() {
  // Nút xem chi tiết
  document.querySelectorAll('.view-status').forEach(button => {
    button.addEventListener('click', function() {
      const statusId = this.getAttribute('data-id');
      viewTaskStatus(statusId);
    });
  });
  
  // Nút sửa
  document.querySelectorAll('.edit-status').forEach(button => {
    button.addEventListener('click', function() {
      const statusId = this.getAttribute('data-id');
      editTaskStatus(statusId);
    });
  });
  
  // Nút xóa
  document.querySelectorAll('.delete-status').forEach(button => {
    button.addEventListener('click', function() {
      const statusId = this.getAttribute('data-id');
      deleteTaskStatus(statusId);
    });
  });
}

// Hàm xem chi tiết trạng thái
function viewTaskStatus(statusId) {
  taskStatusAPI.getTaskStatusById(statusId, function(status) {
    if (!status) {
      alert('Không thể lấy thông tin trạng thái!');
      return;
    }
    
    // Hiển thị thông tin trong modal
    document.getElementById('viewStatusId').textContent = status.id;
    document.getElementById('viewStatusName').textContent = status.name || 'Không có tên';
    
    // Hiển thị thông tin dự án
    let projectName = 'N/A';
    if (status.project) {
      projectName = status.project.name || `Dự án #${status.project.id}`;
    } else if (status.project_id) {
      projectName = `Dự án #${status.project_id}`;
    }
    document.getElementById('viewStatusProject').textContent = projectName;
    
    // Hiển thị thông tin thời gian
    document.getElementById('viewStatusCreatedAt').textContent = formatDateTime(status.created_at || status.createdAt);
    document.getElementById('viewStatusUpdatedAt').textContent = formatDateTime(status.updated_at || status.updatedAt);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('viewStatusModal'));
    modal.show();
  });
}

// Hàm sửa trạng thái
function editTaskStatus(statusId) {
  taskStatusAPI.getTaskStatusById(statusId, function(status) {
    if (!status) {
      alert('Không thể lấy thông tin trạng thái!');
      return;
    }
    
    // Thiết lập giá trị cho form
    document.getElementById('editStatusId').value = status.id;
    document.getElementById('editStatusName').value = status.name || '';
    
    // Thiết lập giá trị project select
    const projectSelect = document.getElementById('editStatusProject');
    if (projectSelect) {
      const projectId = status.project ? status.project.id : status.project_id;
      if (projectId) {
        projectSelect.value = projectId;
      }
    }
    
    // Hiển thị modal chỉnh sửa
    const modal = new bootstrap.Modal(document.getElementById('editStatusModal'));
    modal.show();
  });
}

// Hàm xóa trạng thái
function deleteTaskStatus(statusId) {
  if (confirm('Bạn có chắc chắn muốn xóa trạng thái này?')) {
    taskStatusAPI.deleteTaskStatus(statusId, function(success, message) {
      alert(message);
      if (success) {
        // Tải lại danh sách
        loadTaskStatuses();
      }
    });
  }
}

// Xử lý form thêm trạng thái mới
document.getElementById('addStatusForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const statusName = document.getElementById('newStatusName').value;
  const projectId = document.getElementById('newStatusProject').value;
  
  if (!statusName) {
    alert('Vui lòng nhập tên trạng thái!');
    return;
  }
  
  const statusData = {
    name: statusName
  };
  
  if (projectId) {
    statusData.project_id = parseInt(projectId);
  }
  
  taskStatusAPI.createTaskStatus(statusData, function(success, message, data) {
    alert(message);
    if (success) {
      // Đóng modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addStatusModal'));
      modal.hide();
      
      // Reset form
      document.getElementById('addStatusForm').reset();
      
      // Tải lại danh sách
      loadTaskStatuses();
    }
  });
});

// Xử lý form chỉnh sửa trạng thái
document.getElementById('editStatusForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const statusId = document.getElementById('editStatusId').value;
  const statusName = document.getElementById('editStatusName').value;
  const projectId = document.getElementById('editStatusProject').value;
  
  if (!statusName) {
    alert('Vui lòng nhập tên trạng thái!');
    return;
  }
  
  const statusData = {
    name: statusName
  };
  
  if (projectId) {
    statusData.project_id = parseInt(projectId);
  }
  
  taskStatusAPI.updateTaskStatus(statusId, statusData, function(success, message, data) {
    alert(message);
    if (success) {
      // Đóng modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('editStatusModal'));
      modal.hide();
      
      // Tải lại danh sách
      loadTaskStatuses();
    }
  });
});

// Tải danh sách dự án cho các dropdown
function loadProjects() {
  const headers = createHeaders();
  if (!headers) return;
  
  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };
  
  fetch('http://localhost:3000/project', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('API response for projects:', result);
      
      // Xử lý dữ liệu trả về
      let projects = [];
      
      if (Array.isArray(result)) {
        projects = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        projects = result.data;
      } else if (result && result.projects && Array.isArray(result.projects)) {
        projects = result.projects;
      } else if (result && result.statusCode === 200 && result.data) {
        projects = Array.isArray(result.data) ? result.data : [result.data];
      } else {
        console.error('Không thể xác định cấu trúc dữ liệu dự án từ API');
        return;
      }
      
      // Thêm dự án vào các dropdown
      const dropdowns = [
        document.getElementById('projectFilter'),
        document.getElementById('newStatusProject'),
        document.getElementById('editStatusProject')
      ];
      
      dropdowns.forEach(dropdown => {
        if (dropdown) {
          // Giữ lại option đầu tiên (placeholder)
          const firstOption = dropdown.options[0];
          dropdown.innerHTML = '';
          dropdown.appendChild(firstOption);
          
          // Thêm các option dự án
          projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name || `Dự án #${project.id}`;
            dropdown.appendChild(option);
          });
        }
      });
    })
    .catch(error => {
      console.error('Lỗi khi tải danh sách dự án:', error);
    });
}

// Tải danh sách trạng thái
function loadTaskStatuses() {
  taskStatusAPI.getAllTaskStatuses(function(statuses) {
    if (statuses) {
      displayTaskStatuses(statuses);
    }
  });
}

// Xử lý sự kiện lọc theo dự án
document.getElementById('projectFilter')?.addEventListener('change', function() {
  const selectedProject = this.value;
  
  // Nếu chọn tất cả, tải lại toàn bộ danh sách
  if (selectedProject === 'all') {
    loadTaskStatuses();
    return;
  }
  
  // Tải danh sách theo dự án đã chọn
  const headers = createHeaders();
  if (!headers) return;
  
  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };
  
  // Hiển thị thông báo đang tải
  document.getElementById('statusTableBody').innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
  
  fetch(`http://localhost:3000/project-task-status?project_id=${selectedProject}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('API response for filtered task statuses:', result);
      
      // Xử lý dữ liệu trả về như hàm getAllTaskStatuses
      let statuses = [];
      
      if (Array.isArray(result)) {
        statuses = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        statuses = result.data;
      } else if (result && result.statuses && Array.isArray(result.statuses)) {
        statuses = result.statuses;
      } else if (result && result.statusCode === 200 && result.data) {
        statuses = Array.isArray(result.data) ? result.data : [result.data];
      } else {
        console.error('Không thể xác định cấu trúc dữ liệu từ API');
        document.getElementById('statusTableBody').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi cấu trúc dữ liệu</td></tr>';
        return;
      }
      
      displayTaskStatuses(statuses);
    })
    .catch(error => {
      console.error('Lỗi khi lọc trạng thái theo dự án:', error);
      document.getElementById('statusTableBody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối: ${error.message}</td></tr>`;
    });
});

// Khởi tạo khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra token
  if (!getToken()) {
    window.location.href = '../pages-login/pages-login.html';
    return;
  }
  
  // Tải danh sách dự án
  loadProjects();
  
  // Tải danh sách trạng thái
  loadTaskStatuses();
  
  // Xử lý đăng xuất
  document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    window.location.href = '../pages-login/pages-login.html';
  });
});
