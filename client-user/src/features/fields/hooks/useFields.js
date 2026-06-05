// File: client-user/src/features/fields/hooks/useFields.js
import { useCallback, useEffect, useState } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userClient.get('/fields');
      const data = response.data.data || response.data;
      const mapped = (Array.isArray(data) ? data : []).map((field) => ({
        ...field,
        name: field.fieldName,
        image: field.photo,
        location: `${field.fieldType || 'Cancha'} • ${field.capacity || 0}`,
        isAvailable: Boolean(field.isActive)
      }));
      setFields(mapped);
      return mapped;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar las canchas';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    fields,
    loading,
    error,
    refreshFields: fetchFields
  };
}
