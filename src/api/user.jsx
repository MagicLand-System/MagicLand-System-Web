import api from './api'

export const getCurrentUser = async () => {
    const response = await api.get("/api/v1/users/getcurrentuser");
    return response.data;
};
export const getLecturerSchedule = async (credential) => {
    const response = await api.get("/api/v1/users/getByAdmin", {
        params: credential
    });
    return response.data;
};

export const getUserByPhone = async (phone) => {
    const response = await api.get("/api/v1/users/getByPhone", {
        params: { phone }
    })
    return response.data;
};
export const getUserByName = async (name) => {
    const response = await api.get("/api/v1/users/getFromName", {
        params: { name }
    })
    return response.data;
};
export const getStudent = async (phone, classId) => {
    const response = await api.get("/api/v1/users/getStudent", {
        params: { phone, classId }
    });
    return response.data;
};
export const getUsers = async (role, keyWord) => {
    const response = await api.get("/api/v1/users", {
        params: { role, keyWord }
    });
    return response.data;
};
export const addStaff = async (credential) => {
    const response = await api.post("/api/v1/users/add", credential);
    return response.data;
};
export const getLecturerCareer = async () => {
    const response = await api.get("/api/v1/lectures/career");
    return response.data;
};