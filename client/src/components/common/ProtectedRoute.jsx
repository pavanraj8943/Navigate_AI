import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUserContext();

    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
