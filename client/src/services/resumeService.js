import { api } from './api';

export const resumeService = {
    uploadResume: (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.upload('/resume/upload', formData);
    },
    getResumes: () => api.get('/resume'),
    checkAlignment: (targetRole) => api.post('/resume/alignment', { targetRole })
};
