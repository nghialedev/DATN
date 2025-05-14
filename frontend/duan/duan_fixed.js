/**
 * Script for Project module - API Integration
 * Phiên bản: 1.0.3
 * Cập nhật: Sửa lỗi tham chiếu hàm và ID HTML
 */
// API Helper function để các module khác có thể truy cập dữ liệu dự án
const projectAPI = {
  /**
   * Lấy danh sách dự án
   * @param {Function} callback - Hàm callback nhận kết quả
   */
  getAllProjects: function(callback) {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('Không tìm thấy token xác thực');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/project", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error("Không thể lấy dữ liệu dự án:", result.message);
          callback([]);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API danh sách dự án:", error);
        callback([]);
      });
  },

  /**
   * Lấy thông tin dự án theo ID
   * @param {number} id - ID của dự án cần lấy thông tin
   * @param {Function} callback - Hàm callback nhận kết quả
   */
  getProjectById: function(id, callback) {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('Không tìm thấy token xác thực');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/project/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error(`Không thể lấy thông tin dự án ID ${id}:`, result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error(`Lỗi khi gọi API thông tin dự án ID ${id}:`, error);
        callback(null);
      });
  }
};

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM đã được tải hoàn tất");
  
  // Lấy token xác thực từ localStorage hoặc sessionStorage
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  // Kiểm tra nếu không có token thì chuyển hướng về trang đăng nhập
  if (!accessToken || accessToken === "your_access_token_here") {
    window.location.href = "../pages-login/pages-login.html";
    return;
  }
  
  // Hiển thị thông tin người dùng đăng nhập
  displayUserInfo();
  
  // Cấu hình headers cho API
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");
  
  // Lấy danh sách dự án
  fetchProjects();
  
  // Lắng nghe sự kiện cho nút thêm dự án mới
  const saveProjectBtn = document.getElementById('saveProjectBtn');
  if (saveProjectBtn) {
    saveProjectBtn.addEventListener('click', window.addNewProject);
    console.log("Đã gắn sự kiện cho nút Thêm dự án");
  } else {
    console.warn("Không tìm thấy nút 'saveProjectBtn' - chức năng thêm dự án sẽ không hoạt động");
  }
  
  // Hàm hiển thị thông tin người dùng đăng nhập
  function displayUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || sessionStorage.getItem('userData') || '{}');
    if (userData && userData.username) {
      // Kiểm tra từng phần tử tồn tại trước khi thiết lập thuộc tính
      const userFullName = document.getElementById('userFullName');
      if (userFullName) userFullName.textContent = userData.username;
      
      const userFullNameMenu = document.getElementById('userFullNameMenu');
      if (userFullNameMenu) userFullNameMenu.textContent = userData.username;
      
      const userRoleMenu = document.getElementById('userRoleMenu');
      if (userRoleMenu) userRoleMenu.textContent = userData.role || 'User';
    }
  }
  
  // Sự kiện đăng xuất
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');
    // Chuyển hướng về trang đăng nhập
    window.location.href = "../pages-login/pages-login.html";
  });

  /**
   * Hàm gọi API lấy danh sách dự án
   */
  function fetchProjects() {
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/project", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          populateTable(result.data);
        } else {
          console.error("Không thể lấy dữ liệu dự án:", result.message);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API danh sách dự án:", error);
      });
  }

  /**
   * Hiển thị danh sách dự án
   * @param {Array} projects - Danh sách dự án từ API
   */
  function populateTable(projects) {
    const tableBody = document.getElementById('projectTableBody');
    const dynamicModals = document.getElementById('dynamicModals');
    
    // Xóa dữ liệu cũ
    tableBody.innerHTML = '';
    dynamicModals.innerHTML = '';
    
    // Thêm dữ liệu mới từ API
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        // Format dates
        const startDate = new Date(project.start_date);
        const endDate = new Date(project.end_date);
        const createdAt = new Date(project.createdAt);
        
        // Format theo định dạng dd/mm/yyyy
        const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`;
        const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`;
        const formattedCreatedAt = createdAt.toLocaleString('vi-VN');
        
        // Tạo hàng mới
        const row = document.createElement('tr');
        
        // Thêm dữ liệu vào hàng
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.name}</td>
          <td>${formattedStartDate}</td>
          <td>${formattedEndDate}</td>
          <td>${project.client_id || 'N/A'}</td>
          <td>${formattedCreatedAt}</td>
          <td>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#viewModal-${project.id}"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#editModal-${project.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal-${project.id}"><i class="bi bi-trash"></i></button>
          </td>
        `;
        
        // Thêm hàng vào bảng
        tableBody.appendChild(row);
        
        // Tạo modal tương ứng cho hàng
        createProjectModals(project);
      });
      
      // Lấy tham chiếu đến bảng
      const dataTable = document.querySelector('.datatable-table');
      if (dataTable) {
        // Kiểm tra xem DataTable đã được khởi tạo chưa
        if (dataTable.classList.contains('dataTable-table')) {
          // Đã khởi tạo, cần refresh
          const dt = dataTable.DataTable;
          if (dt && typeof dt.destroy === 'function') {
            dt.destroy();
          }
        }
      }
      // Initialize new datatable
      new simpleDatatables.DataTable(dataTable, {
        perPageSelect: [5, 10, 15, 20, 25],
        labels: {
          placeholder: "Tìm kiếm...",
          perPage: "",
          noRows: "Không tìm thấy dữ liệu",
          info: "Hiển thị {start} đến {end} của {rows} mục",
        }
      });
    }
  }

  /**
   * Tạo các modal cho dự án
   * @param {Object} project - Thông tin dự án
   */
  function createProjectModals(project) {
    // Format dates
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    const createdAt = new Date(project.createdAt);
    const updatedAt = new Date(project.updatedAt);
    
    // Format for display
    const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`;
    const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`;
    const formattedCreatedAt = createdAt.toLocaleString('vi-VN');
    const formattedUpdatedAt = updatedAt.toLocaleString('vi-VN');
    
    // ISO format for input fields
    const isoStartDate = project.start_date.split('T')[0]; // YYYY-MM-DD format for input[type=date]
    const isoEndDate = project.end_date.split('T')[0]; // YYYY-MM-DD format for input[type=date]
    
    // Container cho modals
    const dynamicModals = document.getElementById('dynamicModals');
    
    // Tạo modal xem chi tiết
    const viewModal = document.createElement('div');
    viewModal.className = 'modal fade';
    viewModal.id = `viewModal-${project.id}`;
    viewModal.tabIndex = '-1';
    viewModal.setAttribute('aria-labelledby', `viewModalLabel-${project.id}`);
    viewModal.setAttribute('aria-hidden', 'true');
    
    viewModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewModalLabel-${project.id}">Thông tin dự án: ${project.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Tên dự án:</div>
              <div class="col-sm-8">${project.name}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Ngày bắt đầu:</div>
              <div class="col-sm-8">${formattedStartDate}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Ngày kết thúc:</div>
              <div class="col-sm-8">${formattedEndDate}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">ID Khách hàng:</div>
              <div class="col-sm-8">${project.client_id || 'Chưa có'}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Ngày tạo:</div>
              <div class="col-sm-8">${formattedCreatedAt}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Cập nhật lần cuối:</div>
              <div class="col-sm-8">${formattedUpdatedAt}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    `;
    
    // Tạo modal chỉnh sửa
    const editModal = document.createElement('div');
    editModal.className = 'modal fade';
    editModal.id = `editModal-${project.id}`;
    editModal.tabIndex = '-1';
    editModal.setAttribute('aria-labelledby', `editModalLabel-${project.id}`);
    editModal.setAttribute('aria-hidden', 'true');
    
    editModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel-${project.id}">Chỉnh sửa dự án: ${project.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="editForm-${project.id}">
              <div class="mb-3">
                <label for="name-${project.id}" class="form-label">Tên dự án</label>
                <input type="text" class="form-control" id="name-${project.id}" value="${project.name}" required>
              </div>
              <div class="mb-3">
                <label for="startDate-${project.id}" class="form-label">Ngày bắt đầu</label>
                <input type="date" class="form-control" id="startDate-${project.id}" value="${isoStartDate}" required>
              </div>
              <div class="mb-3">
                <label for="endDate-${project.id}" class="form-label">Ngày kết thúc</label>
                <input type="date" class="form-control" id="endDate-${project.id}" value="${isoEndDate}" required>
              </div>
              <div class="mb-3">
                <label for="clientId-${project.id}" class="form-label">ID Khách hàng</label>
                <input type="number" class="form-control" id="clientId-${project.id}" value="${project.client_id || ''}" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" onclick="window.updateProject(${project.id})">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    `;
    
    // Tạo modal xóa
    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal fade';
    deleteModal.id = `deleteModal-${project.id}`;
    deleteModal.tabIndex = '-1';
    deleteModal.setAttribute('aria-labelledby', `deleteModalLabel-${project.id}`);
    deleteModal.setAttribute('aria-hidden', 'true');
    
    deleteModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel-${project.id}">Xác nhận xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa dự án <strong>${project.name}</strong>?</p>
            <p class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger" onclick="window.deleteProject(${project.id})">Xóa</button>
          </div>
        </div>
      </div>
    `;
    
    // Thêm các modal vào container
    dynamicModals.appendChild(viewModal);
    dynamicModals.appendChild(editModal);
    dynamicModals.appendChild(deleteModal);
  }

  /**
   * Hàm cập nhật thông tin dự án
   * @param {number} projectId - ID của dự án cần cập nhật
   */
  window.updateProject = function(projectId) {
    // Lấy các giá trị từ form cập nhật
    const name = document.getElementById(`name-${projectId}`).value;
    const startDate = document.getElementById(`startDate-${projectId}`).value;
    const endDate = document.getElementById(`endDate-${projectId}`).value;
    const clientId = document.getElementById(`clientId-${projectId}`).value;
    
    // Kiểm tra các trường bắt buộc
    if (!name || !startDate || !endDate || !clientId) {
      alert('Vui lòng điền đầy đủ thông tin dự án!');
      return;
    }
    
    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (new Date(endDate) < new Date(startDate)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!');
      return;
    }
    
    // Tạo đối tượng dữ liệu gửi đi
    const data = {
      name: name,
      start_date: startDate,
      end_date: endDate,
      client_id: parseInt(clientId)
    };
    
    // Cấu hình request
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    
    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: 'follow'
    };
    
    // Gọi API cập nhật
    fetch(`http://localhost:3000/project/${projectId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          // Đóng modal và refresh dữ liệu
          const modalElement = document.getElementById(`editModal-${projectId}`);
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          
          // Thông báo thành công
          alert('Cập nhật thông tin dự án thành công!');
          
          // Làm mới dữ liệu
          fetchProjects();
        } else {
          alert(`Lỗi: ${result.message}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin dự án!');
      });
  };

  /**
   * Hàm xóa dự án
   * @param {number} projectId - ID của dự án cần xóa
   */
  window.deleteProject = function(projectId) {
    // Không cần confirm lại vì đã có modal xác nhận
    
    // Cấu hình request
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    // Gọi API xóa dự án
    fetch(`http://localhost:3000/project/${projectId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          // Đóng modal và refresh dữ liệu
          const modalElement = document.getElementById(`deleteModal-${projectId}`);
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          
          // Thông báo thành công
          alert('Xóa dự án thành công!');
          
          // Làm mới dữ liệu
          fetchProjects();
        } else {
          alert(`Lỗi: ${result.message || 'Không thể xóa dự án'}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi xóa dự án!');
      });
  };

  /**
   * Hàm thêm dự án mới
   */
  window.addNewProject = function() {
    console.log('Đang thêm dự án mới...');
    
    // Lấy giá trị từ form
    const name = document.getElementById('projectName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const clientId = document.getElementById('clientId').value;
    
    // Validate form theo yêu cầu API
    if (!name || !startDate || !endDate || !clientId) {
      alert('Vui lòng điền đầy đủ thông tin dự án!');
      return;
    }
    
    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (new Date(endDate) < new Date(startDate)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!');
      return;
    }
    
    // Tạo đối tượng dữ liệu gửi đi
    const projectData = {
      name: name,
      start_date: startDate,
      end_date: endDate,
      client_id: parseInt(clientId)
    };
    
    console.log('Dữ liệu tạo dự án:', projectData);
    
    // Cấu hình request
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(projectData),
      redirect: 'follow'
    };
    
    // Gọi API thêm dự án mới
    fetch('http://localhost:3000/project', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả tạo dự án:', result);
        if (result.statusCode === 201) {
          // Đóng modal sau khi thêm
          const modal = document.getElementById('addProjectModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modal.hide();
          
          // Làm mới form
          document.getElementById('addProjectForm').reset();
          
          // Thông báo thành công
          alert('Thêm dự án mới thành công!');
          
          // Tải lại dữ liệu bảng
          fetchProjects();
        } else {
          alert(`Lỗi: ${result.message || 'Không thể thêm dự án mới'}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thêm dự án mới!');
      });
  };
});
