import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/api/v1/staff/courses");
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
  const response = await api.get("/api/v1/staff/courses/search", {
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
  const response = await api.put(`/api/v1/courses/${id}/updateCourse`, credential);
  return response.data;
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
export const getCoursesForRegister = async (searchString, categoryIds, minAge, MaxAge) => {
  const params = {
    searchString,
    minAge,
    MaxAge
  };
  if (categoryIds.length > 0) {
    categoryIds.forEach((id, index) => {
      params[`categoryIds[${index}]`] = id;
    });
  }
  const response = await api.get("/api/v1/courses/staff/getCourse", { params });
  return response.data;
}
export const getCourseClasses = async (courseId, dateOfWeeks, slotId, method) => {
  const params = {
    courseId,
    method
  };
  if (dateOfWeeks.length > 0) {
    dateOfWeeks.forEach((date, index) => {
      params[`dateOfWeeks[${index}]`] = date;
    });
  }
  if (slotId.length > 0) {
    slotId.forEach((slot, index) => {
      params[`slotId[${index}]`] = slot;
    });
  }
  const response = await api.get(`/api/v1/courses/staff/getClass`, { params });
  return response.data;
};
export const cashCheckout = async (credential) => {
  const response = await api.post("/api/v1/walletTransactions/staff/checkout", credential);
  return response.data;
};