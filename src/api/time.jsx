import api from './apiUnlogin'
export const getTime = async () => {
    const response = await api.get("/getTime");
    return response.data;
};