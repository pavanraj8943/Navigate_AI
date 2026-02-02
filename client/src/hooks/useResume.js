// Custom hook for resume management
import { useState } from 'react';

export const useResume = () => {
  // TODO: Implement resume hook logic
  const [resumes, setResumes] = useState([]);

  return {
    resumes,
    setResumes
  };
};