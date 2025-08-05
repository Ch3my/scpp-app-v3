import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import useStore from '../store/useStore';
import './global.css';

const queryClient = new QueryClient();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { sessionHash } = useStore();
  const router = useRouter();

  // State to track if the Zustand store is rehydrated
  const [isStoreReady, setIsStoreReady] = useState(useStore.persist.hasHydrated());

  useEffect(() => {
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Subscribe to the store's hydration event if it's not already hydrated
    if (!isStoreReady) {
      const unsubscribe = useStore.persist.onFinishHydration(() => {
        setIsStoreReady(true);
      });
      return unsubscribe;
    }
  }, [isStoreReady]);

  useEffect(() => {
    if (loaded && isStoreReady) {
      // Navigate to the correct screen
      if (sessionHash) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [loaded, isStoreReady, sessionHash, router]);

  // If fonts are not loaded or store is not ready, we return null.
  // The native splash screen will remain visible because of `preventAutoHideAsync`.
  if (!loaded || !isStoreReady) {
    return null;
  }

  // Once everything is ready, render the navigator.
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
