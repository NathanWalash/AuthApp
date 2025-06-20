// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in App.tsx will fire and show HomeScreen
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unexpected error—please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Log In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.button}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Log In" onPress={handleLogin} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});
