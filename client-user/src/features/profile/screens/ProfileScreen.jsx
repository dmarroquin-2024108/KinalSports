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
import { authClient } from '../../../shared/api/authClient';
import * as ImagePicker from 'expo-image-picker';

// tiny default avatar (gray circle) as data URI
const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72' fill='%2380838c'>👤</text></svg>`);

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { displayName: '', phone: '', favoriteSports: '' }
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authClient.get('/profile');
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSave = async (vals) => {
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append(
        'Name',
        vals.displayName || vals.name || ''
      );
      formData.append(
        'Surname',
        profile?.surname || ''
      );
      formData.append(
        'Phone',
        vals.phone || ''
      );

      if (selectedImage) {
        formData.append('ProfilePicture', {
          uri: selectedImage.uri,
          name:
            selectedImage.fileName || `profile-${Date.now()}.jpg`,
          type:
            selectedImage.mimeType ||
            'image/jpeg'
        });
      }

      const res = await authClient.put(
        '/profile', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const data = res.data.data || res.data;

      setProfile(data);
      updateUser(data);
      setSelectedImage(null);
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || 'No se pudo actualizar el perfil'
      );
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

  const BASE_URL = 'https://res.cloudinary.com/divzjcxko/image/upload/auth_ks_in6am/profiles/';
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `${BASE_URL}${avatar}`;
  };

  const imageSource = getAvatarUrl(profile?.avatar)
    ? { uri: getAvatarUrl(profile?.avatar) }
    : require('../../assets/avatarDefault-1749508519496.png');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.header}>
          <Image source={imageSource?.uri
            ? { uri: selectedImage.uri }
            : imageSource
          } style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{profile?.displayName || profile?.name || 'Usuario'}</Text>
            <Text style={styles.tit}>{profile?.username || ''}</Text>
            <Text style={styles.sub}>{profile?.email || ''}</Text>
            <Text style={styles.sub}>{profile?.phone || ''}</Text>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.editText}>
                Cambiar foto
              </Text>
            </TouchableOpacity>
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
