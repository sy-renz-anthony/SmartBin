import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://smartbin-x0i7.onrender.com/api',
  withCredentials: true
});

export default axiosInstance;