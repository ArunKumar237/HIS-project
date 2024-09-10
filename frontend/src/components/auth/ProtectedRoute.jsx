import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
