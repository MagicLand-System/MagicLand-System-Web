import api from './api'
export const addStudent = async (credential) => {
    const response = await api.post("/api/v1/students/add", credential);
    return response.data;
};