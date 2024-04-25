import api from './api'

export const getStudents = async (name, birthdate) => {
    const response = await api.get("/api/v1/users/getStudentInfor", {
        params: { name, birthdate }
    });
    return response.data;
};
export const getStudent = async (id) => {
    const response = await api.get("/api/v1/users/getStudentInfor", {
        params: { id }
    });
    return response.data;
};
export const getClassOfStudent = async (studentId, status, searchString) => {
    const response = await api.get("/api/v1/users/getClassOfStudent", {
        params: { studentId, status, searchString }
    });
    return response.data;
};
export const getScheduleOfStudent = async (studentId, date) => {
    const response = await api.get("/api/v1/users/getScheduleOfStudent", {
        params: { studentId, date }
    });
    return response.data;
};
export const getSessionOfStudent = async (sessionId) => {
    const response = await api.get("/api/v1/users/getSessionOfStudent", {
        params: { sessionId }
    });
    return response.data;
};