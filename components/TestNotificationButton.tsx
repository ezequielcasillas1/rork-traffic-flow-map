import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function TestNotificationButton() {
  const sendLocalNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚦 Traffic Alert",
          body: "Heavy traffic detected on Main Street",
          data: { type: 'traffic', location: 'Main Street' },
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2 
        },
      });
      console.log('Local notification scheduled');
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  };

  const sendImmediateNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Accident Alert",
          body: "Accident reported on Highway 101",
          data: { type: 'accident', location: 'Highway 101' },
        },
        trigger: null, // Send immediately
      });
      console.log('Immediate notification sent');
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Notifications</Text>
      <TouchableOpacity style={styles.button} onPress={sendLocalNotification}>
        <Text style={styles.buttonText}>Send Local Notification (2s delay)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={sendImmediateNotification}>
        <Text style={styles.buttonText}>Send Immediate Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 