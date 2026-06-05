// File: client-user/src/shared/api/authClient.js
import axios from 'axios';
import useAuthStore from '../store/authStore';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

export function createApiClient(baseURL) {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (!originalRequest) return Promise.reject(err);

      const status = err.response ? err.response.status : null;

      if (status === 401 && !originalRequest._retry) {
        const url = (originalRequest.url || '').toLowerCase();
        const excluded = ['login', 'register', 'forgot-password', 'reset-password', 'verify-email', 'resend-verification'];
        if (excluded.some((p) => url.includes(p))) return Promise.reject(err);

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest._retry = true;
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch((e) => Promise.reject(e));
        }

        isRefreshing = true;
        try {
          const refreshToken = await SecureStore.getItemAsync('kinal_refresh_token');
          if (!refreshToken) {
            await useAuthStore.getState().logout();
            return Promise.reject(err);
          }

          const refreshRes = await axios.post(`${ENDPOINTS.AUTH}/refresh`, { refreshToken });
          const newAccess = refreshRes.data?.accessToken || refreshRes.data?.token || null;
          if (!newAccess) {
            await useAuthStore.getState().logout();
            return Promise.reject(err);
          }

          useAuthStore.getState().setAccessToken(newAccess);
          processQueue(null, newAccess);

          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = 'Bearer ' + newAccess;
          return axios(originalRequest);
        } catch (e) {
          processQueue(e, null);
          await useAuthStore.getState().logout();
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
}

export const authClient = createApiClient(ENDPOINTS.AUTH);
