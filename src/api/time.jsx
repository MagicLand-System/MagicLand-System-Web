import api from './apiUnlogin'
export const getTime = async () => {
    const response = await api.get("/System/GetTime");
    return response.data;
};