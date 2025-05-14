/**
 * Script for Nhanvien module - API Integration
 * Phiên bản: 1.0.2
 * Cập nhật: Tuân thủ 100% API Backend
 */
// Hàm để đảm bảo phần tử tbody của bảng tồn tại
function ensureTableBodyExists() {
  console.log("Kiểm tra và đảm bảo phần tử tbody tồn tại");
  
  // Tìm phần tử tbody đã có trong HTML
  let tableBody = document.getElementById('userTableBody');
  
  // Nếu không tìm thấy, thử tìm bảng datatable và tạo tbody
  if (!tableBody) {
    console.log("Không tìm thấy userTableBody, kiểm tra bảng datatable");
    
    // Tìm bảng datatable
    const dataTable = document.querySelector('.datatable');
    if (dataTable) {
      console.log("Tìm thấy bảng datatable, kiểm tra và tạo tbody nếu cần");
      
      // Kiểm tra xem bảng đã có tbody chưa
      tableBody = dataTable.querySelector('tbody');
      
      if (!tableBody) {
        // Tạo mới phần tử tbody
        console.log("Không tìm thấy tbody, tạo mới");
        tableBody = document.createElement('tbody');
        tableBody.id = 'userTableBody';
        dataTable.appendChild(tableBody);
      } else if (!tableBody.id) {
        // Nếu tbody tồn tại nhưng không có id
        console.log("Tìm thấy tbody nhưng không có id, thêm id");
        tableBody.id = 'userTableBody';
      }
      
      console.log("Đã đảm bảo phần tử tbody tồn tại với id='userTableBody'");
    } else {
      console.error("Không tìm thấy cả bảng datatable - không thể tạo tbody");
    }
  } else {
    console.log("Tìm thấy phần tử userTableBody trong DOM");
  }
  
  return tableBody;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM đã được tải hoàn tất");
  
  // Tìm hoặc tạo phần tử tbody cho bảng
  ensureTableBodyExists();
  
  // Lấy token từ localStorage hoặc sessionStorage
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
  
  // Kiểm tra nếu không có token thì chuyển hướng về trang đăng nhập
  if (!accessToken || accessToken === "your_access_token_here") {
    window.location.href = "../pages-login/pages-login.html";
    return;
  }
  
  // Lắng nghe sự kiện cho nút thêm nhân viên mới
  const saveUserBtn = document.getElementById('saveUserBtn');
  if (saveUserBtn) {
    saveUserBtn.addEventListener('click', addNewUser);
    console.log("Đã gắn sự kiện cho nút Thêm");
  } else {
    console.warn("Không tìm thấy nút 'saveUserBtn' - chức năng thêm nhân viên sẽ không hoạt động");
  }
  
  // Lắng nghe sự kiện mở modal thêm người dùng để tải danh sách phòng ban
  document.querySelector('[data-bs-target="#addUserModal"]').addEventListener('click', function() {
    loadDepartmentsToDropdown('userDepartment');
  });
  
  // Gọi API ngay lập tức, đã đảm bảo userTableBody tồn tại
  console.log("Bắt đầu gọi API lấy dữ liệu người dùng");
  fetchUsers();

  /**
   * Hàm gọi API lấy danh sách nhân viên
   */
  function fetchUsers() {
    // Đảm bảo rằng phần tử userTableBody tồn tại trước khi gọi API
    const tableBody = ensureTableBodyExists();
    if (!tableBody) {
      console.error("fetchUsers: Không thể tạo phần tử 'userTableBody' - bỏ qua việc gọi API");
      return; // Thoát khỏi hàm nếu không tạo được tableBody
    }
    
    console.log("Tiến hành gọi API lấy danh sách người dùng");
    
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    // Hiển thị trạng thái đang tải
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center"><i class="bi bi-hourglass-split me-2"></i>Đang tải dữ liệu...</td></tr>';
    
    fetch("http://localhost:3000/user", requestOptions)
      .then(response => response.json())
      .then(result => {
        // Kiểm tra lại tableBody vì có thể nó đã bị xóa trong thời gian API đang xử lý
        const updatedTableBody = document.getElementById('userTableBody');
        if (!updatedTableBody) {
          console.error("API trả về thành công nhưng không tìm thấy phần tử 'userTableBody'");
          return;
        }
        
        if (result.statusCode === 200 && result.data) {
          console.log("Dữ liệu người dùng:", result.data);
          populateTable(result.data);
        } else {
          console.error("Không thể lấy dữ liệu:", result.message);
          // Hiển thị thông báo lỗi
          updatedTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${result.message || "Lỗi không xác định"}</td></tr>`;
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        // Kiểm tra lại tableBody
        const updatedTableBody = document.getElementById('userTableBody');
        if (updatedTableBody) {
          updatedTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</td></tr>';
        } else {
          console.error("Không thể hiển thị lỗi vì không tìm thấy phần tử 'userTableBody'");
        }
      });
  }

  /**
   * Hiển thị danh sách nhân viên
   * @param {Array} users - Danh sách người dùng từ API
   */
  function populateTable(users) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) {
      console.error("Không tìm thấy phần tử 'userTableBody' trong DOM");
      return;
    }
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ
    
    if (!users || users.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="8" class="text-center">Không có nhân viên nào</td>
      `;
      tableBody.appendChild(emptyRow);
      return;
    }
    
    let index = 1;
    users.forEach(user => {
      // Định dạng ngày sinh
      const birthDate = new Date(user.birth_date);
      const formattedDate = `${String(birthDate.getDate()).padStart(2, '0')}/${String(birthDate.getMonth() + 1).padStart(2, '0')}/${birthDate.getFullYear()}`;
      
      // Chuyển đổi giới tính sang tiếng Việt để hiển thị
      const genderInVietnamese = user.gender === 'male' ? 'Nam' : 'Nữ';
      
      // Xác định class cho trạng thái
      let statusClass = '';
      let statusText = 'Không xác định';
      
      if (user.is_active) {
        statusClass = 'badge bg-success';
        statusText = 'Đang hoạt động';
      } else {
        statusClass = 'badge bg-danger';
        statusText = 'Không hoạt động';
      }
      
      // Xác định phòng ban
      let departmentName = 'Chưa phân công';
      if (user.department_id && typeof user.department_id === 'object') {
        departmentName = user.department_id.department || 'Không xác định';
      }
      
      // Xác định đánh giá sao
      let rateHTML = '';
      const rate = user.rate || 0;
      for (let i = 1; i <= 5; i++) {
        if (i <= rate) {
          rateHTML += '<i class="bi bi-star-fill text-warning"></i>';
        } else {
          rateHTML += '<i class="bi bi-star text-secondary"></i>';
        }
      }
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="text-center">${index}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td class="text-center"><span class="badge ${user.gender === 'male' ? 'gender-male' : 'gender-female'}">${genderInVietnamese}</span></td>
        <td>${departmentName}</td>
        <td>${user.role || 'Chưa phân công'}</td>
        <td class="text-center">${formattedDate}</td>
        <td class="text-center"><span class="${statusClass}">${statusText}</span></td>
        <td class="text-center">
          <button type="button" class="btn btn-info btn-sm btn-action me-1" data-bs-toggle="modal" data-bs-target="#viewModal-${user.id}" title="Xem chi tiết">
            <i class="bi bi-eye"></i>
          </button>
          <button type="button" class="btn btn-warning btn-sm btn-action me-1" data-bs-toggle="modal" data-bs-target="#editModal-${user.id}" onclick="loadDepartmentsToDropdown('department-${user.id}')" title="Chỉnh sửa">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm btn-action" data-bs-toggle="modal" data-bs-target="#deleteModal-${user.id}" title="Xóa">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
      index++;
      
      // Tạo các modal cho mỗi người dùng
      createUserModals(user);
    });
    
    // Khởi tạo lại DataTable sau khi thêm dữ liệu
    const dataTable = document.querySelector('.datatable');
    if (dataTable) {
      // Destroy datatable if it exists
      if (dataTable.classList.contains('dataTable-table')) {
        const oldTable = dataTable.dataTable;
        if (oldTable) {
          oldTable.destroy();
        }
      }
      // Initialize new datatable
      new simpleDatatables.DataTable(dataTable, {
        perPageSelect: [5, 10, 15, 20, 25],
        labels: {
          placeholder: "Tìm kiếm...",
          perPage: "{select} mục mỗi trang",
          noRows: "Không tìm thấy dữ liệu",
          info: "Hiển thị {start} đến {end} của {rows} mục",
        }
      });
    }
  }

  /**
   * Tạo các modal cho người dùng
   * @param {Object} user - Thông tin người dùng
   */
  function createUserModals(user) {
    // Chuyển đổi giới tính sang tiếng Việt để hiển thị
    const genderInVietnamese = user.gender === 'male' ? 'Nam' : 'Nữ';
    
    // Format date
    const birthDate = new Date(user.birth_date);
    const formattedDate = `${String(birthDate.getDate()).padStart(2, '0')}/${String(birthDate.getMonth() + 1).padStart(2, '0')}/${birthDate.getFullYear()}`;
    const isoDate = user.birth_date.split('T')[0]; // YYYY-MM-DD format for input[type=date]
    
    // Xác định phòng ban
    let departmentName = 'Chưa phân công';
    let departmentId = '';
    if (user.department_id && typeof user.department_id === 'object') {
      departmentName = user.department_id.department || 'Không xác định';
      departmentId = user.department_id.id;
    }
    
    // Xác định đánh giá sao
    let rateHTML = '';
    const rate = user.rate || 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        rateHTML += '<i class="bi bi-star-fill text-warning"></i>';
      } else {
        rateHTML += '<i class="bi bi-star text-secondary"></i>';
      }
    }
    
    // Container cho modals
    const dynamicModals = document.getElementById('dynamicModals');
    
    // Tạo modal xem chi tiết
    const viewModal = document.createElement('div');
    viewModal.className = 'modal fade';
    viewModal.id = `viewModal-${user.id}`;
    viewModal.tabIndex = '-1';
    viewModal.setAttribute('aria-labelledby', `viewModalLabel-${user.id}`);
    viewModal.setAttribute('aria-hidden', 'true');
    
    viewModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewModalLabel-${user.id}">Thông tin chi tiết: ${user.username}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Username:</div>
              <div class="col-sm-8">${user.username}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Email:</div>
              <div class="col-sm-8">${user.email}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Giới tính:</div>
              <div class="col-sm-8">${genderInVietnamese}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Phòng ban:</div>
              <div class="col-sm-8">${departmentName}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Vai trò:</div>
              <div class="col-sm-8">${user.role || 'Chưa phân công'}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Ngày sinh:</div>
              <div class="col-sm-8">${formattedDate}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Đánh giá:</div>
              <div class="col-sm-8">${rateHTML} (${user.rate || 0}/5)</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Trạng thái:</div>
              <div class="col-sm-8">${user.is_active ? 'Đang hoạt động' : 'Không hoạt động'}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Ngày tạo:</div>
              <div class="col-sm-8">${new Date(user.createdAt).toLocaleString('vi-VN')}</div>
            </div>
            <div class="row mb-3">
              <div class="col-sm-4 fw-bold">Cập nhật lần cuối:</div>
              <div class="col-sm-8">${new Date(user.updatedAt).toLocaleString('vi-VN')}</div>
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
    editModal.id = `editModal-${user.id}`;
    editModal.tabIndex = '-1';
    editModal.setAttribute('aria-labelledby', `editModalLabel-${user.id}`);
    editModal.setAttribute('aria-hidden', 'true');
    
    // Lấy danh sách phòng ban để hiển thị trong form chỉnh sửa
    let departmentOptions = `<option value="">-- Chọn phòng ban --</option>`;
    // TODO: Fetch departments from API and populate options
    // Tạm thời dùng một số phòng ban mẫu
    const departments = [
      { id: 1, name: 'Phòng phát triển' },
      { id: 2, name: 'Phòng marketing' },
      { id: 3, name: 'Phòng nhân sự' },
      { id: 4, name: 'Phòng tài chính' }
    ];
    departments.forEach(dept => {
      departmentOptions += `<option value="${dept.id}" ${departmentId == dept.id ? 'selected' : ''}>${dept.name}</option>`;
    });
    
    editModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel-${user.id}">Chỉnh sửa: ${user.username}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="editForm-${user.id}">
              <div class="mb-3">
                <label for="username-${user.id}" class="form-label">Username</label>
                <input type="text" class="form-control" id="username-${user.id}" value="${user.username}">
              </div>
              <div class="mb-3">
                <label for="email-${user.id}" class="form-label">Email</label>
                <input type="email" class="form-control" id="email-${user.id}" value="${user.email}">
              </div>
              <div class="mb-3">
                <label for="gender-${user.id}" class="form-label">Giới tính</label>
                <select class="form-select" id="gender-${user.id}">
                  <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Nam</option>
                  <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Nữ</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="department-${user.id}" class="form-label">Phòng ban</label>
                <select class="form-select" id="department-${user.id}" required>
                  <option value="">-- Chọn phòng ban --</option>
                  <!-- Phòng ban sẽ được nạp động từ API -->
                </select>
              </div>
              <div class="mb-3">
                <label for="role-${user.id}" class="form-label">Vai trò</label>
                <select class="form-select" id="role-${user.id}">
                  <option value="">-- Chọn vai trò --</option>
                  <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                  <option value="developer" ${user.role === 'developer' ? 'selected' : ''}>Developer</option>
                  <option value="tester" ${user.role === 'tester' ? 'selected' : ''}>Tester</option>
                  <option value="designer" ${user.role === 'designer' ? 'selected' : ''}>Designer</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="birthdate-${user.id}" class="form-label">Ngày sinh</label>
                <input type="date" class="form-control" id="birthdate-${user.id}" value="${isoDate}">
              </div>
              <div class="mb-3">
                <label for="password-${user.id}" class="form-label">Mật khẩu mới (không điền nếu không đổi)</label>
                <input type="password" class="form-control" id="password-${user.id}" placeholder="Điền mật khẩu mới nếu muốn thay đổi">
              </div>
              <div class="mb-3">
                <label for="rate-${user.id}" class="form-label">Đánh giá</label>
                <select class="form-select" id="rate-${user.id}">
                  <option value="1" ${user.rate == 1 ? 'selected' : ''}>1 sao</option>
                  <option value="2" ${user.rate == 2 ? 'selected' : ''}>2 sao</option>
                  <option value="3" ${user.rate == 3 ? 'selected' : ''}>3 sao</option>
                  <option value="4" ${user.rate == 4 ? 'selected' : ''}>4 sao</option>
                  <option value="5" ${user.rate == 5 ? 'selected' : ''}>5 sao</option>
                </select>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="active-${user.id}" ${user.is_active ? 'checked' : ''}>
                <label class="form-check-label" for="active-${user.id}">Đang hoạt động</label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" onclick="updateUser(${user.id})">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    `;
    
    // Tạo modal xóa
    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal fade';
    deleteModal.id = `deleteModal-${user.id}`;
    deleteModal.tabIndex = '-1';
    deleteModal.setAttribute('aria-labelledby', `deleteModalLabel-${user.id}`);
    deleteModal.setAttribute('aria-hidden', 'true');
    
    deleteModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel-${user.id}">Xác nhận xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>${user.username}</strong>?</p>
            <p class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger" onclick="deleteUser(${user.id})">Xóa</button>
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
   * Hàm cập nhật thông tin người dùng
   * @param {number} userId - ID của người dùng cần cập nhật
   */
  window.updateUser = function(userId) {
    const username = document.getElementById(`username-${userId}`).value;
    const email = document.getElementById(`email-${userId}`).value;
    const gender = document.getElementById(`gender-${userId}`).value;
    const department_id = document.getElementById(`department-${userId}`).value;
    const role = document.getElementById(`role-${userId}`).value;
    const birth_date = document.getElementById(`birthdate-${userId}`).value;
    const password = document.getElementById(`password-${userId}`).value;
    const rate = document.getElementById(`rate-${userId}`).value;
    const is_active = document.getElementById(`active-${userId}`).checked;
    
    if (!username || !email || !birth_date) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    // Chỉ bao gồm các trường có giá trị và đã thay đổi
    const userData = {
      "username": username,
      "email": email,
      "gender": gender,
      "birth_date": birth_date,
      "department_id": department_id || null,
      "role": role,
      "rate": parseInt(rate),
      "is_active": is_active
    };
    
    // Chỉ thêm mật khẩu nếu người dùng đã nhập
    if (password && password.trim() !== '') {
      userData.password = password;
    }
    
    const raw = JSON.stringify(userData);
    console.log('Dữ liệu cập nhật:', userData);
    
    const requestOptions = {
      method: "PATCH", // Sử dụng PATCH thay vì PUT theo đúng API yêu cầu
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/user/${userId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả cập nhật:', result);
        if (result.statusCode === 200) {
          alert('Cập nhật thông tin người dùng thành công!');
          // Đóng modal sau khi cập nhật
          const modal = document.getElementById(`editModal-${userId}`);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          
          // Tải lại dữ liệu bảng
          fetchUsers(); // Gọi lại API thay vì load lại trang
        } else {
          alert(`Lỗi: ${result.message || 'Không thể cập nhật người dùng'}`);
        }
      })
      .catch(error => {
        console.error('Lỗi khi cập nhật thông tin:', error);
        alert('Đã xảy ra lỗi khi cập nhật thông tin người dùng!');
      });
  };

  /**
   * Hàm xóa người dùng
   * @param {number} userId - ID của người dùng cần xóa
   */
  window.deleteUser = function(userId) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/user/${userId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả xóa:', result);
        if (result.statusCode === 200) {
          alert('Xóa người dùng thành công!');
          // Đóng modal sau khi xóa
          const modal = document.getElementById(`deleteModal-${userId}`);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          
          // Tải lại dữ liệu bảng
          fetchUsers(); // Gọi lại API thay vì load lại trang
        } else {
          alert(`Lỗi: ${result.message || 'Không thể xóa người dùng'}`);
        }
      })
      .catch(error => {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Đã xảy ra lỗi khi xóa người dùng!');
      });
  };

  /**
   * Hàm thêm người dùng mới
   */
  /**
   * Hàm nạp danh sách phòng ban vào dropdown
   * @param {string} selectElementId - ID của phần tử select cần nạp danh sách phòng ban
   */
  function loadDepartmentsToDropdown(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) {
      console.error(`Không tìm thấy phần tử select với ID: ${selectElementId}`);
      return;
    }
    
    // Xóa các options cũ trừ option đầu tiên
    while (selectElement.options.length > 1) {
      selectElement.remove(1);
    }
    
    // Thêm thông báo đang tải
    const loadingOption = document.createElement('option');
    loadingOption.text = 'Đang tải danh sách phòng ban...';
    loadingOption.disabled = true;
    selectElement.add(loadingOption);
    
    // Sử dụng API Helper từ phongban.js để lấy danh sách phòng ban
    if (window.departmentAPI && typeof window.departmentAPI.getAllDepartments === 'function') {
      window.departmentAPI.getAllDepartments(function(departments) {
        // Xóa option đang tải
        selectElement.remove(selectElement.options.length - 1);
        
        if (departments && departments.length > 0) {
          console.log('Lấy danh sách phòng ban thành công:', departments);
          
          // Thêm các phòng ban vào dropdown
          departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id; // Sử dụng ID thực tế của phòng ban
            option.text = dept.department;
            selectElement.add(option);
          });
        } else {
          console.error('Không thể lấy danh sách phòng ban hoặc danh sách trống');
          const errorOption = document.createElement('option');
          errorOption.text = 'Không thể tải danh sách phòng ban';
          errorOption.disabled = true;
          selectElement.add(errorOption);
        }
      });
    } else {
      console.error('Không tìm thấy departmentAPI.getAllDepartments. Hãy đảm bảo rằng phongban.js đã được nạp');
      // Xóa option đang tải và thêm thông báo lỗi
      selectElement.remove(selectElement.options.length - 1);
      const errorOption = document.createElement('option');
      errorOption.text = 'Không thể tải danh sách phòng ban';
      errorOption.disabled = true;
      selectElement.add(errorOption);
    }
  }
  
  /**
   * Hàm thêm người dùng mới
   */
  function addNewUser() {
    console.log('Đang thêm nhân viên mới...');
    
    // Lấy giá trị từ form
    const username = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const gender = document.getElementById('userGender').value;
    const department_id = document.getElementById('userDepartment').value;
    const role = document.getElementById('userRole').value;
    const birth_date = document.getElementById('userBirthDate').value;
    const password = document.getElementById('userPassword').value;
    const rate = document.getElementById('userRate').value;
    const is_active = document.getElementById('userActive').checked;
    
    // Validate form theo yêu cầu API
    if (!username || !email || !gender || !birth_date || !password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    if (!department_id) {
      alert('Vui lòng chọn phòng ban!');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Địa chỉ email không hợp lệ!');
      return;
    }
    
    // Validate password
    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    // Tạo dữ liệu người dùng tương ứng với API
    const userData = {
      "department_id": parseInt(department_id), // Chuyển đổi sang số nguyên vì API mong đợi ID dạng số
      "username": username,
      "email": email,
      "password": password,
      "gender": gender, // male hoặc female
      "birth_date": birth_date,
      "profile": "default-avatar.png", // Avatar mặc định
      "rate": parseInt(rate),
      "role": role,
      "is_active": is_active
    };
    
    console.log('Dữ liệu tạo người dùng:', userData);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(userData),
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/user", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả tạo người dùng:', result);
        if (result.statusCode === 201) {
          alert("Thêm nhân viên mới thành công!");
          // Đóng modal sau khi thêm
          const modal = document.getElementById('addUserModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          
          // Làm mới form
          document.getElementById('addUserForm').reset();
          
          // Tải lại dữ liệu bảng
          fetchUsers(); // Gọi lại API thay vì load lại trang
        } else {
          alert(`Lỗi: ${result.message || "Không thể thêm nhân viên mới"}`);
        }
      })
      .catch(error => {
        console.error("Lỗi khi thêm nhân viên:", error);
        alert("Đã xảy ra lỗi khi thêm nhân viên mới!");
      });
  }
});
