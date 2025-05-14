/**
 * Module phân công nhân viên (Project Employee Assignment Management)
 * Tương tác với API: /project-user
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

// API Helper function cho module Project User Assignment
const projectUserAPI = {
  // 8.1. Thêm nhân viên vào dự án (POST /project-user)
  addUserToProject: function(assignmentData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(assignmentData),
      redirect: 'follow'
    };
    
    fetch('http://localhost:3000/project-user', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for adding employee to project:', result);
        
        // Xử lý kết quả
        let success = false;
        let message = '';
        let data = null;
        
        if (result && (result.id || (result.data && result.data.id))) {
          success = true;
          data = result.id ? result : result.data;
          message = 'Thêm nhân viên vào dự án thành công!';
        } else if (result && result.statusCode === 201) {
          success = true;
          data = result.data;
          message = result.message || 'Thêm nhân viên vào dự án thành công!';
        } else {
          success = false;
          message = result.message || 'Không thể thêm nhân viên vào dự án. Vui lòng thử lại.';
        }
        
        if (callback) callback(success, message, data);
      })
      .catch(error => {
        console.error('Lỗi khi thêm nhân viên vào dự án:', error);
        if (callback) callback(false, 'Lỗi kết nối: ' + error.message, null);
      });
  },
  
  // 8.2. Lấy danh sách nhân viên trong dự án (GET /project-user?project_id=1)
  getUsersByProject: function(projectId, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    // Nếu không có projectId, lấy tất cả phân công
    const url = projectId ? `http://localhost:3000/project-user?project_id=${projectId}` : 'http://localhost:3000/project-user';
    
    // Hiển thị thông báo đang tải
    document.getElementById('assignmentsTableBody').innerHTML = '<tr><td colspan="7" class="text-center">Đang tải dữ liệu...</td></tr>';
    
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for project employees:', result);
        
        // Xử lý dữ liệu trả về
        let assignments = [];
        
        if (Array.isArray(result)) {
          // Mảng trực tiếp
          assignments = result;
        } else if (result && result.data && Array.isArray(result.data)) {
          // Trong trường hợp API trả về { data: [...] }
          assignments = result.data;
        } else if (result && result.assignments && Array.isArray(result.assignments)) {
          // Trong trường hợp API trả về { assignments: [...] }
          assignments = result.assignments;
        } else if (result && result.users && Array.isArray(result.users)) {
          // Trong trường hợp API trả về { users: [...] }
          assignments = result.users;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          assignments = Array.isArray(result.data) ? result.data : [result.data];
        } else {
          console.error('Không thể xác định cấu trúc dữ liệu từ API');
          document.getElementById('assignmentsTableBody').innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi cấu trúc dữ liệu</td></tr>';
          return;
        }
        
        if (callback) callback(assignments);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API lấy danh sách nhân viên trong dự án:', error);
        document.getElementById('assignmentsTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối: ${error.message}</td></tr>`;
      });
  },
  
  // 8.3. Lấy thông tin chi tiết phân công (GET /project-user/1)
  getAssignmentById: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/project-user/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('API response for assignment details:', result);
        
        // Xử lý dữ liệu trả về
        let assignment = null;
        
        if (result && result.id) {
          // Đối tượng trực tiếp
          assignment = result;
        } else if (result && result.data && result.data.id) {
          // Trong trường hợp API trả về { data: {...} }
          assignment = result.data;
        } else if (result && result.assignment && result.assignment.id) {
          // Trong trường hợp API trả về { assignment: {...} }
          assignment = result.assignment;
        } else if (result && result.statusCode === 200 && result.data) {
          // Cấu trúc API cũ
          assignment = result.data;
        } else {
          console.error('Không thể xác định cấu trúc dữ liệu chi tiết từ API');
          if (callback) callback(null);
          return;
        }
        
        if (callback) callback(assignment);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API lấy chi tiết phân công:', error);
        if (callback) callback(null);
      });
  },
  
  // 8.4. Xóa nhân viên khỏi dự án (DELETE /project-user/1)
  removeUserFromProject: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'DELETE',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/project-user/${id}`, requestOptions)
      .then(response => {
        if (response.status === 204) return { success: true };
        return response.json();
      })
      .then(result => {
        console.log('API response for removing employee from project:', result);
        
        // Xử lý kết quả
        let success = false;
        let message = '';
        
        if (result && result.success) {
          success = true;
          message = 'Xóa nhân viên khỏi dự án thành công!';
        } else if (result && result.statusCode === 200) {
          success = true;
          message = result.message || 'Xóa nhân viên khỏi dự án thành công!';
        } else {
          success = false;
          message = result.message || 'Không thể xóa nhân viên khỏi dự án. Vui lòng thử lại.';
        }
        
        if (callback) callback(success, message);
      })
      .catch(error => {
        console.error('Lỗi khi xóa nhân viên khỏi dự án:', error);
        if (callback) callback(false, 'Lỗi kết nối: ' + error.message);
      });
  }
};

// Hiển thị danh sách phân công
function displayAssignments(assignments) {
  const tableBody = document.getElementById('assignmentsTableBody');
  if (!tableBody) {
    console.error('Không tìm thấy phần tử assignmentsTableBody');
    return;
  }
  
  // Xóa dữ liệu cũ
  tableBody.innerHTML = '';
  
  // Kiểm tra nếu không có dữ liệu
  if (!assignments || assignments.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có phân công nào</td></tr>';
    return;
  }
  
  // Hiển thị dữ liệu
  assignments.forEach((assignment, index) => {
    // Xử lý thông tin dự án
    let projectName = 'N/A';
    if (assignment.project) {
      projectName = assignment.project.name || `Dự án #${assignment.project.id}`;
    } else if (assignment.project_id) {
      projectName = `Dự án #${assignment.project_id}`;
    }
    
    // Xử lý thông tin nhân viên
    let employeeName = 'N/A';
    let employeeEmail = 'N/A';
    let employeeRole = 'N/A';
    let roleClass = '';
    
    if (assignment.user) {
      employeeName = assignment.user.name || assignment.user.username || `Nhân viên #${assignment.user.id}`;
      employeeEmail = assignment.user.email || 'Không có email';
      employeeRole = assignment.user.role || 'Không có vị trí';
      
      // Xác định class cho role pill
      if (employeeRole.toLowerCase().includes('admin')) {
        roleClass = 'admin';
      } else if (employeeRole.toLowerCase().includes('developer') || employeeRole.toLowerCase().includes('dev')) {
        roleClass = 'developer';
      } else if (employeeRole.toLowerCase().includes('manager') || employeeRole.toLowerCase().includes('quan')) {
        roleClass = 'manager';
      } else if (employeeRole.toLowerCase().includes('client') || employeeRole.toLowerCase().includes('khach')) {
        roleClass = 'client';
      }
    } else if (assignment.user_id) {
      employeeName = `Nhân viên #${assignment.user_id}`;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>${projectName}</td>
      <td>${employeeName}</td>
      <td>${employeeEmail}</td>
      <td><span class="user-role ${roleClass}">${employeeRole}</span></td>
      <td class="text-center">${formatDateTime(assignment.created_at || assignment.createdAt)}</td>
      <td class="text-center">
        <div class="btn-action-group">
          <button class="btn btn-primary btn-sm view-assignment" data-id="${assignment.id}" title="Xem chi tiết">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-assignment" data-id="${assignment.id}" title="Xóa">
            <i class="bi bi-trash"></i>
          </button>
        </div>
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
  document.querySelectorAll('.view-assignment').forEach(button => {
    button.addEventListener('click', function() {
      const assignmentId = this.getAttribute('data-id');
      viewAssignment(assignmentId);
    });
  });
  
  // Nút xóa
  document.querySelectorAll('.delete-assignment').forEach(button => {
    button.addEventListener('click', function() {
      const assignmentId = this.getAttribute('data-id');
      removeAssignment(assignmentId);
    });
  });
}

// Hàm xem chi tiết phân công
function viewAssignment(assignmentId) {
  projectUserAPI.getAssignmentById(assignmentId, function(assignment) {
    if (!assignment) {
      alert('Không thể lấy thông tin phân công!');
      return;
    }
    
    // Hiển thị thông tin trong modal
    document.getElementById('viewAssignmentId').textContent = assignment.id;
    
    // Hiển thị thông tin dự án
    let projectName = 'N/A';
    if (assignment.project) {
      projectName = assignment.project.name || `Dự án #${assignment.project.id}`;
    } else if (assignment.project_id) {
      projectName = `Dự án #${assignment.project_id}`;
    }
    document.getElementById('viewAssignmentProject').textContent = projectName;
    
    // Hiển thị thông tin nhân viên
    let employeeName = 'N/A';
    let employeeEmail = 'N/A';
    let employeeRole = 'N/A';
    
    if (assignment.user) {
      employeeName = assignment.user.name || assignment.user.username || `Nhân viên #${assignment.user.id}`;
      employeeEmail = assignment.user.email || 'Không có email';
      employeeRole = assignment.user.role || 'Không có vị trí';
    } else if (assignment.user_id) {
      employeeName = `Nhân viên #${assignment.user_id}`;
    }
    
    document.getElementById('viewAssignmentUser').textContent = employeeName;
    document.getElementById('viewAssignmentEmail').textContent = employeeEmail;
    document.getElementById('viewAssignmentRole').textContent = employeeRole;
    document.getElementById('viewAssignmentEmail').textContent = employeeEmail;
    document.getElementById('viewAssignmentRole').textContent = employeeRole;
    
    // Hiển thị thông tin thời gian
    document.getElementById('viewAssignmentCreatedAt').textContent = formatDateTime(assignment.created_at || assignment.createdAt);
    document.getElementById('viewAssignmentUpdatedAt').textContent = formatDateTime(assignment.updated_at || assignment.updatedAt);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('viewAssignmentModal'));
    modal.show();
  });
}

// Hàm xóa phân công
function removeAssignment(assignmentId) {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi dự án?')) {
    projectUserAPI.removeUserFromProject(assignmentId, function(success, message) {
      alert(message);
      if (success) {
        // Tải lại danh sách
        loadAssignments();
      }
    });
  }
}

// Xử lý form thêm phân công mới
document.getElementById('addAssignmentForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const projectId = document.getElementById('newAssignmentProject').value;
  const userId = document.getElementById('newAssignmentUser').value;
  
  if (!projectId) {
    alert('Vui lòng chọn dự án!');
    return;
  }
  
  if (!userId) {
    alert('Vui lòng chọn nhân viên!');
    return;
  }
  
  const assignmentData = {
    project_id: parseInt(projectId),
    user_id: parseInt(userId)
  };
  
  projectUserAPI.addUserToProject(assignmentData, function(success, message, data) {
    alert(message);
    if (success) {
      // Đóng modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addAssignmentModal'));
      modal.hide();
      
      // Reset form
      document.getElementById('addAssignmentForm').reset();
      
      // Tải lại danh sách
      loadAssignments();
    }
  });
});

// Tải danh sách dự án cho dropdown
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
        document.getElementById('newAssignmentProject')
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

// Tải danh sách nhân viên cho dropdown
function loadEmployees() {
  const headers = createHeaders();
  if (!headers) return;
  
  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };
  
  fetch('http://localhost:3000/user', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('API response for employees:', result);
      
      // Xử lý dữ liệu trả về
      let employees = [];
      
      if (Array.isArray(result)) {
        employees = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        employees = result.data;
      } else if (result && result.employees && Array.isArray(result.employees)) {
        employees = result.employees;
      } else if (result && result.users && Array.isArray(result.users)) {
        employees = result.users;
      } else if (result && result.statusCode === 200 && result.data) {
        employees = Array.isArray(result.data) ? result.data : [result.data];
      } else {
        console.error('Không thể xác định cấu trúc dữ liệu nhân viên từ API');
        return;
      }
      
      // Thêm nhân viên vào dropdown
      const dropdown = document.getElementById('newAssignmentUser');
      if (dropdown) {
        // Giữ lại option đầu tiên (placeholder)
        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);
        
        // Thêm các option nhân viên
        employees.forEach(employee => {
          const option = document.createElement('option');
          option.value = employee.id;
          option.textContent = employee.name || employee.username || `Nhân viên #${employee.id}`;
          dropdown.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
    });
}

// Tải danh sách phân công
function loadAssignments(projectId = null) {
  projectUserAPI.getUsersByProject(projectId, function(assignments) {
    if (assignments) {
      displayAssignments(assignments);
    }
  });
}

// Xử lý sự kiện lọc theo dự án
document.getElementById('projectFilter')?.addEventListener('change', function() {
  const selectedProject = this.value;
  
  // Nếu chọn tất cả, tải lại toàn bộ danh sách
  if (selectedProject === 'all') {
    loadAssignments();
    return;
  }
  
  // Tải danh sách theo dự án đã chọn
  loadAssignments(selectedProject);
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
  
  // Tải danh sách nhân viên
  loadEmployees();
  
  // Tải danh sách phân công
  loadAssignments();
  
  // Xử lý đăng xuất
  document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    window.location.href = '../pages-login/pages-login.html';
  });
});
