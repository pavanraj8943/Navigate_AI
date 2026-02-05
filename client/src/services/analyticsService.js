import { api } from './api';

export const analyticsService = {
    getDashboardStats: () => api.get('/analytics/dashboard')
};
