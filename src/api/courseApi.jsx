import apiUnlogin from "./apiUnlogin";
import api from "./api";

const courseApi = {
  getCourses: () => apiUnlogin.get("/api/v1/courses"),
  searchCourse: (keyWord) => apiUnlogin.get(`/api/v1/courses/search/filter?${keyWord}`),
  getCourse: (id) => apiUnlogin.get(`/api/v1/${id}`),
  getClassesOfCourse: (id) => apiUnlogin.get(`/api/v1/classes/course/${id}`),
  // createUser: (userData) => apiUnlogin.post('/api/v1/users', userData),
  // getUser: (id) => apiUnlogin.get(`/api/v1/users/${id}`),
  // updateUser: (id, updateData) => apiUnlogin.put(`/api/v1/users/${id}`, updateData),
  // deleteUser: (id) => apiUnlogin.delete(`/api/v1/users/${id}`),
};

export const getCourses = async () => {
  const response = await api.get("/api/v1/courses");
  return response.data;
};
export const getSubjects = async () => {
  const response = await api.get("/api/v1/courses/categories");
  return response.data;
};
export const searchCourses = async (keyWord) => {
  const response = await api.get("/api/v1/courses/search", {
    params: {
      keyWord: keyWord
    }
  });
  return response.data;
};



export default courseApi;
