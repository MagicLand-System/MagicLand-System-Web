import axios from "./index";

const classesAPI = {
  getClasses: () => axios.get("/classes"),
  searchClass: (keyWord) => axios.get(`/classes/filter?${keyWord}`),
};

export default classesAPI;
