import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'

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
            const response = await axios.post('http://127.0.0.1:8000/api/user/change-password/', { email }, { headers: { 'Content-Type': 'application/json' } });
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
        <div>
            <h2>Get reset link</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
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
                <button type="submit">Create link</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}

export default Forget