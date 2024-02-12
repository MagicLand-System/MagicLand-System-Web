import apiUnlogin from "./apiUnlogin";
import api from "./api";

const classesAPI = {
  getClasses: () => apiUnlogin.get("/api/v1/classes"),
  searchClass: (keyWord) => apiUnlogin.get(`/api/v1/classes/filter?${keyWord}`),
};

export const getClasses = async (credential) => {
  const response = await api.get("/api/v1/staff/classes", {
    params: credential
  });
  return response.data;
};
export const getClass = async (id) => {
  const response = await api.get(`/api/v1/staff/classes/${id}`);
  return response.data;
};
export const getStudentsOfClass = async (id) => {
  const response = await api.get(`/api/v1/classes/students/${id}`);
  return response.data;
};
export const getSessionOfClass = async (id) => {
  const response = await api.get(`/api/v1/classes/loadSession`, {
    params: {
      classId: id
    }
  });
  return response.data;
};
export const getRooms = async () => {
  const response = await api.get("/api/v1/rooms");
  return response.data;
};

export const getSlots = async () => {
  const response = await api.get("/api/v1/slots");
  return response.data;
};

export const getLecturer = async () => {
  const response = await api.get("/api/v1/users/getLecturer");
  return response.data;
};

export const addClass = async (credential) => {
  const response = await api.post("/api/v1/classes/add", credential);
  return response.data;
};

export const getClassCode = async (courseId) => {
  const response = await api.get("/api/v1/classes/autoCreate", {
    params: {
      courseId: courseId
    }
  });
  return response.data;
};

export const updateClass = async (id, credential) => {
  const response = await api.put(`/api/v1/classes/${id}/update`, credential);
  return response.data;
};
export const updateSession = async (id, credential) => {
  const response = await api.put(`/api/v1/classes/${id}/updateSession`, credential);
  return response.data;
};
export const getSuitableClass = async (credential) => {
  const response = await api.get(`/api/v1/classes/staff/change/suitable`, {
    params: credential
  });
  return response.data;
};
export const changeClass = async (credential) => {
  const response = await api.get(`/api/v1/classes/staff/change`, {
    params: credential
  });
  return response.data;
};
export const cancelClass = async (id) => {
  const response = await api.put(`/api/v1/classes/cancel/${id}`);
  return response.data;
};
export const getMakeUpClass = async (scheduleId) => {
  const response = await api.get(`/api/v1/classes/getMakeUpSchedule`, {
    params: {
      scheduleId
    }
  });
  return response.data;
};
export const arrangeMakeUpClass = async (scheduleId, studentId, makeUpScheduleId) => {
  const response = await api.put(`/api/v1/classes/${studentId}/${scheduleId}/makeup`, { scheduleId: makeUpScheduleId });
  return response.data;
};

export default classesAPI;
