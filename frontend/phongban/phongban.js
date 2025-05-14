// Script for Phongban module - API Integration

// API Helper function để các module khác có thể truy cập dữ liệu phòng ban
// Được định nghĩa bên ngoài để có thể truy cập toàn cầu
window.departmentAPI = {
  // Fetch danh sách phòng ban
  getAllDepartments: function(callback) {
    const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
    if (!accessToken || accessToken === "your_access_token_here") {
      console.error("Không tìm thấy access token");
      callback(null);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/departments", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error("Không thể lấy danh sách phòng ban:", result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API phòng ban:", error);
        callback(null);
      });
  },
  
  // Lấy thông tin chi tiết phòng ban theo ID
  getDepartmentById: function(id, callback) {
    const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
    if (!accessToken || accessToken === "your_access_token_here") {
      console.error("Không tìm thấy access token");
      callback(null);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error("Không thể lấy thông tin phòng ban:", result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API phòng ban:", error);
        callback(null);
      });
  }
};

// Code chính được thực thi khi nạp trang
document.addEventListener('DOMContentLoaded', function() {
  // Lấy token từ localStorage hoặc sessionStorage
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
  
  // Kiểm tra nếu không có token thì chuyển hướng về trang đăng nhập
  if (!accessToken || accessToken === "your_access_token_here") {
    window.location.href = "../pages-login/pages-login.html";
    return;
  }
  
  // Cấu hình headers cho API
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");
  
  // Hiển thị thông tin người dùng đăng nhập
  displayUserInfo();
  
  // Lấy danh sách phòng ban khi trang được tải
  fetchDepartments();
  
  // Thêm event listener cho nút đăng xuất
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Xóa token và thông tin người dùng khỏi localStorage và sessionStorage
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = "../pages-login/pages-login.html";
  });

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
  
  // Hàm để lấy danh sách phòng ban
  function fetchDepartments() {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/departments", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          populateTable(result.data);
        } else {
          console.error("Không thể lấy dữ liệu:", result.message);
          // Hiển thị thông báo lỗi
          const tableBody = document.querySelector('.table.datatable tbody');
          tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Không thể lấy dữ liệu phòng ban. Vui lòng thử lại sau.</td></tr>';
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        // Hiển thị thông báo lỗi
        const tableBody = document.querySelector('.table.datatable tbody');
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</td></tr>';
      });
  }
  
  // Hàm để hiển thị dữ liệu vào bảng
  function populateTable(departments) {
    const tableBody = document.querySelector('.datatable tbody');
    
    // Xóa dữ liệu cũ
    tableBody.innerHTML = '';
    
    if (departments && departments.length > 0) {
      // Tạo một mảng để chứa tất cả promises khi gọi API lấy số lượng nhân viên
      const promises = departments.map(dept => {
        return new Promise((resolve) => {
          // Gọi API lấy danh sách nhân viên theo phòng ban
          const deptRequestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
          };
          
          // Sử dụng tham số filter để lấy nhân viên theo phòng ban
          fetch(`http://localhost:3000/user?department_id=${dept.id}`, deptRequestOptions)
            .then(response => response.json())
            .then(result => {
              if (result.statusCode === 200 && result.data) {
                // Trả về số lượng nhân viên
                resolve({ department: dept, employeeCount: result.data.length, employees: result.data });
              } else {
                resolve({ department: dept, employeeCount: 0, employees: [] });
              }
            })
            .catch(error => {
              console.error("Lỗi khi lấy số lượng nhân viên:", error);
              resolve({ department: dept, employeeCount: 0, employees: [] });
            });
        });
      });
      
      // Sau khi tất cả promises đã hoàn thành
      Promise.all(promises).then(departmentsWithCounts => {
        // Lưu trữ dữ liệu nhân viên để sử dụng sau này
        window.departmentEmployees = {};
        
        departmentsWithCounts.forEach((item, index) => {
          const dept = item.department;
          const employeeCount = item.employeeCount;
          const employees = item.employees;
          
          // Lưu trữ danh sách nhân viên theo phòng ban
          window.departmentEmployees[dept.id] = employees;
          
          // Định dạng ngày tạo và cập nhật
          const createdDate = new Date(dept.createdAt);
          const updatedDate = new Date(dept.updatedAt);
          
          const formattedCreatedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
          const formattedUpdatedDate = `${updatedDate.getDate()}/${updatedDate.getMonth() + 1}/${updatedDate.getFullYear()}`;
          
          // Tạo hàng mới
          const row = document.createElement('tr');
          
          // Thêm dữ liệu vào hàng
          row.innerHTML = `
            <td class="text-center">${dept.id}</td>
            <td>
              ${dept.department}
              <span class="badge bg-info ms-2">${employeeCount} nhân viên</span>
            </td>
            <td class="text-center">${formattedCreatedDate}</td>
            <td class="text-center">${formattedUpdatedDate}</td>
            <td class="text-center">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-info btn-sm view-btn" data-id="${dept.id}" title="Xem chi tiết">
                  <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn btn-success btn-sm view-employees-btn" data-id="${dept.id}" title="Xem nhân viên">
                  <i class="bi bi-people"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm edit-btn" data-id="${dept.id}" title="Chỉnh sửa">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${dept.id}" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          `;
          
          // Thêm hàng vào bảng
          tableBody.appendChild(row);
        });
        
        // Thêm event listener cho nút xem nhân viên
        document.querySelectorAll('.view-employees-btn').forEach(button => {
          button.addEventListener('click', function() {
            const deptId = this.getAttribute('data-id');
            showDepartmentEmployees(deptId);
          });
        });
        
        // Khởi tạo datatable
        const dataTable = new simpleDatatables.DataTable(".datatable");
        
        // Thêm event listeners cho các nút
        addButtonEventListeners();
      });
    } else {
      // Hiển thị thông báo nếu không có dữ liệu
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Không có dữ liệu phòng ban</td></tr>`;
    }
  }
  
  // Hàm hiển thị danh sách nhân viên của phòng ban
  function showDepartmentEmployees(departmentId) {
    // Lấy dữ liệu phòng ban
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${departmentId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          const dept = result.data;
          const employees = window.departmentEmployees[departmentId] || [];
          
          // Tạo modal động
          let modalHTML = `
            <div class="modal fade" id="employeesModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Nhân viên Phòng ban: ${dept.department}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
          `;
          
          if (employees.length > 0) {
            modalHTML += `
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Họ tên</th>
                      <th scope="col">Email</th>
                      <th scope="col">Giới tính</th>
                      <th scope="col">Vai trò</th>
                      <th scope="col">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
            
            employees.forEach(employee => {
              // Chuyển đổi giới tính sang tiếng Việt
              const genderText = employee.gender === 'male' ? 'Nam' : (employee.gender === 'female' ? 'Nữ' : 'Khác');
              // Chuyển đổi trạng thái hoạt động
              const activeStatus = employee.is_active ? '<span class="badge bg-success">Đang hoạt động</span>' : '<span class="badge bg-danger">Không hoạt động</span>';
              
              modalHTML += `
                <tr>
                  <td>${employee.id}</td>
                  <td>${employee.username}</td>
                  <td>${employee.email}</td>
                  <td>${genderText}</td>
                  <td>${employee.role}</td>
                  <td>${activeStatus}</td>
                </tr>
              `;
            });
            
            modalHTML += `
                  </tbody>
                </table>
              </div>
            `;
          } else {
            modalHTML += `<p class="text-center">Phòng ban này chưa có nhân viên nào.</p>`;
          }
          
          modalHTML += `
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <a href="../nhanvien/nhanvien.html" class="btn btn-primary">Quản lý nhân viên</a>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          // Thêm modal vào DOM
          const modalContainer = document.createElement('div');
          modalContainer.innerHTML = modalHTML;
          document.body.appendChild(modalContainer);
          
          // Hiển thị modal
          const employeesModal = new bootstrap.Modal(document.getElementById('employeesModal'));
          employeesModal.show();
          
          // Xử lý sự kiện khi modal đóng để xóa nó khỏi DOM
          document.getElementById('employeesModal').addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalContainer);
          });
        } else {
          console.error("Không thể lấy thông tin phòng ban:", result.message);
          alert("Không thể lấy thông tin phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin phòng ban!");
      });
  }
  
  // Thêm event listeners cho các nút trong bảng
  function addButtonEventListeners() {
    // Nút xem chi tiết
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const deptId = this.getAttribute('data-id');
        viewDepartment(deptId);
      });
    });
    
    // Nút chỉnh sửa
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const deptId = this.getAttribute('data-id');
        editDepartment(deptId);
      });
    });
    
    // Nút xóa
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const deptId = this.getAttribute('data-id');
        document.getElementById('deleteDepartmentId').value = deptId;
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteDepartmentModal'));
        deleteModal.show();
      });
    });
  }
  
  // Hàm xem chi tiết phòng ban
  function viewDepartment(id) {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          const dept = result.data;
          
          // Định dạng ngày tạo và cập nhật
          const createdDate = new Date(dept.createdAt);
          const updatedDate = new Date(dept.updatedAt);
          
          const formattedCreatedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
          const formattedUpdatedDate = `${updatedDate.getDate()}/${updatedDate.getMonth() + 1}/${updatedDate.getFullYear()}`;
          
          // Hiển thị thông tin trong modal
          document.getElementById('viewDepartmentId').textContent = dept.id;
          document.getElementById('viewDepartmentName').textContent = dept.department;
          document.getElementById('viewCreatedAt').textContent = formattedCreatedDate;
          document.getElementById('viewUpdatedAt').textContent = formattedUpdatedDate;
          
          // Hiển thị modal
          const viewModal = new bootstrap.Modal(document.getElementById('viewDepartmentModal'));
          viewModal.show();
        } else {
          console.error("Không thể lấy thông tin phòng ban:", result.message);
          alert("Không thể lấy thông tin phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin phòng ban!");
      });
  }
  
  // Hàm chỉnh sửa phòng ban
  function editDepartment(id) {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          const dept = result.data;
          
          // Hiển thị thông tin trong modal
          document.getElementById('editDepartmentId').value = dept.id;
          document.getElementById('editDepartmentName').value = dept.department;
          
          // Hiển thị modal
          const editModal = new bootstrap.Modal(document.getElementById('editDepartmentModal'));
          editModal.show();
        } else {
          console.error("Không thể lấy thông tin phòng ban:", result.message);
          alert("Không thể lấy thông tin phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin phòng ban!");
      });
  }
  
  // Xử lý sự kiện thêm phòng ban mới
  document.getElementById('saveDepartmentBtn').addEventListener('click', function() {
    const departmentName = document.getElementById('departmentName').value.trim();
    
    if (!departmentName) {
      document.getElementById('departmentName').classList.add('is-invalid');
      return;
    }
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ department: departmentName }),
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/departments", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 201) {
          // Đóng modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('addDepartmentModal'));
          modal.hide();
          
          // Reset form
          document.getElementById('addDepartmentForm').reset();
          
          // Cập nhật lại bảng
          fetchDepartments();
          
          // Hiển thị thông báo thành công
          alert("Thêm phòng ban thành công!");
        } else {
          console.error("Không thể thêm phòng ban:", result.message);
          alert("Không thể thêm phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi thêm phòng ban!");
      });
  });
  
  // Xử lý sự kiện cập nhật phòng ban
  document.getElementById('updateDepartmentBtn').addEventListener('click', function() {
    const departmentId = document.getElementById('editDepartmentId').value;
    const departmentName = document.getElementById('editDepartmentName').value.trim();
    
    if (!departmentName) {
      document.getElementById('editDepartmentName').classList.add('is-invalid');
      return;
    }
    
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({ department: departmentName }),
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${departmentId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          // Đóng modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('editDepartmentModal'));
          modal.hide();
          
          // Cập nhật lại bảng
          fetchDepartments();
          
          // Hiển thị thông báo thành công
          alert("Cập nhật phòng ban thành công!");
        } else {
          console.error("Không thể cập nhật phòng ban:", result.message);
          alert("Không thể cập nhật phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi cập nhật phòng ban!");
      });
  });
  
  // Xử lý sự kiện xóa phòng ban
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    const departmentId = document.getElementById('deleteDepartmentId').value;
    
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/departments/${departmentId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          // Đóng modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('deleteDepartmentModal'));
          modal.hide();
          
          // Cập nhật lại bảng
          fetchDepartments();
          
          // Hiển thị thông báo thành công
          alert("Xóa phòng ban thành công!");
        } else {
          console.error("Không thể xóa phòng ban:", result.message);
          alert("Không thể xóa phòng ban: " + (result.message || "Vui lòng thử lại sau"));
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi xóa phòng ban!");
      });
  });
  
  // Xử lý sự kiện khi nhập vào input để xóa thông báo lỗi
  document.getElementById('departmentName').addEventListener('input', function() {
    this.classList.remove('is-invalid');
  });
  
  document.getElementById('editDepartmentName').addEventListener('input', function() {
    this.classList.remove('is-invalid');
  });
});
