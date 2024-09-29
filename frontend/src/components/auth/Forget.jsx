import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import Heading from './Heading';
import { API_BASE_URL } from '../../../config';

const Forget = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email } = formData;
        console.log('email:', email)
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/change-password/`, { email }, { headers: { 'Content-Type': 'application/json' } });
            setMessage('Form submitted successfully, reset password sent to your registered mail');
        } catch (error) {
            if (error.response) {

                // Server responded with a status other than 200 range
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else happened in setting up the request
                console.error('Error message:', error.message);
            }
            // setError('Error submitting form:', error);
        }
    };

    return (
        <div style={{ backgroundColor: "#3e5675" }} className="container-fluid min-vh-100">
            <Heading />
            <div className="row d-flex justify-content-center">
                <div style={{ height: "30rem", backgroundColor: "#e3e3e3" }} className="col-6 rounded-4 shadow-lg">
                    <h3 className='text-center py-5'>Get reset link</h3>
                    <form onSubmit={handleSubmit} className='border border-1 rounded d-flex flex-column align-items-center justify-content-center gap-3'>
                        <div className='d-flex gap-2'>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                                required
                            />
                        </div>
                        {error && <div>{error}</div>}
                        <button type="submit" className='px-3 py-1 rounded bg-primary text-white'>Create link</button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forget