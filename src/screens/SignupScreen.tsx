// src/screens/SignupScreen.tsx
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
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Props = { onLogin: () => void };

export default function SignupScreen({ onLogin }: Props) {
  // form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState(''); // format “YYYY-MM-DD”
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
      setError('Please fill out all profile fields.');
      return;
    }
    setLoading(true);
    try {
      // create the user
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = cred.user.uid;

      // write profile data into Firestore under /users/{uid}
      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        dateOfBirth: dob,
        email: cred.user.email,
        createdAt: Date.now(),
      });
      // onAuthStateChanged will now fire → HomeScreen
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.button}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Sign Up" onPress={handleSignup} />
        )}
      </View>

      <TouchableOpacity onPress={onLogin} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:24, justifyContent:'center', backgroundColor:'#fff' },
  header:    { fontSize:28, marginBottom:24, textAlign:'center' },
  input:     {
    borderWidth:1, borderColor:'#ccc', borderRadius:6,
    paddingHorizontal:12, paddingVertical:8, marginBottom:12,
  },
  button:    { marginTop:16 },
  error:     { color:'red', textAlign:'center', marginTop:8 },
  link:      { marginTop:24, alignSelf:'center' },
  linkText:  { color:'#0066cc' },
});
