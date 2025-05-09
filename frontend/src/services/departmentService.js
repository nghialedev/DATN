import api from './api';

const DepartmentService = {
  getAllDepartments: async () => {
    try {
      return await api.get('/departments');
    } catch (error) {
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      return await api.get(`/departments/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      return await api.post('/departments', departmentData);
    } catch (error) {
      throw error;
    }
  },

  updateDepartment: async (id, departmentData) => {
    try {
      return await api.patch(`/departments/${id}`, departmentData);
    } catch (error) {
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      return await api.delete(`/departments/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default DepartmentService; 