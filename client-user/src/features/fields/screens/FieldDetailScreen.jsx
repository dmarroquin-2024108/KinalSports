// File: client-user/src/features/fields/screens/FieldDetailScreen.jsx
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function FieldDetailScreen({ navigation, route }) {
  const field = route.params?.field || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        {field.image ? <Image source={{ uri: field.image }} style={styles.image} /> : null}
        <Text style={styles.title}>{field.name || 'Cancha'}</Text>
        <Text style={styles.text}>{field.location || 'Sin ubicación'}</Text>
        <Text style={styles.text}>Capacidad: {field.capacity || 'No disponible'}</Text>
        <Text style={field.isAvailable ? styles.available : styles.unavailable}>
          {field.isAvailable ? 'Disponible' : 'No disponible'}
        </Text>

        <View style={styles.buttonWrap}>
          <Button onPress={() => navigation.navigate('CreateReservation', { field })}>
            Reservar esta cancha
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: SPACING.s
  },
  title: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
    marginBottom: SPACING.s
  },
  text: {
    color: COLORS.text,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.xs
  },
  available: {
    color: COLORS.success,
    fontSize: FONT_SIZE.s,
    marginTop: SPACING.s
  },
  unavailable: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginTop: SPACING.s
  },
  buttonWrap: {
    marginTop: SPACING.m
  }
});
