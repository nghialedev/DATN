/**
 * Module quản lý User Story
 * Tương tác với API: http://localhost:3000/stories
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

// API Helper function cho module Story
window.storyAPI = {
  // 6.2. Lấy danh sách User Story (GET /stories)
  getAllStories: function(callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch('http://localhost:3000/stories', requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error('Không thể lấy danh sách user story:', result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API user story:', error);
        callback(null);
      });
  },
  
  // 6.3. Lấy thông tin chi tiết User Story (GET /stories/{id})
  getStoryById: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.statusCode === 200 && result.data) {
          callback(result.data);
        } else {
          console.error('Không thể lấy thông tin user story:', result.message);
          callback(null);
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API user story:', error);
        callback(null);
      });
  },
  
  // 6.1. Tạo User Story mới (POST /stories)
  createStory: function(storyData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(storyData),
      redirect: 'follow'
    };
    
    fetch('http://localhost:3000/stories', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả tạo user story:', result);
        if (result.statusCode === 200 || result.statusCode === 201) {
          callback(result.data, null);
        } else {
          callback(null, result.message || 'Không thể tạo user story mới');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API tạo user story:', error);
        callback(null, 'Lỗi kết nối đến máy chủ');
      });
  },
  
  // 6.4. Cập nhật thông tin User Story (PATCH /stories/{id})
  updateStory: function(id, storyData, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(storyData),
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả cập nhật user story:', result);
        if (result.statusCode === 200) {
          callback(result.data, null);
        } else {
          callback(null, result.message || 'Không thể cập nhật user story');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API cập nhật user story:', error);
        callback(null, 'Lỗi kết nối đến máy chủ');
      });
  },
  
  // Xóa User Story (DELETE /stories/{id})
  deleteStory: function(id, callback) {
    const headers = createHeaders();
    if (!headers) return;
    
    const requestOptions = {
      method: 'DELETE',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/stories/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Kết quả xóa user story:', result);
        if (result.statusCode === 200) {
          callback(true, null);
        } else {
          callback(false, result.message || 'Không thể xóa user story');
        }
      })
      .catch(error => {
        console.error('Lỗi khi gọi API xóa user story:', error);
        callback(false, 'Lỗi kết nối đến máy chủ');
      });
  }
};

// Các biến global
let storiesData = [];

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

// Tạo badge cho độ ưu tiên
function getPriorityBadge(priority) {
  switch(priority) {
    case 'high':
      return '<span class="badge bg-danger">Cao</span>';
    case 'medium':
      return '<span class="badge bg-warning text-dark">Trung bình</span>';
    case 'low':
      return '<span class="badge bg-success">Thấp</span>';
    default:
      return '<span class="badge bg-secondary">Không xác định</span>';
  }
}

// Tải danh sách User Story
function loadStories() {
  window.storyAPI.getAllStories(function(stories) {
    if (stories) {
      storiesData = stories;
      displayStories(stories);
    } else {
      document.getElementById('storyTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Không thể tải dữ liệu. Vui lòng thử lại sau.</td></tr>`;
    }
  });
}

// Hiển thị danh sách User Story trong bảng
function displayStories(stories) {
  const tableBody = document.getElementById('storyTableBody');
  if (!tableBody) {
    console.error('Không tìm thấy phần tử storyTableBody');
    return;
  }
  
  // Xóa dữ liệu cũ
  tableBody.innerHTML = '';
  
  // Kiểm tra nếu không có user story nào
  if (!stories || stories.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">Không có User Story nào</td></tr>`;
    return;
  }
  
  // Hiển thị dữ liệu user story
  stories.forEach((story, index) => {
    // Tạo phần tử tr
    const row = document.createElement('tr');
    
    // Cắt ngắn mô tả nếu quá dài
    const shortDesc = story.description && story.description.length > 50 
      ? story.description.substring(0, 50) + '...' 
      : (story.description || 'Không có mô tả');
    
    // Định dạng nội dung
    row.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>${story.title || 'Không có tiêu đề'}</td>
      <td>${shortDesc}</td>
      <td class="text-center">${story.story_point || 0}</td>
      <td class="text-center">${getPriorityBadge(story.priority)}</td>
      <td class="text-center">${formatDateTime(story.createdAt)}</td>
      <td class="text-center">
        <button class="btn btn-info btn-sm view-story" data-id="${story.id}">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm edit-story" data-id="${story.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm delete-story" data-id="${story.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    
    // Thêm vào tableBody
    tableBody.appendChild(row);
  });
  
  // Thêm event listener cho các nút
  attachStoryButtonListeners();
}

// Xem chi tiết User Story
function viewStoryDetail(id) {
  window.storyAPI.getStoryById(id, function(story) {
    if (story) {
      // Cập nhật nội dung modal
      document.getElementById('storyDetailTitle').textContent = story.title || 'Không có tiêu đề';
      document.getElementById('storyDetailDescription').textContent = story.description || 'Không có mô tả';
      document.getElementById('storyDetailStoryPoint').textContent = story.story_point || '0';
      document.getElementById('storyDetailPriority').innerHTML = getPriorityBadge(story.priority);
      document.getElementById('storyDetailCreatedAt').textContent = formatDateTime(story.createdAt);
      document.getElementById('storyDetailUpdatedAt').textContent = formatDateTime(story.updatedAt);
      
      // Hiển thị modal
      const modal = new bootstrap.Modal(document.getElementById('storyDetailModal'));
      modal.show();
    } else {
      alert('Không thể lấy thông tin user story. Vui lòng thử lại sau.');
    }
  });
}

// Chuẩn bị modal chỉnh sửa User Story
function prepareEditStory(id) {
  window.storyAPI.getStoryById(id, function(story) {
    if (story) {
      // Cập nhật giá trị các trường trong form
      document.getElementById('editStoryId').value = story.id;
      document.getElementById('editStoryTitle').value = story.title || '';
      document.getElementById('editStoryDescription').value = story.description || '';
      document.getElementById('editStoryPoint').value = story.story_point || 0;
      
      // Chọn đúng priority
      const prioritySelect = document.getElementById('editStoryPriority');
      for(let i = 0; i < prioritySelect.options.length; i++) {
        if (prioritySelect.options[i].value === story.priority) {
          prioritySelect.options[i].selected = true;
          break;
        }
      }
      
      // Hiển thị modal
      const modal = new bootstrap.Modal(document.getElementById('editStoryModal'));
      modal.show();
    } else {
      alert('Không thể lấy thông tin user story. Vui lòng thử lại sau.');
    }
  });
}

// Lưu thay đổi khi chỉnh sửa User Story
function saveEditStory() {
  // Lấy dữ liệu từ form
  const id = document.getElementById('editStoryId').value;
  const title = document.getElementById('editStoryTitle').value;
  const description = document.getElementById('editStoryDescription').value;
  const storyPoint = document.getElementById('editStoryPoint').value;
  const priority = document.getElementById('editStoryPriority').value;
  
  // Kiểm tra dữ liệu
  if (!title) {
    alert('Vui lòng nhập tiêu đề user story');
    return;
  }
  
  // Tạo đối tượng dữ liệu
  const storyData = {
    title: title,
    description: description,
    story_point: parseInt(storyPoint),
    priority: priority
  };
  
  // Gọi API cập nhật
  window.storyAPI.updateStory(id, storyData, function(data, error) {
    if (error) {
      alert(`Lỗi: ${error}`);
      return;
    }
    
    // Đóng modal
    const modalElement = document.getElementById('editStoryModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    // Thông báo thành công
    alert('Cập nhật user story thành công!');
    
    // Tải lại dữ liệu
    loadStories();
  });
}

// Tạo User Story mới
function createNewStory() {
  // Lấy dữ liệu từ form
  const title = document.getElementById('newStoryTitle').value;
  const description = document.getElementById('newStoryDescription').value;
  const storyPoint = document.getElementById('newStoryPoint').value;
  const priority = document.getElementById('newStoryPriority').value;
  
  // Kiểm tra dữ liệu
  if (!title) {
    alert('Vui lòng nhập tiêu đề user story');
    return;
  }
  
  // Tạo đối tượng dữ liệu
  const storyData = {
    title: title,
    description: description,
    story_point: parseInt(storyPoint),
    priority: priority
  };
  
  // Gọi API tạo mới
  window.storyAPI.createStory(storyData, function(data, error) {
    if (error) {
      alert(`Lỗi: ${error}`);
      return;
    }
    
    // Đóng modal
    const modalElement = document.getElementById('addStoryModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    // Reset form
    document.getElementById('addStoryForm').reset();
    
    // Thông báo thành công
    alert('Tạo user story mới thành công!');
    
    // Tải lại dữ liệu
    loadStories();
  });
}

// Xác nhận và xóa User Story
function confirmDeleteStory(id) {
  if (confirm('Bạn có chắc chắn muốn xóa user story này?')) {
    window.storyAPI.deleteStory(id, function(success, error) {
      if (error) {
        alert(`Lỗi: ${error}`);
        return;
      }
      
      // Thông báo thành công
      alert('Xóa user story thành công!');
      
      // Tải lại dữ liệu
      loadStories();
    });
  }
}

// Thêm event listener cho các nút trong bảng user story
function attachStoryButtonListeners() {
  // Event listener cho nút xem chi tiết
  document.querySelectorAll('.view-story').forEach(button => {
    button.addEventListener('click', function() {
      const storyId = this.getAttribute('data-id');
      viewStoryDetail(storyId);
    });
  });
  
  // Event listener cho nút chỉnh sửa
  document.querySelectorAll('.edit-story').forEach(button => {
    button.addEventListener('click', function() {
      const storyId = this.getAttribute('data-id');
      prepareEditStory(storyId);
    });
  });
  
  // Event listener cho nút xóa
  document.querySelectorAll('.delete-story').forEach(button => {
    button.addEventListener('click', function() {
      const storyId = this.getAttribute('data-id');
      confirmDeleteStory(storyId);
    });
  });
}

// Tìm kiếm user story
function searchStories() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  
  // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
  if (!searchTerm) {
    displayStories(storiesData);
    return;
  }
  
  // Tìm kiếm trong dữ liệu
  const searchResults = storiesData.filter(story => {
    return (
      (story.title && story.title.toLowerCase().includes(searchTerm)) ||
      (story.description && story.description.toLowerCase().includes(searchTerm))
    );
  });
  
  // Hiển thị kết quả tìm kiếm
  displayStories(searchResults);
}

// Lọc user story theo độ ưu tiên
function filterStories() {
  const priorityFilter = document.getElementById('priorityFilter').value;
  
  // Nếu không có filter nào được chọn, hiển thị tất cả
  if (!priorityFilter) {
    displayStories(storiesData);
    return;
  }
  
  // Lọc dữ liệu
  const filteredStories = storiesData.filter(story => {
    return story.priority === priorityFilter;
  });
  
  // Hiển thị kết quả lọc
  displayStories(filteredStories);
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
  loadStories();
  
  // Thêm event listener cho nút tạo story mới
  const addStoryButton = document.getElementById('addStoryButton');
  if (addStoryButton) {
    addStoryButton.addEventListener('click', createNewStory);
  }
  
  // Thêm event listener cho nút lưu chỉnh sửa
  const saveEditButton = document.getElementById('saveEditButton');
  if (saveEditButton) {
    saveEditButton.addEventListener('click', saveEditStory);
  }
  
  // Thêm event listener cho bộ lọc
  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter) {
    priorityFilter.addEventListener('change', filterStories);
  }
  
  // Thêm event listener cho tìm kiếm
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', searchStories);
  }
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchStories();
        e.preventDefault();
      }
    });
  }
});
