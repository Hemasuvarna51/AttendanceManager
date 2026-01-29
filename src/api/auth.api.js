import http from "./http";

export const loginApi = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
};
