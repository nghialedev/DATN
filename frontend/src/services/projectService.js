import api from './api';

const ProjectService = {
  getAllProjects: async () => {
    try {
      return await api.get('/project');
    } catch (error) {
      throw error;
    }
  },

  getProjectById: async (id) => {
    try {
      return await api.get(`/project/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      return await api.post('/project', projectData);
    } catch (error) {
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      return await api.patch(`/project/${id}`, projectData);
    } catch (error) {
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      return await api.delete(`/project/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Project User Assignment
  getUsersInProject: async (projectId) => {
    try {
      return await api.get(`/project-user?project_id=${projectId}`);
    } catch (error) {
      throw error;
    }
  },

  addUserToProject: async (projectId, userId) => {
    try {
      return await api.post('/project-user', { project_id: projectId, user_id: userId });
    } catch (error) {
      throw error;
    }
  },

  removeUserFromProject: async (assignmentId) => {
    try {
      return await api.delete(`/project-user/${assignmentId}`);
    } catch (error) {
      throw error;
    }
  }
};

export default ProjectService; 