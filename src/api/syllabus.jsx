import api from "./api";
export const searchSyllabuses = async (keyWord) => {
  const response = await api.get("/api/v1/Syllabus/filter", {
    params: {
      keyWords: [keyWord]
    }
  });
  return response.data;
};
export const importSyllabus = async (credential) => {
  const response = await api.post("/api/v1/Syllabus/insertSyllabus", credential);
  return response.data;
};
export const getSyllabus = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/${id}/staff/get`);
  return response.data;
};
export const getAvailableSyllabuses = async () => {
  const response = await api.get(`/api/v1/Syllabus/available`);
  return response.data;
};
export const updateSyllabus = async (id, credential) => {
  const response = await api.put(`/api/v1/Syllabus/${id}/update`, credential);
  return response.data;
};
export const updateSyllabusGeneral = async (id, credential) => {
  const response = await api.put(`/api/v1/Syllabus/${id}/updateOverall`, credential);
  return response.data;
};
export const checkSyllabusInfo = async (name, code) => {
  const response = await api.get(`/api/v1/Syllabus/infor/checking`, {
    params: { name, code }
  });
  return response.data;
};

export const getSyllabusGeneral = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/staff/getGeneralInformation`, {
    params: { id }
  });
  return response.data;
};
export const getSyllabusMaterial = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/staff/getMaterial`, {
    params: { id }
  });
  return response.data;
};
export const getSyllabusExam = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/staff/getExamSyllabus`, {
    params: { id }
  });
  return response.data;
};
export const getSyllabusSession = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/staff/getSessionSyllabus`, {
    params: { id }
  });
  return response.data;
};
export const getSyllabusQuestion = async (id) => {
  const response = await api.get(`/api/v1/Syllabus/staff/getQuestionSyllabus`, {
    params: { id }
  });
  return response.data;
};