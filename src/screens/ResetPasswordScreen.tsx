// src/screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';

type Props = {
  onBack: () => void;
};

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
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>

      {message && <Text style={styles.message}>{message}</Text>}
      {error   && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.button}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Send Reset Email" onPress={handleReset} />
        )}
      </View>

      <TouchableOpacity onPress={onBack} style={styles.link}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff'
  },
  header: {
    fontSize: 28, marginBottom: 24, textAlign: 'center'
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12
  },
  button: {
    marginTop: 16
  },
  message: {
    color: 'green', textAlign: 'center', marginBottom: 12
  },
  error: {
    color: 'red', textAlign: 'center', marginBottom: 12
  },
  link: {
    marginTop: 24, alignSelf: 'center'
  },
  linkText: {
    color: '#0066cc'
  },
});
