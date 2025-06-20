// src/screens/HomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';
import { signOut, User } from 'firebase/auth';

interface HomeScreenProps {
  user: User;
}

export default function HomeScreen({ user }: HomeScreenProps) {
  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged in App.tsx will fire and show LoginScreen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Hello, {user.email}</Text>
      <View style={styles.button}>
        <Button title="Log Out" onPress={handleLogout} />
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
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    alignSelf: 'center',
    width: '50%',
  },
});
