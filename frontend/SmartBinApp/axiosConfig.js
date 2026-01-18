import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'Your render backend api endpoint here/api',
  withCredentials: false,
  timeout: 80000,
});

export default axiosInstance;