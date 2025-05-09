import api from './api';

const UserService = {
  getAllUsers: async () => {
    try {
      return await api.get('/user');
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      return await api.get(`/user/${id}`);
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      return await api.patch(`/user/${id}`, userData);
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      return await api.delete(`/user/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default UserService; 