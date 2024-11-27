// src/services/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_SCV, // URL base para todas as requisições
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo padrão
  },
});

export default axiosInstance;
