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
export const getClassOfStudent = async (studentId, status, searchString, dateTime) => {
    const response = await api.get("/api/v1/users/getClassOfStudent", {
        params: { studentId, status, searchString, dateTime }
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
export const getMakeUpClass = async (credential) => {
    const response = await api.get(`/api/v1/classes/getMakeUpSchedule`, {
        params: credential
    });
    return response.data;
};
export const arrangeMakeUpClass = async (scheduleId, studentId, makeUpScheduleId) => {
    const response = await api.put(`/api/v1/classes/${studentId}/${scheduleId}/makeup`, { scheduleId: makeUpScheduleId });
    return response.data;
};
export const setNotMakeUp = async (scheduleId, studentId) => {
    const response = await api.put(`/api/v1/classes/${scheduleId}/${studentId}/setStatusNotCanMakeUp`);
    return response.data;
};
export const getListMakeUpStudent = async (search, dateOfBirth) => {
    const response = await api.get(`/api/v1/classes/getListCanNotMakeUp`, {
        params: { search, dateOfBirth }
    });
    return response.data;
};
export const setReserve = async (classId, studentId) => {
    console.log(classId, studentId)
    const response = await api.put(`/api/v1/classes/${classId}/${studentId}/SaveCouse`);
    return response.data;
};
export const getListReserve = async (search, dateOfBirth) => {
    const response = await api.get(`/api/v1/classes/getListSavedCourse`, {
        params: { search, dateOfBirth }
    });
    return response.data;
};
export const getSuitableReserveClass = async (courseId, studentId) => {
    const response = await api.get(`/api/v1/classes/getClassToRegister`, {
        params: { courseId, studentId }
    });
    return response.data;
};
export const addStudentToClass = async (courseId, classId, studentId) => {
    const response = await api.get(`/api/v1/staff/courses/registerSaved`, {
        params: {
            courseId,
            classId,
            studentId
        }
    });
    return response.data;
};