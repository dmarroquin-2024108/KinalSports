// File: client-user/src/features/reservations/screens/ReservationsScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useReservations from '../hooks/useReservations';

export default function ReservationsScreen() {
  const { reservations, loading, error, fetchHistory, cancelReservation } = useReservations();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  }, [fetchHistory]);

  const handleCancel = useCallback(
    async (id) => {
      await cancelReservation(id);
    },
    [cancelReservation]
  );

  if (loading && reservations.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={<EmptyState title="Sin reservaciones" subtitle="Tu historial aparecerá aquí" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            {item.field?.image ? <Image source={{ uri: item.field.image }} style={styles.image} /> : null}
            <Text style={styles.title}>{item.field?.name || 'Cancha'}</Text>
            <Text style={styles.subtitle}>Fecha: {item.date || item.reservationDate || 'No definida'}</Text>
            <Text style={styles.subtitle}>Horario: {item.startTime || '-'} - {item.endTime || '-'}</Text>
            <Text style={styles.status}>Estado: {item.normalizedStatus || 'PENDIENTE'}</Text>
            {item.normalizedStatus !== 'CANCELLED' ? (
              <Button variant="secondary" onPress={() => handleCancel(item._id || item.id)}>
                Cancelar
              </Button>
            ) : null}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  listContent: {
    paddingBottom: SPACING.l
  },
  card: {
    marginBottom: SPACING.m
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: SPACING.s
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.m
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.s,
    marginTop: SPACING.xs
  },
  status: {
    color: COLORS.text,
    fontSize: FONT_SIZE.s,
    marginVertical: SPACING.s
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s,
    textAlign: 'center'
  }
});
