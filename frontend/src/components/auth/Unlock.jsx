import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';

const Unlock = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        new_password: '',
        confirm_password: '',
    });
    const [error, setError] = useState('');
    const token = localStorage.getItem('access_token')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, new_password, confirm_password } = formData;

        if (new_password !== confirm_password) {
            setError('New password and confirm password do not match');
            return;
        }
        console.log('---->', username, password, new_password, token)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/unlock-account/', {
                username,
                password,
                new_password,
                token
            }, {
                headers: {}
            });
            console.log('Form submitted successfully:', response.data);
            navigate('/');
        } catch (error) {
            setError('Error submitting form:', error);
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: "#3e5675" }} className="container-fluid min-vh-100">
                <Heading />
                <div className="row d-flex justify-content-center">
                    <div style={{ height: "30rem", backgroundColor: "#e3e3e3" }} className="col-6 rounded-4 shadow-lg">
                        <h2 className='text-center py-5'>Unlock Account</h2>
                        <form onSubmit={handleSubmit} className='border border-1 rounded d-flex flex-column align-items-center justify-content-center gap-3'>
                            <div className='d-flex gap-2'>
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    name="username"
                                    required
                                />
                            </div>
                            <div className='d-flex gap-2'>
                                <label htmlFor="password">Default Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    name="password"
                                    required
                                />
                            </div>
                            <div className='d-flex gap-2'>
                                <label htmlFor="new_password">New Password:</label>
                                <input
                                    type="password" // Change to password type
                                    id="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    name="new_password"
                                    required
                                />
                            </div>
                            <div className='d-flex gap-2'>
                                <label htmlFor="confirm_password">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    value={formData.error} // typo - should be formData.confirm_password
                                    onChange={handleChange}
                                    name="confirm_password"
                                    required
                                />
                            </div>
                            {error && <div>{error}</div>}
                            <button type="submit" className='px-3 py-1 rounded bg-primary text-white'>Unlock Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unlock;