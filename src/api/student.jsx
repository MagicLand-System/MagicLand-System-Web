import api from './api'
export const addStudent = async (credential) => {
    const response = await api.post("/api/v1/students/add", credential);
    return response.data;
};
export const getClasses = async ({ id, status }) => {
    const response = await api.get("/api/v1/students/getclass", {
        params: {
            studentId: id,
            status: status,
        }
    });
    return response.data;
};