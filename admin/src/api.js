import axios from 'axios';

const url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: url, 
  withCredentials: true, // IMPORTANT: Allows sending/receiving cookies
});

export default api;