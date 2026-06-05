// File: client-user/src/features/teams/screens/MyTeamsScreen.jsx
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTeams from '../hooks/useTeams';

export default function MyTeamsScreen() {
  const { myTeams, loading, error, fetchMyTeams } = useTeams();

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  if (loading && myTeams.length === 0) {
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
        data={myTeams}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState title="No perteneces a equipos" subtitle="Únete o crea uno nuevo" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.name || item.teamName || 'Equipo'}</Text>
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
    padding: SPACING.m,
    backgroundColor: COLORS.background
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
