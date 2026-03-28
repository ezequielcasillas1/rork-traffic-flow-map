import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export function TestNotificationButton() {
  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Traffic Alert! 🚗",
        body: "Heavy traffic detected on your route",
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  };

  const sendImmediateNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification from your app!",
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={sendLocalNotification}>
        <Text style={styles.buttonText}>Send Test Notification (2s delay)</Text>
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
    gap: 10,
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 