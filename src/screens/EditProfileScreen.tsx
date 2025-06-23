// src/screens/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type Props = {
  user: User;
  onDone: () => void;
};

export default function EditProfileScreen({ user, onDone }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    // Fetch current profile
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data()!;
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setDob(data.dateOfBirth || '');
        }
      })
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleSave = async () => {
    setError(null);
    if (!firstName || !lastName || !dob) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        dateOfBirth: dob,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      {error && <Text style={styles.error}>{error}</Text>}

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

      <View style={styles.button}>
        {saving ? (
          <ActivityIndicator />
        ) : (
          <Button title="Save Changes" onPress={handleSave} />
        )}
      </View>
      <View style={styles.button}>
        <Button title="Cancel" onPress={onDone} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  container: { flex:1, padding:24, backgroundColor:'#fff' },
  header: { fontSize:24, textAlign:'center', marginBottom:16 },
  input: {
    borderWidth:1, borderColor:'#ccc', borderRadius:6,
    paddingHorizontal:12, paddingVertical:8, marginBottom:12
  },
  button: { marginTop:12 },
  error: { color:'red', textAlign:'center', marginBottom:8 },
});
