// src/services/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_SCV, // URL base para todas as requisições
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo padrão
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_state'); // Obtendo o token do cookie
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adicionando o token no cabeçalho Authorization
    }
    return config; // Retorna a configuração da requisição
  },
  (error) => {
    // Se houver erro no interceptor
    return Promise.reject(error); // Rejeita a promessa com o erro
  }
);


export default axiosInstance;
