// src/axios.js
import axios from 'axios';

// Set up a default header for requests
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

export default axios;
