// src/screens/AccountSettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native';
import { auth, db } from '../firebase/config';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type Props = {
  user: User;
  onDone: () => void;
};

export default function AccountSettingsScreen({ user, onDone }: Props) {
  // profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState('');
  // email/password fields
  const [newEmail, setNewEmail]         = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading]   = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail]     = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [message, setMessage]   = useState<string | null>(null);

  useEffect(() => {
    // load existing profile
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setDob(data.dateOfBirth || '');
        }
      })
      .finally(() => setLoading(false));
  }, [user.uid]);

  // helper to reauthenticate
  const reauth = async () => {
    const cred = EmailAuthProvider.credential(
      user.email || '',
      currentPassword
    );
    return reauthenticateWithCredential(user, cred);
  };

  const saveProfile = async () => {
    setError(null);
    setMessage(null);
    if (!firstName || !lastName || !dob) {
      setError('All profile fields are required.');
      return;
    }
    setSavingProfile(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        dateOfBirth: dob,
      });
      setMessage('Profile updated.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingProfile(false);
    }
  };

  const saveEmail = async () => {
    setError(null);
    setMessage(null);
    if (!newEmail.trim() || !currentPassword) {
      setError('Email and current password are required.');
      return;
    }
    setSavingEmail(true);
    try {
      await reauth();
      await updateEmail(user, newEmail.trim());
      setMessage('Email updated. Please log in again.');
      onDone(); // kick back to Home (you’ll need to sign out elsewhere)
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingEmail(false);
    }
  };

  const savePassword = async () => {
    setError(null);
    setMessage(null);
    if (newPassword !== confirmPassword || !currentPassword) {
      setError('Passwords must match and current password is required.');
      return;
    }
    setSavingPassword(true);
    try {
      await reauth();
      await updatePassword(user, newPassword);
      setMessage('Password updated.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingPassword(false);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Account Settings</Text>
      {error   && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}

      {/* Profile Section */}
      <Text style={styles.section}>Edit Profile</Text>
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
        <Button
          title={savingProfile ? 'Saving…' : 'Save Profile'}
          onPress={saveProfile}
          disabled={savingProfile}
        />
      </View>

      {/* Email Section */}
      <Text style={styles.section}>Change Email</Text>
      <TextInput
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.button}>
        <Button
          title={savingEmail ? 'Updating…' : 'Update Email'}
          onPress={saveEmail}
          disabled={savingEmail}
        />
      </View>

      {/* Password Section */}
      <Text style={styles.section}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.button}>
        <Button
          title={savingPassword ? 'Updating…' : 'Update Password'}
          onPress={savePassword}
          disabled={savingPassword}
        />
      </View>

      <View style={styles.button}>
        <Button title="Done" onPress={onDone} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 24, backgroundColor: '#fff' },
  header:    { fontSize: 24, textAlign: 'center', marginBottom: 16 },
  section:   { marginTop: 24, fontSize: 18, marginBottom: 8 },
  input:     {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
  },
  button:    { marginTop: 12 },
  error:     { color: 'red', textAlign: 'center', marginBottom: 8 },
  message:   { color: 'green', textAlign: 'center', marginBottom: 8 },
});
