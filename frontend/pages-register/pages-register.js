document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const registerButton = document.getElementById('registerButton');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const departmentSelect = document.getElementById('yourDepartment');

  // Kiểm tra xem đã có token chưa, nếu có thì chuyển hướng đến trang chủ
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (accessToken) {
    window.location.href = 'index.html';
  }

  // Lấy danh sách phòng ban
  fetchDepartments();

  // Hàm lấy danh sách phòng ban
  function fetchDepartments() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/departments", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          // Thêm các phòng ban vào dropdown
          result.data.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.department;
            departmentSelect.appendChild(option);
          });
        } else {
          console.error("Không thể lấy danh sách phòng ban:", result.message);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API phòng ban:", error);
      });
  }

  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Vô hiệu hóa nút đăng ký để tránh nhấp nhiều lần
    registerButton.disabled = true;
    registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
    
    // Ẩn thông báo lỗi và thành công
    errorMessage.classList.add('d-none');
    successMessage.classList.add('d-none');
    
    // Lấy giá trị từ form
    const username = document.getElementById('yourName').value;
    const email = document.getElementById('yourEmail').value;
    const password = document.getElementById('yourPassword').value;
    const gender = document.getElementById('yourGender').value;
    const birth_date = document.getElementById('yourBirthDate').value;
    const department_id = parseInt(document.getElementById('yourDepartment').value);
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Kiểm tra form
    let isValid = true;
    
    if (!username) {
      document.getElementById('yourName').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourName').classList.remove('is-invalid');
    }
    
    if (!email) {
      document.getElementById('yourEmail').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourEmail').classList.remove('is-invalid');
    }
    
    if (!password) {
      document.getElementById('yourPassword').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourPassword').classList.remove('is-invalid');
    }
    
    if (!gender) {
      document.getElementById('yourGender').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourGender').classList.remove('is-invalid');
    }
    
    if (!birth_date) {
      document.getElementById('yourBirthDate').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourBirthDate').classList.remove('is-invalid');
    }
    
    if (!department_id) {
      document.getElementById('yourDepartment').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('yourDepartment').classList.remove('is-invalid');
    }
    
    if (!acceptTerms) {
      document.getElementById('acceptTerms').classList.add('is-invalid');
      isValid = false;
    } else {
      document.getElementById('acceptTerms').classList.remove('is-invalid');
    }
    
    if (!isValid) {
      registerButton.disabled = false;
      registerButton.innerHTML = 'Tạo tài khoản';
      return;
    }
    
    // Chuẩn bị dữ liệu gửi đi
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "department_id": department_id,
      "username": username,
      "email": email,
      "password": password,
      "gender": gender,
      "birth_date": birth_date,
      "profile": "default-avatar.png",
      "rate": 5
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    // Gọi API đăng ký
    fetch("http://localhost:3000/user", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 201) {
          // Hiển thị thông báo thành công
          successMessage.classList.remove('d-none');
          
          // Lưu token vào localStorage
          localStorage.setItem('accessToken', result.data.accessToken);
          
          // Lưu thông tin người dùng
          localStorage.setItem('userData', JSON.stringify(result.data.newUser));
          
          // Chuyển hướng đến trang đăng nhập sau 2 giây
          setTimeout(function() {
            window.location.href = 'pages-login.html';
          }, 2000);
        } else {
          // Hiển thị thông báo lỗi
          errorMessage.textContent = result.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
          errorMessage.classList.remove('d-none');
          
          // Kích hoạt lại nút đăng ký
          registerButton.disabled = false;
          registerButton.innerHTML = 'Tạo tài khoản';
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
        errorMessage.textContent = 'Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.';
        errorMessage.classList.remove('d-none');
        
        // Kích hoạt lại nút đăng ký
        registerButton.disabled = false;
        registerButton.innerHTML = 'Tạo tài khoản';
      });
  });
});