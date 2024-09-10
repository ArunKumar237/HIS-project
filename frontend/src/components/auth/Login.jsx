import { useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { decodeJwt } from 'jose';
import Heading from './Heading';
import { welcomeContext } from '../../App';


// Usage in a component
const Login = () => {
    const welcome = useContext(welcomeContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', username, password);
            const { access, refresh } = response.data;

            const redirect_to_unlock = decodeJwt(access).redirect_to_unlock
            console.log('redirect:', redirect_to_unlock, 'userid:', decodeJwt(access).user_id)

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            if (redirect_to_unlock) {
                // Redirect to unlock page if the flag is true
                navigate('/unlock');
            } else {
                // Redirect to the default page
                navigate('/home');
            }
        } catch (error) {
            setError('Error logging in:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        welcome.setWelcomeName(username);
        loginUser({ username, password });
    };

    return (
        <div>
            <div style={{ backgroundColor: "#3e5675" }} className="container-fluid min-vh-100">
                <Heading />
                <div className="row d-flex justify-content-center">
                    <div style={{ height: "30rem", backgroundColor: "#e3e3e3" }} className="col-6 rounded-4 shadow-lg">
                        <h3 className='text-center py-5'>Login</h3>
                        <form onSubmit={handleSubmit} className='border border-1 rounded d-flex flex-column align-items-center justify-content-center gap-3'>
                            <div className='d-flex gap-2'>
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    name='username'
                                    required
                                />
                            </div>
                            <div className='d-flex gap-2'>
                                <label htmlFor="password">&nbsp;Password:</label>
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
                            <button type="submit" className='px-3 py-1 rounded bg-primary text-white'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login
