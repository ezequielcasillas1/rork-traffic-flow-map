import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';

type TrafficAlertType = 'traffic' | 'road-closure' | 'accident';

interface TrafficAlertData {
  locationName: string;
  timeAway: string;
  coordinates?: { lat: number; lng: number };
  severity?: 'low' | 'medium' | 'high';
}

export function TrafficNotifications() {
  const { expoPushToken } = useNotifications();
  const [isSending, setIsSending] = useState(false);

  const sendTrafficAlert = async (type: TrafficAlertType, data: TrafficAlertData) => {
    if (!expoPushToken) {
      Alert.alert('Error', 'No push token available. Make sure you\'re on a physical device.');
      return;
    }

    setIsSending(true);
    
    try {
      let title = '';
      let body = '';

      switch (type) {
        case 'traffic':
          title = `🚦 Traffic Alert`;
          body = `Heavy Traffic on ${data.locationName}`;
          break;
        case 'road-closure':
          title = `🚧 Road Closure`;
          body = `Road Closed at ${data.locationName}`;
          break;
        case 'accident':
          title = `⚠️ Accident Alert`;
          body = `Accident Near ${data.locationName}`;
          break;
      }

      const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { 
          type: type,
          locationName: data.locationName,
          timeAway: data.timeAway,
          coordinates: data.coordinates,
          severity: data.severity
        },
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
        Alert.alert('Success', `${title} sent!`);
      } else {
        Alert.alert('Error', 'Failed to send notification: ' + JSON.stringify(result));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  const testTrafficAlert = () => {
    sendTrafficAlert('traffic', {
      locationName: 'Main Street & 5th Avenue',
      timeAway: '5 minutes',
      coordinates: { lat: 40.7128, lng: -74.006 },
      severity: 'high'
    });
  };

  const testRoadClosure = () => {
    sendTrafficAlert('road-closure', {
      locationName: 'Broadway Bridge',
      timeAway: '10 minutes',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      severity: 'high'
    });
  };

  const testAccidentAlert = () => {
    sendTrafficAlert('accident', {
      locationName: 'Central Park West',
      timeAway: '3 minutes',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      severity: 'medium'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traffic Alert Notifications</Text>
      <Text style={styles.subtitle}>Test different types of traffic alerts</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.trafficButton, isSending && styles.buttonDisabled]} 
        onPress={testTrafficAlert}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>🚦 Test Traffic Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.closureButton, isSending && styles.buttonDisabled]} 
        onPress={testRoadClosure}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>🚧 Test Road Closure</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.accidentButton, isSending && styles.buttonDisabled]} 
        onPress={testAccidentAlert}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>⚠️ Test Accident Alert</Text>
      </TouchableOpacity>

      <Text style={styles.tokenText}>
        Push Token: {expoPushToken ? expoPushToken.substring(0, 20) + '...' : 'Not available'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  trafficButton: {
    backgroundColor: '#FF9800', // Orange for traffic
  },
  closureButton: {
    backgroundColor: '#F44336', // Red for road closure
  },
  accidentButton: {
    backgroundColor: '#FF5722', // Deep orange for accident
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
}); 