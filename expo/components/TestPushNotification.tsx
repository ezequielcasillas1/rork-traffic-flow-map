import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';

export function TestPushNotification() {
  const { expoPushToken } = useNotifications();
  const [isSending, setIsSending] = useState(false);

  const sendPushNotification = async () => {
    if (!expoPushToken) {
      Alert.alert('Error', 'No push token available. Make sure you\'re on a physical device.');
      return;
    }

    setIsSending(true);
    
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Traffic Alert! 🚗',
        body: 'Heavy traffic detected on your route',
        data: { someData: 'goes here' },
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        Alert.alert('Success', 'Push notification sent!');
      } else {
        Alert.alert('Error', 'Failed to send notification: ' + JSON.stringify(result));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokenText}>
        Push Token: {expoPushToken ? expoPushToken.substring(0, 20) + '...' : 'Not available'}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, isSending && styles.buttonDisabled]} 
        onPress={sendPushNotification}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>
          {isSending ? 'Sending...' : 'Send Real Push Notification'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 