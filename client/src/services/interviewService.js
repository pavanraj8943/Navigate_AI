import { api } from './api';

export const interviewService = {
    startSession: (data) => api.post('/interview/start', data),
    submitAnswer: (sessionId, questionId, answer) =>
        api.post(`/interview/${sessionId}/answer`, { questionId, answer }),
    getSession: (id) => api.get(`/interview/${id}`),
    getSessions: () => api.get('/interview')
};
