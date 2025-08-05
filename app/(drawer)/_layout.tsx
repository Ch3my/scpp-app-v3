import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import useStore from '@/store/useStore';
import { DrawerActions } from '@react-navigation/native';
import { Redirect, SplashScreen } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

export default function DrawerLayout() {
  const iconColor = useThemeColor({}, 'icon');
  const sessionHash = useStore((state) => state.sessionHash);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!sessionHash) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <IconSymbol name="line.3.horizontal" size={24} color={iconColor} />
          </TouchableOpacity>
        ),
      })}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'SCPP',
        }}
      />
      <Drawer.Screen
        name="config"
        options={{
          drawerLabel: 'Config',
          title: 'Config',
        }}
      />
      <Drawer.Screen
        name="food"
        options={{
          drawerLabel: 'Lista Food Storage',
          title: 'Lista Food Storage',
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{
          drawerLabel: 'Salir',
          title: 'Salir',
        }}
      />
    </Drawer>
  );
}
