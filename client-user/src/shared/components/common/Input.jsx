// File: client-user/src/shared/components/common/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function Input({ label, error, ...props }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, error ? styles.inputError : null]} placeholderTextColor={COLORS.textLight} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m
  },
  label: {
    marginBottom: 6,
    color: COLORS.text,
    fontSize: FONT_SIZE.s
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SPACING.s,
    borderRadius: 8,
    color: COLORS.text
  },
  inputError: {
    borderColor: COLORS.error
  },
  error: {
    marginTop: 6,
    color: COLORS.error,
    fontSize: FONT_SIZE.xs
  }
});
