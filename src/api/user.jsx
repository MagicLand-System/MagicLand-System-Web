import api from './api'
import apiUnlogin from "./apiUnlogin";

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
    const response = await apiUnlogin.get("/api/v1/users/getByPhone", {
        params: { phone }
    })
    return response.data;
};
export const getUserByName = async (name) => {
    const response = await apiUnlogin.get("/api/v1/users/getFromName", {
        params: { name }
    })
    return response.data;
};
export const getStudent = async (phone, classId) => {
    const response = await apiUnlogin.get("/api/v1/users/getStudent", {
        params: { phone, classId }
    });
    return response.data;
};