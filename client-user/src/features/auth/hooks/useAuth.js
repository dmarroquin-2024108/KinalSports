// File: client-user/src/features/auth/hooks/useAuth.js
import { useState } from 'react';
import { authClient } from '../../../shared/api/authClient';
import useAuthStore from '../../../shared/store/authStore';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogin = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await authClient.post('/login', payload);
      const data = response?.data || {};

      const accessToken = data.accessToken || data.token || null;
      const refreshToken = data.refreshToken || null;
      const user = data.userDetails || data.user || null;

      if (!accessToken) {
        throw new Error('No se recibió token de acceso');
      }

      await loginStore(accessToken, user, refreshToken);
      return { ok: true, data };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'No se pudo iniciar sesión';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await authClient.post('/register', payload);
      return { ok: true, data: response?.data };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'No se pudo registrar la cuenta';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    loading,
    error,
    logout: logoutStore
  };
}
