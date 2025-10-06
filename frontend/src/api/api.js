// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // o tu IP local si usas dispositivo real
});

export const registerFace = async (name, role, imageBlob) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("role", role);
  formData.append("file", imageBlob, "face.jpg");

  const response = await api.post("/users/register-face", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export default api;
