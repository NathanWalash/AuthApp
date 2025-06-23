// src/screens/SignupScreen.tsx
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
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Props = { onLogin: () => void };

export default function SignupScreen({ onLogin }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSignup = async () => {
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!firstName || !lastName || !dob) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = cred.user.uid;
      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        dateOfBirth: dob,
        email: cred.user.email,
        createdAt: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-6">
        Create Account
      </Text>

      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {error && (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      )}

      <View className="mb-4">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Sign Up" onPress={handleSignup} />
        )}
      </View>

      <TouchableOpacity onPress={onLogin}>
        <Text className="text-blue-600 text-center">
          Already have an account? Log In
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
