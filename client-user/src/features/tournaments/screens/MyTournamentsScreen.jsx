// File: client-user/src/features/tournaments/screens/MyTournamentsScreen.jsx
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTournaments from '../hooks/useTournaments';

export default function MyTournamentsScreen() {
  const { myTournaments, loading, error, fetchMyTournaments } = useTournaments();

  useEffect(() => {
    fetchMyTournaments();
  }, [fetchMyTournaments]);

  if (loading && myTournaments.length === 0) {
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
        data={myTournaments}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState title="Sin torneos inscritos" subtitle="Inscribe a tu equipo en un torneo" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.name || 'Torneo'}</Text>
            <Text style={styles.subtitle}>{item.description || 'Sin descripción'}</Text>
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
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s,
    textAlign: 'center'
  }
});
