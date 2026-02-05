import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        loadUser();
    }, []);

    // Get CSRF cookie for SPA authentication
    const csrf = async () => {
         await axios.get('/sanctum/csrf-cookie');
    };

    // Register function
    const register = async ({ name, email, password, password_confirmation }) => {
        try {
            await csrf();
            console.log(await csrf())
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation,
            }, {
                withCredentials: true
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                router.push('/dashboard');
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    // Login function
    const login = async ({ email, password }) => {
        try {
            await csrf();

            const response = await axios.post('/api/login', {
                email,
                password,
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                router.push('/dashboard');
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/login');
        }
    };

    // Get current user from API
    const getUser = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        getUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};