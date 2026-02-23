import axios from "axios";

// The base URL should be configured via environment variable in production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const documentApi = {
  list: async () => {
    const response = await client.get("/documents/");
    return response.data;
  },

  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Overriding content type for this specific request to handle file upload
    const response = await client.post("/documents/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  summarize: async (id) => {
    const response = await client.post(`/documents/${id}/summarize/`);
    return response.data;
  },

  generateQuiz: async (id) => {
    const response = await client.post(`/documents/${id}/quiz/`);
    return response.data;
  },

  chat: async (id, question) => {
    const response = await client.post(`/documents/${id}/chat/`, { question });
    return response.data;
  },
};

export default client;
