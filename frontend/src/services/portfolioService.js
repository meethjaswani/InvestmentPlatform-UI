import api from './api';

export const portfolioService = {
  getOverview: async () => {
    const response = await api.get('/portfolio');
    // Extract summary from the portfolio response
    return response.data.summary || {};
  },

  getAllocation: async () => {
    const response = await api.get('/portfolio');
    // Extract allocation data from portfolio response
    const investments = response.data.investments || [];
    
    // Group by investment type
    const allocationMap = {};
    let totalValue = 0;
    
    investments.forEach(investment => {
      const type = investment.type || 'unknown';
      const value = investment.currentValue || 0;
      
      if (!allocationMap[type]) {
        allocationMap[type] = { type, value: 0, count: 0 };
      }
      
      allocationMap[type].value += value;
      allocationMap[type].count += 1;
      totalValue += value;
    });
    
    // Convert to array and calculate percentages
    const allocation = Object.values(allocationMap).map(item => ({
      ...item,
      percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0
    }));
    
    return allocation;
  },

  getPortfolio: async (params = {}) => {
    const response = await api.get('/portfolio', { params });
    return response.data;
  },

  getPerformance: async (period = '1M') => {
    const response = await api.get('/portfolio/performance', { 
      params: { period } 
    });
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  getTransactionsByInvestment: async (investmentId) => {
    const response = await api.get(`/transactions/investment/${investmentId}`);
    return response.data;
  },
};
