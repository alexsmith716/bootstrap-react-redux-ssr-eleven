import axios from 'axios';

export default function apiClient(req) {

  const instance = axios.create();

  instance.interceptors.request.use(
    conf => {
      return conf;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error.response ? error.response.data : error)
  );

  return instance;
}
