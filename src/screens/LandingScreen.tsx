// src/screens/LandingScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

type Props = {
  onLogin: () => void;
  onCreateAccount: () => void;
};

export default function LandingScreen({ onLogin, onCreateAccount }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to AuthApp</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={onLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Create Account" onPress={onCreateAccount} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  title: { fontSize: 24, marginBottom: 32 },
  buttonContainer: { width: '80%', marginVertical: 8 },
});
