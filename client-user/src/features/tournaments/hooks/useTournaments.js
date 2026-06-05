// File: client-user/src/features/tournaments/hooks/useTournaments.js
import { useCallback, useState } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.get('/tournaments');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar los torneos';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.get('/tournaments/my-tournaments');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setMyTournaments(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar tus torneos';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const registerInTournament = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      const data = response.data.data || response.data;
      await fetchMyTournaments();
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo completar la inscripción';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTournaments]);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    fetchTournaments,
    fetchMyTournaments,
    registerInTournament
  };
}
