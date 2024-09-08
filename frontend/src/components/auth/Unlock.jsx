import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Unlock = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        new_password: '',
        confirm_password: '',
    });
    const [error, setError] = useState('');

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

        console.log('---->', username, password, new_password)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/unlock-account/', {
                username,
                password,
                new_password,
            });
            console.log('Form submitted successfully:', response.data);
            navigate('/login');
        } catch (error) {
            setError('Error submitting form:', error);
        }
    };

    return (
        <div>
            <h2>Unlock Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        name="username"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Old Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="new_password">New Password</label>
                    <input
                        type="password" // Change to password type
                        id="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        name="new_password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm_password">Confirm Password</label>
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
                <button type="submit">Unlock Account</button>
            </form>
        </div>
    );
};

export default Unlock;