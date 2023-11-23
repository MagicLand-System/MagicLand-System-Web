import api from "./apiUnlogin";

const courseApi = {
  getCourses: () => api.get("/api/v1/Courses"),
  searchCourse: (keyWord) => api.get(`/api/v1/Courses/search/filter?${keyWord}`),
  getCourse: (id) => api.get(`/api/v1/${id}`),
  getClassesOfCourse: (id) => api.get(`/api/v1/classes/course/${id}`),
  // createUser: (userData) => api.post('/api/v1/users', userData),
  // getUser: (id) => api.get(`/api/v1/users/${id}`),
  // updateUser: (id, updateData) => api.put(`/api/v1/users/${id}`, updateData),
  // deleteUser: (id) => api.delete(`/api/v1/users/${id}`),
};

export default courseApi;
