import http from './http';

export const loginApi = async (payload) => {
    const res = await http.post('/auth/login', payload);
    return res.data;
};

