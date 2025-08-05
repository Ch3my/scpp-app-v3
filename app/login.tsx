import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, TextInput, Alert } from 'react-native';
import useStore from '../store/useStore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setSessionHash = useStore((state) => state.setSessionHash);
  const apiUrl = useStore((state) => state.apiUrl);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setSessionHash(data.sessionHash);
      router.replace('/dashboard');
    },
    onError: (error) => {
      Alert.alert('Error', 'Invalid credentials or server error');
      console.error(error);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <ThemedView className="flex-1 justify-center items-center p-4">
      <ThemedView className="w-full max-w-sm p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
        <ThemedText type="title" className="text-center mb-6 text-red-500">Login</ThemedText>
        <TextInput
          className="h-12 border border-gray-300 dark:border-gray-700 rounded-lg px-4 mb-4 text-lg text-gray-900 dark:text-white"
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="h-12 border border-gray-300 dark:border-gray-700 rounded-lg px-4 mb-6 text-lg text-gray-900 dark:text-white"
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} disabled={loginMutation.isPending} />
      </ThemedView>
    </ThemedView>
  );
};

export default LoginScreen;