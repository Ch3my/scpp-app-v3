import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeState = {
  colorScheme: 'light' | 'dark' | 'system';
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'system',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useCurrentTheme() {
  const storedScheme = useThemeStore((state) => state.colorScheme);
  const systemScheme = Appearance.getColorScheme() ?? 'light';

  return storedScheme === 'system' ? systemScheme : storedScheme;
}
