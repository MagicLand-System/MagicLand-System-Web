import axios from "./index";

const courseApi = {
  getCourses: () => axios.get("/Courses"),
  searchCourse: (keyWord) => axios.get(`/Courses/search/filter?${keyWord}`),
  getCourse: (id) => axios.get(`${id}`),
  getClassesOfCourse: (id) => axios.get(`/classes/course/${id}`),
  // createUser: (userData) => axios.post('/users', userData),
  // getUser: (id) => axios.get(`/users/${id}`),
  // updateUser: (id, updateData) => axios.put(`/users/${id}`, updateData),
  // deleteUser: (id) => axios.delete(`/users/${id}`),
};

export default courseApi;
