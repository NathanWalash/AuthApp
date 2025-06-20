// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';
import { signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

  useEffect(() => {
    // load profile once
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as Profile);
        }
      })
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>
        Hello, {profile?.firstName} {profile?.lastName}!
      </Text>
      <Text style={styles.detail}>Date of Birth: {profile?.dateOfBirth}</Text>
      <Text style={styles.detail}>Email: {profile?.email}</Text>

      <View style={styles.button}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { flex:1, padding:24, backgroundColor:'#fff' },
  welcome:   { fontSize:24, textAlign:'center', marginBottom:12 },
  detail:    { fontSize:16, textAlign:'center', marginBottom:6 },
  button:    { marginTop:32, alignSelf:'center', width:'50%' },
});
