import http from "./http";

export const getAllTasks = () => http.get("/tasks");
export const getMyTasks = () => http.get("/tasks/my");
export const createTask = (data) => http.post("/tasks", data);
export const updateTaskStatus = (id, status) =>
  http.patch(`/tasks/${id}`, { status });
export const deleteTask = (id) => http.delete(`/tasks/${id}`);