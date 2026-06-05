// File: client-user/src/features/fields/screens/FieldsScreen.jsx
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useFields from '../hooks/useFields';

export default function FieldsScreen({ navigation }) {
  const { fields, loading, error, refreshFields } = useFields();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFields();
    setRefreshing(false);
  }, [refreshFields]);

  if (loading && fields.length === 0) {
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
        data={fields}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={<EmptyState title="No hay canchas disponibles" subtitle="Intenta de nuevo más tarde" />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('FieldDetail', { field: item })}>
            <Card style={styles.card}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
              <Text style={styles.title}>{item.name || 'Cancha'}</Text>
              <Text style={styles.subtitle}>{item.location}</Text>
              <Text style={item.isAvailable ? styles.available : styles.unavailable}>
                {item.isAvailable ? 'Disponible' : 'No disponible'}
              </Text>
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
    paddingBottom: SPACING.l
  },
  card: {
    marginBottom: SPACING.m
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: SPACING.s
  },
  title: {
    fontSize: FONT_SIZE.l,
    color: COLORS.primary
  },
  subtitle: {
    marginTop: SPACING.xs,
    color: COLORS.textLight,
    fontSize: FONT_SIZE.s
  },
  available: {
    marginTop: SPACING.s,
    color: COLORS.success,
    fontSize: FONT_SIZE.s
  },
  unavailable: {
    marginTop: SPACING.s,
    color: COLORS.error,
    fontSize: FONT_SIZE.s
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s,
    textAlign: 'center'
  }
});
