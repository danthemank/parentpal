import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: new Date(),
    description: ''
  });

  const addReminder = () => {
    if (newReminder.title.trim()) {
      setReminders([
        ...reminders,
        { ...newReminder, id: Date.now().toString() }
      ]);
      setModalVisible(false);
      setNewReminder({ title: '', date: new Date(), description: '' });
    }
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <Text style={styles.reminderTitle}>{item.title}</Text>
      <Text style={styles.reminderDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.reminderDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Reminder</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Reminder Title"
              value={newReminder.title}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              value={newReminder.description}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, description: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addReminder}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  listContainer: {
    padding: 15
  },
  reminderCard: {
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
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  reminderDescription: {
    fontSize: 14,
    color: '#333'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: '45%'
  },
  cancelButton: {
    backgroundColor: '#ff6b6b'
  },
  saveButton: {
    backgroundColor: '#4A90E2'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
