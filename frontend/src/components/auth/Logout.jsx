import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the JWT token from localStorage
        localStorage.removeItem('access_token');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};
export default Logout
