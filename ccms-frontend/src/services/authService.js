import API from "../api/api";

export const authService = {
  login: async ({ email, password }) => {
    const res = await API.post("/api/auth/login", { email, password });
    return res.data;
  },
  register: async ({ name, email, password, role = "student" }) => {
    const res = await API.post("/api/auth/register", { name, email, password, role });
    return res.data;
  },
};
