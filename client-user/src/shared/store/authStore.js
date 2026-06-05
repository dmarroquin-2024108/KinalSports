import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_KEY = 'kinal_refresh_token';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) {
            await SecureStore.setItemAsync(
              REFRESH_KEY,
              refreshToken
            );
          }
        } catch (e) {}

        set({
          token: accessToken,
          user,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(REFRESH_KEY);
        } catch (e) {}

        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      updateUser: (user) =>
        set({
          user,
        }),

      getRefreshToken: async () => {
        try {
          return await SecureStore.getItemAsync(REFRESH_KEY);
        } catch (e) {
          return null;
        }
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

export default useAuthStore;