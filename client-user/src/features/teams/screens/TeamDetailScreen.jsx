// File: client-user/src/features/teams/screens/TeamDetailScreen.jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTeams from '../hooks/useTeams';

export default function TeamDetailScreen({ route }) {
  const team = route.params?.team || {};
  const { joinTeam, leaveTeam, loading, error } = useTeams();

  const teamId = team._id || team.id;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>{team.name || team.teamName || 'Equipo'}</Text>
        <Text style={styles.text}>{team.description || 'Sin descripción'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <Button loading={loading} onPress={() => joinTeam(teamId)}>
            Unirme
          </Button>
          <Button variant="secondary" loading={loading} onPress={() => leaveTeam(teamId)}>
            Salir
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.l,
    marginBottom: SPACING.s
  },
  text: {
    color: COLORS.text,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.m
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.s
  }
});
