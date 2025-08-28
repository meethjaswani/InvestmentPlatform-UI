import api from './api';

export const investmentService = {
  getAll: async () => {
    const response = await api.get('/investments');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/investments/${id}`);
    return response.data;
  },

  create: async (investmentData) => {
    const response = await api.post('/investments', investmentData);
    return response.data;
  },

  update: async (id, investmentData) => {
    const response = await api.put(`/investments/${id}`, investmentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/investments/${id}`);
    return response.data;
  },
};
