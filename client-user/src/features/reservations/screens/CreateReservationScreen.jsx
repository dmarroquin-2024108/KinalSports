// File: client-user/src/features/reservations/screens/CreateReservationScreen.jsx
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useReservations from '../hooks/useReservations';

export default function CreateReservationScreen({ navigation, route }) {
  const { createReservation, loading, error } = useReservations();
  const field = route.params?.field || {};

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      date: '',
      startTime: '',
      endTime: ''
    }
  });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      fieldId: field._id || field.id
    };
    const result = await createReservation(payload);
    if (result.ok) {
      Alert.alert('Reservación creada', 'Tu reservación se creó exitosamente.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Crear reservación</Text>
        <Text style={styles.subtitle}>Cancha: {field.name || 'No seleccionada'}</Text>

        <Controller
          control={control}
          name="date"
          rules={{ required: 'Ingresa la fecha (YYYY-MM-DD)' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Fecha (YYYY-MM-DD)"
              value={value}
              onChangeText={onChange}
              error={errors.date?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="startTime"
          rules={{ required: 'Ingresa la hora de inicio (HH:mm)' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Hora de inicio (HH:mm)"
              value={value}
              onChangeText={onChange}
              error={errors.startTime?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endTime"
          rules={{ required: 'Ingresa la hora de fin (HH:mm)' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Hora de fin (HH:mm)"
              value={value}
              onChangeText={onChange}
              error={errors.endTime?.message}
            />
          )}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
          Confirmar reservación
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    backgroundColor: COLORS.background
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
