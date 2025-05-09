import api from './api';

const TaskService = {
  getAllTasks: async () => {
    try {
      return await api.get('/tasks');
    } catch (error) {
      throw error;
    }
  },

  getTaskById: async (id) => {
    try {
      return await api.get(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      return await api.post('/tasks', taskData);
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      return await api.patch(`/tasks/${id}`, taskData);
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      return await api.delete(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // User Tasks
  getAllUserTasks: async () => {
    try {
      return await api.get('/user-tasks');
    } catch (error) {
      throw error;
    }
  },

  getUserTaskById: async (id) => {
    try {
      return await api.get(`/user-tasks/${id}`);
    } catch (error) {
      throw error;
    }
  },

  assignTaskToUser: async (userTaskData) => {
    try {
      return await api.post('/user-tasks', userTaskData);
    } catch (error) {
      throw error;
    }
  },

  updateUserTask: async (id, userTaskData) => {
    try {
      return await api.patch(`/user-tasks/${id}`, userTaskData);
    } catch (error) {
      throw error;
    }
  },

  removeTaskFromUser: async (id) => {
    try {
      return await api.delete(`/user-tasks/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Project Task Status
  getAllTaskStatuses: async () => {
    try {
      return await api.get('/project-task-status');
    } catch (error) {
      throw error;
    }
  },

  createTaskStatus: async (statusData) => {
    try {
      return await api.post('/project-task-status', statusData);
    } catch (error) {
      throw error;
    }
  },

  updateTaskStatus: async (id, statusData) => {
    try {
      return await api.patch(`/project-task-status/${id}`, statusData);
    } catch (error) {
      throw error;
    }
  },

  deleteTaskStatus: async (id) => {
    try {
      return await api.delete(`/project-task-status/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default TaskService; 