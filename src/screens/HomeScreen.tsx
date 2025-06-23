// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase/config';
import { signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AccountSettingsScreen from './AccountSettingsScreen';

interface Profile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

type Props = { user: User };

export default function HomeScreen({ user }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setProfile(snap.data() as Profile);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user.uid]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (editing) {
    return (
      <AccountSettingsScreen
        user={user}
        onDone={() => {
          setEditing(false);
          fetchProfile();
        }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-8">
      <Text className="text-2xl font-bold text-center mb-4">
        Hello, {profile?.firstName} {profile?.lastName}!
      </Text>
      <Text className="text-base text-center mb-2">
        Date of Birth: {profile?.dateOfBirth}
      </Text>
      <Text className="text-base text-center mb-6">
        Email: {profile?.email}
      </Text>

      <View className="mb-4">
        <Button title="Account Settings" onPress={() => setEditing(true)} />
      </View>
      <View>
        <Button title="Log Out" onPress={() => signOut(auth)} />
      </View>
    </SafeAreaView>
  );
}
