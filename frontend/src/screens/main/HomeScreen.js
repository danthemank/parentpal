import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Parent'}!</Text>
      </View>
      <View style={styles.dashboard}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Tips</Text>
          <Text style={styles.cardContent}>Loading personalized tips...</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Reminders</Text>
          <Text style={styles.cardContent}>No upcoming reminders</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2'
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  dashboard: {
    padding: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  cardContent: {
    color: '#666'
  }
});
