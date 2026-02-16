import React from 'react';

export const PageWrapper = ({ children }) => {
    return (
        <div className="animate-page-enter w-full">
            {children}
        </div>
    );
};
