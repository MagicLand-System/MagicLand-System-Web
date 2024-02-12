import api from './api'
export const getAttendanceClasses = async (credential) => {
    const response = await api.get("api/v1/classes/loadClassForAttedance", {
        params: credential
    });
    return response.data;
};
export const getListAttendance = async (credential) => {
    const response = await api.get("api/v1/attendance/staff/load", {
        params: credential
    });
    return response.data;
};
export const takeAttendance = async (credential) => {
    const response = await api.post("api/v1/attendance/staff/takeAttandance", credential);
    return response.data;
};