import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function ConfigScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const themes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
  ];

  return (
    <ThemedView className="flex-1 p-4">
      <ThemedText type="subtitle" className="mb-4">
        Appearance
      </ThemedText>
      <View className="rounded-lg border border-gray-300 dark:border-gray-700">
        {themes.map((theme, index) => (
          <Pressable
            key={theme.value}
            onPress={() => setColorScheme(theme.value as any)}
            className={`p-4 flex-row justify-between items-center ${
              index < themes.length - 1 ? 'border-b border-gray-300 dark:border-gray-700' : ''
            }`}>
            <ThemedText>{theme.name}</ThemedText>
            {colorScheme === theme.value && (
              <View className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}
