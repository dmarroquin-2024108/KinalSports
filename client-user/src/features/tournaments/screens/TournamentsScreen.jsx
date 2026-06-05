// File: client-user/src/features/tournaments/screens/TournamentsScreen.jsx
import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTournaments from '../hooks/useTournaments';

export default function TournamentsScreen({ navigation }) {
  const { tournaments, loading, error, fetchTournaments } = useTournaments();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  if (loading && tournaments.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button variant="secondary" onPress={() => navigation.navigate('MyTournaments')}>
        Mis torneos
      </Button>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={tournaments}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState title="Sin torneos" subtitle="Aún no hay torneos activos" />}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('TournamentDetail', { tournament: item })}>
            <Card style={styles.card}>
              <Text style={styles.title}>{item.name || 'Torneo'}</Text>
              <Text style={styles.subtitle}>{item.description || 'Sin descripción'}</Text>
            </Card>
          </Pressable>
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
    paddingTop: SPACING.m,
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
    marginTop: SPACING.s,
    textAlign: 'center'
  }
});
