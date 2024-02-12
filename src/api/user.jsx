import api from './api'
export const getCurrentUser = async () => {
    const response = await api.get("/api/v1/users/getcurrentuser");
    return response.data;
};