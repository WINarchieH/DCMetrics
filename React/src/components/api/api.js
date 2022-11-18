import axios from 'axios';

/**
 * URL of Express server.
 */

const api = axios.create({
    baseURL: process.env.REACT_APP_EXPRESS_URL,
    withCredentials: true               // Cookies are sent with every request
});

export default api;