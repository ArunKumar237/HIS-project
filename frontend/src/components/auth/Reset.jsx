import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Heading from './Heading';
import { API_BASE_URL } from '../../../config';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Reset = () => {
    const query = useQuery();
    const token = query.get('token');
    const uid = query.get('uid');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        axios.post(`${API_BASE_URL}/api/user/reset-password/`, { password: newPassword }, { params: { token: token, uid: uid } })
            .then(response => {
                setSuccess('Password has been reset successfully!');
                navigate('/'); // Redirect to login page
            })
            .catch(error => {
                setError('Error resetting password');
            });
    };

    return (
        <div style={{ backgroundColor: "#3e5675" }} className="container-fluid min-vh-100">
            <Heading />
            <div className="row d-flex justify-content-center">
                <div style={{ height: "30rem", backgroundColor: "#e3e3e3" }} className="col-6 rounded-4 shadow-lg">
                    <h3 className='text-center p-2'>Get reset link</h3>
                    <form onSubmit={handleSubmit} className='rounded h-50 d-flex flex-column align-items-center justify-content-center gap-3'>
                        <div className='d-flex gap-2'>
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='d-flex gap-2'>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div>{error}</div>}
                        {success && <div>{success}</div>}
                        <button type="submit" className='px-3 py-1 rounded bg-primary text-white'>Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reset;
