import api from './api';

const StoryService = {
  getAllStories: async () => {
    try {
      return await api.get('/stories');
    } catch (error) {
      throw error;
    }
  },

  getStoryById: async (id) => {
    try {
      return await api.get(`/stories/${id}`);
    } catch (error) {
      throw error;
    }
  },

  createStory: async (storyData) => {
    try {
      return await api.post('/stories', storyData);
    } catch (error) {
      throw error;
    }
  },

  updateStory: async (id, storyData) => {
    try {
      return await api.patch(`/stories/${id}`, storyData);
    } catch (error) {
      throw error;
    }
  },

  deleteStory: async (id) => {
    try {
      return await api.delete(`/stories/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default StoryService; 