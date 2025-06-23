// src/screens/LandingScreen.tsx
import React from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';

type Props = {
  onLogin: () => void;
  onCreateAccount: () => void;
};

export default function LandingScreen({ onLogin, onCreateAccount }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center items-center">
      <Text className="text-2xl font-bold mb-8">
        Welcome to AuthApp
      </Text>
      <View className="w-4/5 mb-4">
        <Button title="Log In" onPress={onLogin} />
      </View>
      <View className="w-4/5">
        <Button title="Create Account" onPress={onCreateAccount} />
      </View>
    </SafeAreaView>
  );
}
