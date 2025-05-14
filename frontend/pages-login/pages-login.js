document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginButton = document.getElementById('loginButton');
  const errorMessage = document.getElementById('errorMessage');

  // Kiểm tra xem đã có token chưa, nếu có thì chuyển hướng đến trang chủ
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    window.location.href = 'index.html';
  }

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Vô hiệu hóa nút đăng nhập để tránh nhấp nhiều lần
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
    
    // Ẩn thông báo lỗi
    errorMessage.classList.add('d-none');
    
    // Lấy giá trị từ form
    const email = document.getElementById('yourEmail').value;
    const password = document.getElementById('yourPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Kiểm tra form
    let isValid = true;
    
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
    
    if (!isValid) {
      loginButton.disabled = false;
      loginButton.innerHTML = 'Đăng nhập';
      return;
    }
    
    // Chuẩn bị dữ liệu gửi đi
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "email": email,
      "password": password
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    // Gọi API đăng nhập
    fetch("http://localhost:3000/user/login", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          // Lưu token vào localStorage
          localStorage.setItem('accessToken', result.data.accessToken);
          
          // Lưu thông tin người dùng nếu cần
          if (rememberMe) {
            localStorage.setItem('userData', JSON.stringify(result.data.user));
          } else {
            // Nếu không ghi nhớ, lưu vào sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(result.data.user));
          }
          
          // Chuyển hướng đến trang chủ
          window.location.href = 'index.html';
        } else {
          // Hiển thị thông báo lỗi
          errorMessage.textContent = result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
          errorMessage.classList.remove('d-none');
          
          // Kích hoạt lại nút đăng nhập
          loginButton.disabled = false;
          loginButton.innerHTML = 'Đăng nhập';
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
        errorMessage.textContent = 'Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.';
        errorMessage.classList.remove('d-none');
        
        // Kích hoạt lại nút đăng nhập
        loginButton.disabled = false;
        loginButton.innerHTML = 'Đăng nhập';
      });
  });
});