import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  credentials: 'include'
});

// Intercepteur pour ajouter le token automatiquement
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Interceptor Error', {
      errorResponse: error.response,
      errorRequest: error.request,
      errorMessage: error.message
    });
    return Promise.reject(error);
  }
);

export default instance;
