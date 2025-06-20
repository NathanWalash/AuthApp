// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { auth } from './src/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading…</Text>
      </SafeAreaView>
    );
  }

  return user ? <HomeScreen user={user} /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
