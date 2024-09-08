import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

        axios.post('http://127.0.0.1:8000/api/user/reset-password/', { password: newPassword }, { params: { token: token, uid: uid } })
            .then(response => {
                setSuccess('Password has been reset successfully!');
                navigate('/login'); // Redirect to login page
            })
            .catch(error => {
                setError('Error resetting password');
            });
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
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
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default Reset;
