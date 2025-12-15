import React from 'react';
import { StyleSheet, Text, View, StatusBar} from 'react-native';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!backendUrl) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL environment variable is not defined');
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>SwiftyProtein</Text>
      <Text style={styles.subtitle}>Aplicación React Native/Expo Lista</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Conectando a Backend:</Text>
        <Text style={styles.infoUrl}>{backendUrl}</Text>
      </View>

      {/* ¡Comienza a construir tu LoginView aquí! */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  infoBox: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  infoUrl: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: '#007BFF',
  }
});