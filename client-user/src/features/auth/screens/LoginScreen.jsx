// File: client-user/src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';
import useAuth from '../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    await handleLogin(values);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/kinal_sports.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Iniciar sesión</Text>

      <Controller
        control={control}
        name="emailOrUsername"
        rules={{ required: 'Ingresa tu correo o usuario' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Correo o usuario"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            error={errors.emailOrUsername?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Ingresa tu contraseña' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={18} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button loading={loading} onPress={handleSubmit(onSubmit)}>
        Entrar
      </Button>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>¿No tienes cuenta?</Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}> Regístrate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.m
  },
  logo: {
    width: 180,
    height: 180
  },
  title: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
    marginBottom: SPACING.m,
    textAlign: 'center'
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    gap: SPACING.xs
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    flex: 1
  },
  registerRow: {
    marginTop: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  registerText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.s
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.s
  }
});
