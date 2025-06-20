// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { auth } from './src/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [mode, setMode] = useState<'landing' | 'login' | 'signup'>('landing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading…</Text>
      </SafeAreaView>
    );
  }

  if (user) {
    return <HomeScreen user={user} />;
  }

  // Not authenticated yet:
  if (mode === 'landing') {
    return (
      <LandingScreen
        onLogin={() => setMode('login')}
        onCreateAccount={() => setMode('signup')}
      />
    );
  }

  if (mode === 'login') {
    return <LoginScreen onCreateAccount={() => setMode('signup')} />;
  }

  // mode === 'signup'
  return <SignupScreen />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
