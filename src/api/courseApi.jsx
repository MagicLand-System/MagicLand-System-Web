import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/api/v1/courses");
  return response.data;
};
export const getCourse = async (id) => {
  const response = await api.get("/api/v1/courses/staff/get", {
    params: {
      id: id
    }
  });
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
export const addCourse = async (credential) => {
  const response = await api.post("/api/v1/courses/add", credential);
  return response.data;
};
export const updateCourse = async (id, credential) => {
  // const response = await api.post("/api/v1/courses/add", credential);
  // return response.data;
};
export const getCoursePrices = async (courseId) => {
  const response = await api.get("/api/v1/courses/getCoursePrice", {
    params: {
      courseId
    }
  });
  return response.data;
};
export const updateCoursePrice = async (credential) => {
  const response = await api.post("/api/v1/courses/addPrice", credential);
  return response.data;
};