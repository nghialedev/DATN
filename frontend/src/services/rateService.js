import api from './api';

const RateService = {
  getAllRates: async () => {
    try {
      return await api.get('/rate');
    } catch (error) {
      throw error;
    }
  },

  getUserRates: async () => {
    try {
      return await api.get('/rate/rate');
    } catch (error) {
      throw error;
    }
  },

  createRate: async (rateData) => {
    try {
      return await api.post('/rate', rateData);
    } catch (error) {
      throw error;
    }
  },

  updateRate: async (id, rateData) => {
    try {
      return await api.patch(`/rate/${id}`, rateData);
    } catch (error) {
      throw error;
    }
  },

  deleteRate: async (id) => {
    try {
      return await api.delete(`/rate/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default RateService; 