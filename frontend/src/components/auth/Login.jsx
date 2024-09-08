import { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { decodeJwt } from 'jose';


// Usage in a component
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', username, password);
            const { access, refresh } = response.data;

            const redirect_to_unlock = decodeJwt(access).redirect_to_unlock
            console.log('redirect:', redirect_to_unlock)

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            if (redirect_to_unlock) {
                // Redirect to unlock page if the flag is true
                navigate('/unlock');
            } else {
                // Redirect to the default page
                navigate('/dashboard');
            }
        } catch (error) {
            setError('Error logging in:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({ username, password });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name='username'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name='password'
                        required
                    />
                </div>
                <div>
                    <Link to={'/forgot'}>Forgot password</Link>
                </div>
                {error && <div>{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login
