// src/screens/ResetPasswordScreen.tsx
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
import { sendPasswordResetEmail } from 'firebase/auth';

type Props = { onBack: () => void };

export default function ResetPasswordScreen({ onBack }: Props) {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Password reset email sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-6">
        Reset Password
      </Text>

      {message && (
        <Text className="text-green-600 text-center mb-4">{message}</Text>
      )}
      {error && (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      )}

      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View className="mb-4">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Send Reset Email" onPress={handleReset} />
        )}
      </View>

      <TouchableOpacity onPress={onBack}>
        <Text className="text-blue-600 text-center">
          Back to Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
