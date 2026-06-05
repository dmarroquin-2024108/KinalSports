// File: client-user/src/features/teams/screens/TeamsScreen.jsx
import React, { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTeams from '../hooks/useTeams';

export default function TeamsScreen({ navigation }) {
  const { teams, loading, error, fetchTeams } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const renderItem = useCallback(
    ({ item }) => (
      <Pressable onPress={() => navigation.navigate('TeamDetail', { team: item })}>
        <Card style={styles.card}>
          <Text style={styles.title}>{item.name || item.teamName || 'Equipo'}</Text>
          <Text style={styles.subtitle}>{item.description || 'Sin descripción'}</Text>
        </Card>
      </Pressable>
    ),
    [navigation]
  );

  if (loading && teams.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Button variant="secondary" onPress={() => navigation.navigate('MyTeams')}>
          Mis equipos
        </Button>
        <Button onPress={() => navigation.navigate('CreateTeam')}>Crear equipo</Button>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={teams}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState title="Sin equipos" subtitle="Aún no hay equipos disponibles" />}
        contentContainerStyle={styles.listContent}
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
  actions: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m
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
