// File: client-user/src/features/reservations/hooks/useReservations.js
import { useCallback, useState } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.get('/reservations/me/history');
      const data = response.data.data || response.data;
      const mapped = (Array.isArray(data) ? data : []).map((reservation) => ({
        ...reservation,
        field: {
          id: reservation.field?._id || reservation.field?.id || '',
          name: reservation.field?.fieldName || reservation.field?.name || 'Cancha',
          image: reservation.field?.photo || reservation.field?.image || ''
        },
        normalizedStatus: String(reservation.status || '').toUpperCase()
      }));
      setReservations(mapped);
      return mapped;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo cargar el historial';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.post('/reservations', payload);
      const data = response.data.data || response.data;
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo crear la reservación';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.put(`/reservations/${id}/cancel`);
      const data = response.data.data || response.data;
      await fetchHistory();
      return { ok: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo cancelar la reservación';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  return {
    reservations,
    loading,
    error,
    fetchHistory,
    createReservation,
    cancelReservation
  };
}
