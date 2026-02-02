// Resume Context
import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useResumeContext = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);

  return (
    <ResumeContext.Provider value={{ resumes, setResumes }}>
      {children}
    </ResumeContext.Provider>
  );
};