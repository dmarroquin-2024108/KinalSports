// File: client-user/src/features/tournaments/screens/TournamentDetailScreen.jsx
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTournaments from '../hooks/useTournaments';

export default function TournamentDetailScreen({ route }) {
  const tournament = route.params?.tournament || {};
  const { registerInTournament, loading, error } = useTournaments();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      teamId: ''
    }
  });

  const onSubmit = async (values) => {
    const id = tournament._id || tournament.id;
    const result = await registerInTournament(id, values.teamId);
    if (result.ok) {
      Alert.alert('Inscripción exitosa', 'Tu equipo fue inscrito correctamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>{tournament.name || 'Torneo'}</Text>
        <Text style={styles.subtitle}>{tournament.description || 'Sin descripción'}</Text>

        <Controller
          control={control}
          name="teamId"
          rules={{ required: 'Ingresa el ID del equipo' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="ID del equipo"
              value={value}
              onChangeText={onChange}
              error={errors.teamId?.message}
            />
          )}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
          Inscribir equipo
        </Button>
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
  subtitle: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.m
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s,
    textAlign: 'center'
  }
});
