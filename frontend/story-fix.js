// API Helper function để các module khác có thể truy cập dữ liệu user story
window.storyAPI = {
  // Lấy danh sách user story
  getAllStories: function(callback) {
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
    
    fetch("http://localhost:3000/stories", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error("Không thể lấy danh sách user story:", result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API user story:", error);
        callback(null);
      });
  },
  
  // Lấy thông tin user story theo ID
  getStoryById: function(id, callback) {
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
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error(`Không thể lấy thông tin user story với ID ${id}:`, result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API user story:", error);
        callback(null);
      });
  },
  
  // Thêm user story mới
  addStory: function(storyData, callback) {
    const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
    if (!accessToken || accessToken === "your_access_token_here") {
      console.error("Không tìm thấy access token");
      callback(null);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(storyData),
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/stories", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 201 && result.data) {
          callback(result.data);
        } else {
          console.error("Không thể thêm user story:", result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API user story:", error);
        callback(null);
      });
  },
  
  // Cập nhật user story
  updateStory: function(id, storyData, callback) {
    const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
    if (!accessToken || accessToken === "your_access_token_here") {
      console.error("Không tìm thấy access token");
      callback(null);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(storyData),
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          callback(true, result.message);
        } else {
          console.error(`Không thể cập nhật user story với ID ${id}:`, result.message);
          callback(false, result.message);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API user story:", error);
        callback(false, error.message);
      });
  },
  
  // Xóa user story
  deleteStory: function(id, callback) {
    const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
    if (!accessToken || accessToken === "your_access_token_here") {
      console.error("Không tìm thấy access token");
      callback(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200) {
          callback(true, result.message);
        } else {
          console.error(`Không thể xóa user story với ID ${id}:`, result.message);
          callback(false, result.message);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API user story:", error);
        callback(false, error.message);
      });
  }
};

// Khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
  // Lấy token từ localStorage hoặc sessionStorage
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || "your_access_token_here";
  
  // Kiểm tra nếu không có token thì chuyển hướng về trang đăng nhập
  if (!accessToken || accessToken === "your_access_token_here") {
    window.location.href = "../pages-login/pages-login.html";
    return;
  }
  
  // Hiển thị thông tin người dùng đăng nhập
  displayUserInfo();
  
  // Lấy danh sách user story
  fetchStories();
  
  // Hàm hiển thị thông tin người dùng đăng nhập
  function displayUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || sessionStorage.getItem('userData') || '{}');
    if (userData && userData.username) {
      document.getElementById('userFullName').textContent = userData.username;
      document.getElementById('userFullNameMenu').textContent = userData.username;
      document.getElementById('userRoleMenu').textContent = userData.role || 'User';
    }
  }
  
  // Lấy danh sách user story
  function fetchStories() {
    window.storyAPI.getAllStories(function(stories) {
      if (stories) {
        populateTable(stories);
      } else {
        const tableBody = document.getElementById('storyTableBody');
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.</td></tr>';
      }
    });
  }

  // Hiển thị danh sách User Story lên bảng
  function populateTable(stories) {
    const tableBody = document.getElementById('storyTableBody');
    tableBody.innerHTML = '';
    
    if (stories.length === 0) {
      // Hiển thị thông báo khi không có dữ liệu
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="7" class="text-center">Không có User Story nào</td>
      `;
      tableBody.appendChild(emptyRow);
      return;
    }
    
    stories.forEach(story => {
      const row = document.createElement('tr');
      
      // Hiển thị priority dưới dạng badge
      let priorityBadge = '';
      switch(story.priority) {
        case 'low':
          priorityBadge = '<span class="badge bg-success">Thấp</span>';
          break;
        case 'medium':
          priorityBadge = '<span class="badge bg-warning">Trung bình</span>';
          break;
        case 'high':
          priorityBadge = '<span class="badge bg-danger">Cao</span>';
          break;
        default:
          priorityBadge = '<span class="badge bg-secondary">Không xác định</span>';
      }
      
      // Format ngày tháng
      const createdDate = new Date(story.createdAt);
      const formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
      
      row.innerHTML = `
        <td class="text-center">${story.id}</td>
        <td>${story.title}</td>
        <td>${story.story_point || 0}</td>
        <td class="text-center">${priorityBadge}</td>
        <td class="text-center">${formattedDate}</td>
        <td class="text-center">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-primary btn-sm" onclick="window.viewStoryDetail(${story.id})" title="Xem chi tiết">
              <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-warning btn-sm" onclick="window.editStory(${story.id})" title="Chỉnh sửa">
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm" onclick="window.confirmDeleteStory(${story.id})" title="Xóa">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
  }

  // Xem chi tiết User Story
  window.viewStoryDetail = function(id) {
    window.storyAPI.getStoryById(id, function(story) {
      if (story) {
        // Hiển thị priority dưới dạng badge
        let priorityBadge = '';
        switch(story.priority) {
          case 'low':
            priorityBadge = '<span class="badge bg-success">Thấp</span>';
            break;
          case 'medium':
            priorityBadge = '<span class="badge bg-warning">Trung bình</span>';
            break;
          case 'high':
            priorityBadge = '<span class="badge bg-danger">Cao</span>';
            break;
          default:
            priorityBadge = '<span class="badge bg-secondary">Không xác định</span>';
        }
        
        // Format ngày tháng
        const createdDate = new Date(story.createdAt);
        const formattedCreatedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
        
        const updatedDate = new Date(story.updatedAt);
        const formattedUpdatedDate = `${updatedDate.getDate()}/${updatedDate.getMonth() + 1}/${updatedDate.getFullYear()}`;
        
        // Hiển thị nội dung chi tiết
        document.getElementById('viewStoryTitle').textContent = story.title;
        document.getElementById('viewStoryDescription').textContent = story.description || 'Không có mô tả';
        document.getElementById('viewStoryPoint').textContent = story.story_point || 0;
        document.getElementById('viewStoryPriority').innerHTML = priorityBadge;
        document.getElementById('viewStoryCreatedAt').textContent = formattedCreatedDate;
        document.getElementById('viewStoryUpdatedAt').textContent = formattedUpdatedDate;
        
        // Hiển thị modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewStoryModal'));
        viewModal.show();
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert(`Lỗi khi lấy thông tin chi tiết: ${error.message}`);
      }
    });
  }
  
  // Thêm User Story mới
  document.getElementById('saveStoryBtn').addEventListener('click', function() {
    // Lấy dữ liệu từ form
    const title = document.getElementById('storyTitle').value.trim();
    const description = document.getElementById('storyDescription').value.trim();
    const storyPoint = parseInt(document.getElementById('storyPoint').value) || 1;
    const priority = document.getElementById('storyPriority').value;
    
    // Kiểm tra dữ liệu nhập vào
    if (!title) {
      alert('Vui lòng nhập tiêu đề User Story!');
      return;
    }
    
    if (!description) {
      alert('Vui lòng nhập mô tả User Story!');
      return;
    }
    
    if (storyPoint < 1) {
      alert('Story Point phải là số nguyên dương!');
      return;
    }
    
    // Tạo đối tượng User Story mới
    const newStory = {
      title: title,
      description: description,
      story_point: storyPoint,
      priority: priority
    };
    
    // Gọi API để thêm User Story mới
    window.storyAPI.addStory(newStory, function(addedStory) {
      if (addedStory) {
        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStoryModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('addStoryForm').reset();
        
        // Cập nhật lại bảng
        fetchStories();
        
        // Hiển thị thông báo thành công
        alert('Thêm User Story thành công!');
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert("Đã xảy ra lỗi khi thêm User Story: " + error.message);
      }
    });
  });
  
  // Sửa User Story
  window.editStory = function(id) {
    window.storyAPI.getStoryById(id, function(story) {
      if (story) {
        // Điền dữ liệu vào form
        document.getElementById('editStoryId').value = story.id;
        document.getElementById('editStoryTitle').value = story.title;
        document.getElementById('editStoryDescription').value = story.description || '';
        document.getElementById('editStoryPoint').value = story.story_point || 1;
        document.getElementById('editStoryPriority').value = story.priority || 'low';
        
        // Hiển thị modal
        const editModal = new bootstrap.Modal(document.getElementById('editStoryModal'));
        editModal.show();
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert(`Lỗi khi lấy thông tin chi tiết: ${error.message}`);
      }
    });
  }
  
  // Cập nhật User Story
  document.getElementById('updateStoryBtn').addEventListener('click', function() {
    // Lấy dữ liệu từ form
    const storyId = document.getElementById('editStoryId').value;
    const title = document.getElementById('editStoryTitle').value.trim();
    const description = document.getElementById('editStoryDescription').value.trim();
    const storyPoint = parseInt(document.getElementById('editStoryPoint').value) || 1;
    const priority = document.getElementById('editStoryPriority').value;
    
    // Kiểm tra dữ liệu nhập vào
    if (!title) {
      alert('Vui lòng nhập tiêu đề User Story!');
      return;
    }
    
    if (!description) {
      alert('Vui lòng nhập mô tả User Story!');
      return;
    }
    
    if (storyPoint < 1) {
      alert('Story Point phải là số nguyên dương!');
      return;
    }
    
    // Tạo đối tượng User Story cập nhật
    const updatedStory = {
      title: title,
      description: description,
      story_point: storyPoint,
      priority: priority
    };
    
    // Gọi API để cập nhật User Story
    window.storyAPI.updateStory(storyId, updatedStory, function(success, message) {
      if (success) {
        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editStoryModal'));
        modal.hide();
        
        // Cập nhật lại bảng
        fetchStories();
        
        // Hiển thị thông báo thành công
        alert('Cập nhật User Story thành công!');
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert("Đã xảy ra lỗi khi cập nhật User Story: " + error.message);
      }
    });
  });
  
  // Xác nhận xóa User Story
  window.confirmDeleteStory = function(id) {
    window.storyAPI.getStoryById(id, function(story) {
      if (story) {
        // Điền dữ liệu vào modal xác nhận
        document.getElementById('deleteStoryId').value = story.id;
        document.getElementById('deleteStoryTitle').textContent = story.title;
        
        // Hiển thị modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteStoryModal'));
        deleteModal.show();
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert(`Lỗi khi lấy thông tin chi tiết: ${error.message}`);
      }
    });
  }
  
  // Xóa User Story
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    const storyId = document.getElementById('deleteStoryId').value;
    
    window.storyAPI.deleteStory(storyId, function(success, message) {
      if (success) {
        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteStoryModal'));
        modal.hide();
        
        // Cập nhật lại bảng
        fetchStories();
        
        // Hiển thị thông báo thành công
        alert('Xóa User Story thành công!');
      } else {
        console.error("Lỗi khi gọi API:", error.message);
        alert("Đã xảy ra lỗi khi xóa User Story: " + message);
      }
    });
  });
  
  // Sự kiện đăng xuất
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = "../pages-login/pages-login.html";
  });
  
  // Khởi tạo trang - đảm bảo chạy sau khi DOM đã tải xong
  setTimeout(fetchStories, 100);
});
