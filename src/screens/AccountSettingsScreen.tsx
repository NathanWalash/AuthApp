// src/screens/AccountSettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
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
  // Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState('');
  // Email/Password
  const [newEmail, setNewEmail]           = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Status
  const [loading, setLoading]         = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail]     = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [message, setMessage]         = useState<string | null>(null);

  useEffect(() => {
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

  const reauth = () => {
    const cred = EmailAuthProvider.credential(
      user.email || '',
      currentPassword
    );
    return reauthenticateWithCredential(user, cred);
  };

  const saveProfile = async () => {
    setError(null); setMessage(null);
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
    setError(null); setMessage(null);
    if (!newEmail.trim() || !currentPassword) {
      setError('Email and current password required.');
      return;
    }
    setSavingEmail(true);
    try {
      await reauth();
      await updateEmail(user, newEmail.trim());
      setMessage('Email updated. Please log in again.');
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingEmail(false);
    }
  };

  const savePassword = async () => {
    setError(null); setMessage(null);
    if (newPassword !== confirmPassword || !currentPassword) {
      setError('Passwords must match and current password required.');
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
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={undefined} className="bg-white px-6 py-4">
      <Text className="text-2xl font-bold text-center mb-4">
        Account Settings
      </Text>
      {message && <Text className="text-green-600 text-center mb-2">{message}</Text>}
      {error   && <Text className="text-red-500 text-center mb-2">{error}</Text>}

      {/* Profile Section */}
      <Text className="text-xl font-semibold mt-4 mb-2">Edit Profile</Text>
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
      <View className="mb-4">
        <Button
          title={savingProfile ? 'Saving…' : 'Save Profile'}
          onPress={saveProfile}
          disabled={savingProfile}
        />
      </View>

      {/* Change Email */}
      <Text className="text-xl font-semibold mt-6 mb-2">Change Email</Text>
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <View className="mb-4">
        <Button
          title={savingEmail ? 'Updating…' : 'Update Email'}
          onPress={saveEmail}
          disabled={savingEmail}
        />
      </View>

      {/* Change Password */}
      <Text className="text-xl font-semibold mt-6 mb-2">Change Password</Text>
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-3"
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View className="mb-4">
        <Button
          title={savingPassword ? 'Updating…' : 'Update Password'}
          onPress={savePassword}
          disabled={savingPassword}
        />
      </View>

      <View className="mb-8">
        <Button title="Done" onPress={onDone} />
      </View>
    </ScrollView>
  );
}
