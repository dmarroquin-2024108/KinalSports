// File: client-user/src/features/teams/hooks/useTeams.js
import { useCallback, useState } from 'react';
import userClient from '../../../shared/api/userClient';
import useAuthStore from '../../../shared/store/authStore';

export default function useTeams() {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.get('/teams');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setTeams(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar los equipos';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!user?._id) {
        setMyTeams([]);
        return [];
      }
      const response = await userClient.get('/teams/me/mis-equipos');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setMyTeams(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar tus equipos';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const joinTeam = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.post(`/teams/${id}/join`);
      const data = response.data.data || response.data;
      await fetchTeams();
      await fetchMyTeams();
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No te pudiste unir al equipo';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams, fetchTeams]);

  const leaveTeam = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.post(`/teams/${id}/leave`);
      const data = response.data.data || response.data;
      await fetchTeams();
      await fetchMyTeams();
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No pudiste salir del equipo';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams, fetchTeams]);

  const createTeam = useCallback(async (formData) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.post('/teams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = response.data.data || response.data;
      await fetchTeams();
      await fetchMyTeams();
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo crear el equipo';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams, fetchTeams]);

  return {
    teams,
    myTeams,
    loading,
    error,
    fetchTeams,
    fetchMyTeams,
    joinTeam,
    leaveTeam,
    createTeam
  };
}
