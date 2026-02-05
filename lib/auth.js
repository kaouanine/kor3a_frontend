import axios from './axios';

export const refreshToken = async () => {
    try {
        const response = await axios.post('/api/refresh');

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            return response.data.access_token;
        }
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
    }
};