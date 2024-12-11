import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import apiClient from '../../api/client';

export default function TipsScreen() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await apiClient.get('/tips');
      setTips(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTip = ({ item }) => (
    <TouchableOpacity style={styles.tipCard}>
      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipContent}>{item.content}</Text>
      <Text style={styles.tipCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading tips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tips}
        renderItem={renderTip}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    padding: 15
  },
  tipCard: {
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
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  tipContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  tipCategory: {
    fontSize: 12,
    color: '#4A90E2',
    textTransform: 'uppercase'
  }
});
