import axios from "axios";
const URL = "";

const instance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (credential) => {
  const response = await instance.post("/api/auth/login", credential);
  return response.data;
};
