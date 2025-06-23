// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

type Props = {
  onCreateAccount: () => void;
  onForgotPassword: () => void;
};

export default function LoginScreen({
  onCreateAccount,
  onForgotPassword,
}: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-6">Log In</Text>
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-2"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      )}

      <View className="mb-4">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Log In" onPress={handleLogin} />
        )}
      </View>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text className="text-blue-600 text-center mb-2">
          Forgot your password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCreateAccount}>
        <Text className="text-blue-600 text-center">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
