// File: client-user/src/shared/components/common/Common.jsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export function LoadingSpinner({ size = 'small' }) {
  return <ActivityIndicator size={size} color={COLORS.primary} />;
}

export function EmptyState({ title = 'Sin resultados', subtitle }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: SPACING.l,
    alignItems: 'center'
  },
  emptyTitle: {
    fontSize: FONT_SIZE.m,
    color: COLORS.text
  },
  emptySubtitle: {
    marginTop: 6,
    color: COLORS.textLight
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
    ...SHADOWS.light
  }
});
