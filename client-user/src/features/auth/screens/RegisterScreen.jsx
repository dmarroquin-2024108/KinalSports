// File: client-user/src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';
import useAuth from '../hooks/useAuth';

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const onSubmit = async (values) => {
    const result = await handleRegister(values);
    if (result.ok) {
      Alert.alert('Registro exitoso', 'Tu cuenta fue creada correctamente.', [
        { text: 'Ir a iniciar sesión', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Crear cuenta</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: 'Ingresa tu nombre' }}
        render={({ field: { onChange, value } }) => (
          <Input label="Nombre" value={value} onChangeText={onChange} error={errors.name?.message} />
        )}
      />

      <Controller
        control={control}
        name="surname"
        rules={{ required: 'Ingresa tu apellido' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Apellido"
            value={value}
            onChangeText={onChange}
            error={errors.surname?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        rules={{ required: 'Ingresa tu usuario' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Usuario"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Ingresa tu correo' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Correo"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
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

      <Controller
        control={control}
        name="phone"
        rules={{ required: 'Ingresa tu teléfono' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Teléfono"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button loading={loading} onPress={handleSubmit(onSubmit)}>
        Crear cuenta
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    justifyContent: 'center'
  },
  title: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
    marginBottom: SPACING.m,
    textAlign: 'center'
  },
  errorText: {
    marginBottom: SPACING.m,
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    textAlign: 'center'
  }
});
