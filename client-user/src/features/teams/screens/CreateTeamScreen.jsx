// File: client-user/src/features/teams/screens/CreateTeamScreen.jsx
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import useTeams from '../hooks/useTeams';

export default function CreateTeamScreen({ navigation }) {
  const { createTeam, loading, error } = useTeams();
  const [image, setImage] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Debes conceder permiso para seleccionar imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true
    });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0]);
    }
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);

    if (image?.uri) {
      formData.append('photo', {
        uri: image.uri,
        name: image.fileName || 'team-photo.jpg',
        type: image.mimeType || 'image/jpeg'
      });
    }

    const result = await createTeam(formData);
    if (result.ok) {
      Alert.alert('Equipo creado', 'Tu equipo se creó correctamente.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Crear equipo</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Ingresa el nombre del equipo' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Nombre" value={value} onChangeText={onChange} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{ required: 'Ingresa una descripción' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Descripción"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
            />
          )}
        />

        <Button variant="secondary" onPress={pickImage}>
          Seleccionar foto
        </Button>

        {image?.uri ? <Image source={{ uri: image.uri }} style={styles.preview} /> : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
          Guardar equipo
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
    marginBottom: SPACING.m
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginVertical: SPACING.m
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.s,
    marginVertical: SPACING.s,
    textAlign: 'center'
  }
});
