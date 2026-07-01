import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sweetcrumb-bakery.vercel.app';

const api = axios.create({
  baseURL: API_URL
});

export default api;
