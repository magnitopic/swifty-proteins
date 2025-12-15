import React from 'react';
import { Text, View, StatusBar } from 'react-native';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!backendUrl) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL environment variable is not defined');
}

export default function App() {
  return (
    <View className="flex-1 bg-purple-600 items-center justify-center p-5">
      <StatusBar barStyle="light-content" />

      {/* Main card */}
      <View className="bg-white rounded-3xl p-8 w-11/12 shadow-xl">

        {/* Title */}
        <View className="mb-6">
          <Text className="text-5xl font-bold text-purple-700 text-center mb-2">
            SwiftyProtein
          </Text>
          <View className="h-1 w-20 bg-pink-500 rounded-full mx-auto" />
        </View>

        {/* Subtitle */}
        <Text className="text-lg text-gray-700 text-center mb-8 font-medium">
          React Native/Expo application with NativeWind
        </Text>

        {/* Info Box */}
        <View className="bg-purple-100 rounded-2xl p-6 border-2 border-purple-300">
          <Text className="text-sm text-purple-800 text-center mb-3 font-semibold">
            🔗 Conectando a Backend:
          </Text>
          <View className="bg-purple-200 rounded-lg p-3">
            <Text className="text-xs text-purple-900 text-center font-mono">
              {backendUrl}
            </Text>
          </View>
        </View>

        {/* Status badge */}
        <View className="mt-6 flex-row justify-center items-center">
          <View className="w-3 h-3 bg-green-400 rounded-full mr-2" />
          <Text className="text-gray-700 text-sm font-semibold">
            NativeWind Active ✨
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text className="text-white text-xs mt-8 text-center font-medium">
        Powered by Tailwind CSS + NativeWind
      </Text>
    </View>
  );
}