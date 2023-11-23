import api from "./apiUnlogin";

const classesAPI = {
  getClasses: () => api.get("/api/v1/classes"),
  searchClass: (keyWord) => api.get(`/api/v1/classes/filter?${keyWord}`),
};

export default classesAPI;
