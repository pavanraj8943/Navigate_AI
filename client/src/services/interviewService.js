import { api } from './api';

export const interviewService = {
    startSession: (data) => api.post('/interview/start', data),
    submitAnswer: (sessionId, questionId, answer) =>
        api.post(`/interview/${sessionId}/answer`, { questionId, answer }),
    skipQuestion: (sessionId, questionId) =>
        api.post(`/interview/${sessionId}/skip`, { questionId }),
    getSession: (id) => api.get(`/interview/${id}`),
    getSessions: () => api.get('/interview')
};
