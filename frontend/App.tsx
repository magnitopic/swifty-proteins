import React, { useState } from 'react';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/RegisterScreen';
import Home from './src/screens/main/HomeScreen_test';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!backendUrl) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL environment variable is not defined');
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Register' | 'Home'>('Login');

  return (
    <>
      {currentScreen === 'Login' && (
        <LoginScreen
          onNavigateToRegister={() => setCurrentScreen('Register')}
          onNavigateToHome={() => setCurrentScreen('Home')}
        />
      )}
      {currentScreen === 'Register' && (
        <SignUpScreen onNavigateToLogin={() => setCurrentScreen('Login')} />
      )}
      {currentScreen === 'Home' && (
        <Home onNavigateToLogin={() => setCurrentScreen('Login')} />
      )}
    </>
  );
}