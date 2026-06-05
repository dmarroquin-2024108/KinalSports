// File: client-user/src/features/profile/screens/ProfileScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import userClient from '../../../shared/api/userClient';
import useAuthStore from '../../../shared/store/authStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

// tiny default avatar (gray circle) as data URI
const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72' fill='%2380838c'>👤</text></svg>`);

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { displayName: '', phone: '', favoriteSports: '' }
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userClient.get('/users/profile');
      const data = res.data.data || res.data;
      setProfile(data || {});
      reset({
        displayName: data?.displayName || data?.name || '',
        phone: data?.phone || '',
        favoriteSports: Array.isArray(data?.favoriteSports) ? data.favoriteSports.join(', ') : (data?.favoriteSports || '')
      });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSave = async (vals) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        displayName: vals.displayName,
        phone: vals.phone,
        favoriteSports: vals.favoriteSports ? vals.favoriteSports.split(',').map((s) => s.trim()) : []
      };
      const res = await userClient.put('/users/profile', payload);
      const data = res.data.data || res.data;
      setProfile(data || {});
      updateUser(data || {});
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout() }
    ]);
  };

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  const avatarUri = profile?.avatar || '';
  const imageSource = avatarUri && typeof avatarUri === 'string' && avatarUri.startsWith('http') ? { uri: avatarUri } : { uri: DEFAULT_AVATAR };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.header}>
          <Image source={imageSource} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{profile?.displayName || profile?.name || 'Usuario'}</Text>
            <Text style={styles.sub}>{profile?.email || ''}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editRow} onPress={() => setEditing((v) => !v)}>
          <Text style={styles.editText}>{editing ? 'Cancelar edición' : 'Editar perfil'}</Text>
        </TouchableOpacity>

        {editing ? (
          <>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, value } }) => <Input label="Nombre visible" value={value} onChangeText={onChange} />}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => <Input label="Teléfono" value={value} onChangeText={onChange} keyboardType="phone-pad" />}
            />
            <Controller
              control={control}
              name="favoriteSports"
              render={({ field: { onChange, value } }) => (
                <Input label="Deportes favoritos (separados por comas)" value={value} onChangeText={onChange} />
              )}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button loading={loading} onPress={handleSubmit(onSave)}>
              Guardar
            </Button>
          </>
        ) : null}

        <View style={styles.logoutRow}>
          <Button variant="secondary" onPress={handleLogout}>
            Cerrar sesión
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: SPACING.m
  },
  info: {
    flex: 1
  },
  name: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.l
  },
  sub: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.s
  },
  editRow: {
    alignItems: 'flex-end',
    marginBottom: SPACING.s
  },
  editText: {
    color: COLORS.primary
  },
  logoutRow: {
    marginTop: SPACING.m
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.s
  }
});
