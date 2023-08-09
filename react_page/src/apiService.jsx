import axios from "axios";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const api = PsApiService();

function PsApiService() {
  // const baseUrl = new URL("http://127.0.0.1:1337/api/");
  // console.log(import.meta.env.VITE_APP_API_ADDRESS);
  const baseUrl = new URL(import.meta.env.VITE_APP_API_ADDRESS);
  const instance = axios.create({
    baseURL: baseUrl.href,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });

  return instance;
}

export const getSongs = () => {
  return api.get("/songs");
};

export const getSong = (songId) => {
  return api.get(`/song/${songId}`);
};

export const streamSong = (songId) => {
  return api.get(`/stream/${songId}`);
};

export const getComments = () => {
  return api.get("/comments");
};

export const createComment = (comment) => {
  return api.post("/comments/", comment);
};

export const deleteComment = (commentId) => {
  return api.delete(`/comments/${commentId}`);
};

export const updateComment = (commentId, updatedComment) => {
  return api.patch(`/comments/${commentId}`, updatedComment);
};

export const getCurrentUser = () => {
  return api.get("/current_user");
};
