import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useNotifications } from '../hooks/useNotifications';
import { useMapSettings } from '../hooks/use-map-settings';
import { sendTrafficAlert, saveTrafficAlert, sendRoadClosureAlert } from '../lib/trafficAlerts';
import { 
  getLocalTrafficData, 
  getActiveTrafficData, 
  getSignificantTrafficAlerts,
  RealTrafficData,
  monitorTrafficConditions
} from '../lib/realTrafficData';
import { 
  detectRoadClosures, 
  monitorRoadClosures, 
  RoadClosureData 
} from '../lib/roadClosureDetection';

interface TrafficAlertData {
  locationName: string;
  timeAway: string;
  coordinates?: { lat: number; lng: number };
  severity?: 'low' | 'medium' | 'high';
}

export function TrafficNotifications() {
  const { expoPushToken } = useNotifications();
  const { alertRadius, trafficAlertsEnabled, roadClosuresEnabled } = useMapSettings();
  const [isSending, setIsSending] = useState(false);
  const [realTrafficData, setRealTrafficData] = useState<RealTrafficData[]>([]);
  const [activeTrafficData, setActiveTrafficData] = useState<RealTrafficData[]>([]);
  const [roadClosures, setRoadClosures] = useState<RoadClosureData[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize with user's actual location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({ 
            lat: location.coords.latitude, 
            lng: location.coords.longitude 
          });
        } else {
          // Fallback to a default location if permission denied
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
        }
      } catch (error) {
        console.error('Error getting user location:', error);
        // Fallback to a default location
        setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
      }
    };

    getUserLocation();
  }, []);

  // Load real traffic data and road closures
  useEffect(() => {
    if (userLocation) {
      if (trafficAlertsEnabled) {
        loadRealTrafficData();
      }
      if (roadClosuresEnabled) {
        loadRoadClosures();
      }
    }
  }, [userLocation, trafficAlertsEnabled, roadClosuresEnabled, alertRadius]);

  // Monitor traffic conditions and road closures every 5 minutes
  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(() => {
      // Monitor traffic conditions
      if (trafficAlertsEnabled) {
        monitorTrafficConditions(userLocation, (alerts) => {
          if (alerts.length > 0) {
            console.log('New traffic alerts detected:', alerts);
          }
        }, alertRadius);
      }
      
      // Monitor road closures
      if (roadClosuresEnabled) {
        monitorRoadClosures(userLocation, (closures) => {
          if (closures.length > 0) {
            console.log('New road closures detected:', closures);
            // Send push notifications for new closures
            closures.forEach(closure => {
              if (expoPushToken) {
                sendRoadClosureAlert(expoPushToken, closure);
              }
            });
          }
        }, alertRadius);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [userLocation, expoPushToken, trafficAlertsEnabled, roadClosuresEnabled, alertRadius]);

  const loadRealTrafficData = async () => {
    if (!userLocation) return;
    
    try {
      const trafficData = await getLocalTrafficData(userLocation, alertRadius);
      setRealTrafficData(trafficData);
      setActiveTrafficData(getActiveTrafficData(trafficData));
    } catch (error) {
      console.error('Error loading real traffic data:', error);
    }
  };

  const loadRoadClosures = async () => {
    if (!userLocation) return;
    
    try {
      const closures = await detectRoadClosures(userLocation, alertRadius);
      setRoadClosures(closures);
    } catch (error) {
      console.error('Error loading road closures:', error);
    }
  };

  const sendTrafficAlertFromData = async (trafficData: RealTrafficData) => {
    if (!expoPushToken) {
      Alert.alert('Error', 'No push token available. Make sure you\'re on a physical device.');
      return;
    }

    setIsSending(true);
    
    try {
      const alertData: TrafficAlertData = {
        locationName: trafficData.location.name,
        timeAway: trafficData.timeAway,
        coordinates: trafficData.location.coordinates,
        severity: trafficData.severity
      };

      const success = await sendTrafficAlert(expoPushToken, 'traffic', alertData);
      
      if (success) {
        // Save to database
        await saveTrafficAlert({
          type: 'traffic',
          locationName: trafficData.location.name,
          timeAway: trafficData.timeAway,
          coordinates: trafficData.location.coordinates,
          severity: trafficData.severity,
          description: trafficData.description
        });

        Alert.alert('Success', `${trafficData.title} sent!`);
      } else {
        Alert.alert('Error', 'Failed to send notification');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  const refreshTrafficData = () => {
    if (userLocation) {
      if (trafficAlertsEnabled) {
        loadRealTrafficData();
      }
      if (roadClosuresEnabled) {
        loadRoadClosures();
      }
    }
  };

  const sendRoadClosureAlertFromData = async (closureData: RoadClosureData) => {
    if (!expoPushToken) {
      Alert.alert('Error', 'No push token available. Make sure you\'re on a physical device.');
      return;
    }

    setIsSending(true);
    
    try {
      const success = await sendRoadClosureAlert(expoPushToken, closureData);
      
      if (success) {
        Alert.alert('Success', `🚧 Road Closure Alert sent!`);
        // Save to database
        await saveTrafficAlert({
          type: 'road-closure',
          locationName: closureData.location.name,
          timeAway: closureData.timeAway,
          coordinates: closureData.location.coordinates,
          severity: closureData.severity,
          description: closureData.description
        });
      } else {
        Alert.alert('Error', 'Failed to send road closure notification');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send road closure notification: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  const significantAlerts = getSignificantTrafficAlerts(activeTrafficData);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'critical': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic': return '🚦';
      case 'accident': return '⚠️';
      case 'road-closure': return '🚧';
      case 'construction': return '🏗️';
      default: return '📢';
    }
  };

  // Removed getNearbyActiveIncidents() as it's not needed for real traffic data

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Real Traffic Alerts</Text>
        <Text style={styles.subtitle}>
          {activeTrafficData.length} traffic conditions • {significantAlerts.length} significant alerts • {roadClosures.length} road closures • {alertRadius} mile radius
        </Text>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={refreshTrafficData}
        disabled={isSending}
      >
        <Text style={styles.refreshButtonText}>
          🔄 Refresh Traffic Data
        </Text>
      </TouchableOpacity>

      {/* Significant Traffic Alerts */}
      {trafficAlertsEnabled && significantAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Significant Traffic Alerts</Text>
          {significantAlerts.slice(0, 3).map((trafficData) => (
            <TouchableOpacity
              key={trafficData.id}
              style={[styles.trafficCard, { borderLeftColor: getSeverityColor(trafficData.severity) }]}
              onPress={() => sendTrafficAlertFromData(trafficData)}
              disabled={isSending}
            >
              <View style={styles.trafficHeader}>
                <Text style={styles.trafficTitle}>{trafficData.title}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(trafficData.severity) }]}>
                  <Text style={styles.severityText}>{trafficData.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.trafficDescription}>{trafficData.description}</Text>
              <View style={styles.trafficDetails}>
                <Text style={styles.trafficDetail}>📍 {trafficData.location.name}</Text>
                <Text style={styles.trafficDetail}>⏱️ {trafficData.estimatedDuration}</Text>
                <Text style={styles.trafficDetail}>🚗 {trafficData.timeAway}</Text>
                <Text style={styles.trafficDetail}>📊 {Math.round(trafficData.speedReduction)}% slower</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Road Closures */}
      {roadClosuresEnabled && roadClosures.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚧 Road Closures Detected</Text>
          {roadClosures.slice(0, 3).map((closureData) => (
            <TouchableOpacity
              key={closureData.id}
              style={[styles.trafficCard, { borderLeftColor: getSeverityColor(closureData.severity) }]}
              onPress={() => sendRoadClosureAlertFromData(closureData)}
              disabled={isSending}
            >
              <View style={styles.trafficHeader}>
                <Text style={styles.trafficTitle}>{closureData.title}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(closureData.severity) }]}>
                  <Text style={styles.severityText}>{closureData.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.trafficDescription}>{closureData.description}</Text>
              <View style={styles.trafficDetails}>
                <Text style={styles.trafficDetail}>📍 {closureData.location.name}</Text>
                <Text style={styles.trafficDetail}>⏱️ {closureData.estimatedDuration}</Text>
                <Text style={styles.trafficDetail}>🚗 {closureData.timeAway}</Text>
                <Text style={styles.trafficDetail}>📊 {closureData.trafficImpact} impact</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* All Traffic Conditions */}
      {trafficAlertsEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Traffic Conditions</Text>
          {activeTrafficData.slice(0, 5).map((trafficData) => (
            <TouchableOpacity
              key={trafficData.id}
              style={[styles.trafficCard, { borderLeftColor: getSeverityColor(trafficData.severity) }]}
              onPress={() => sendTrafficAlertFromData(trafficData)}
              disabled={isSending}
            >
              <View style={styles.trafficHeader}>
                <Text style={styles.trafficTitle}>{trafficData.title}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(trafficData.severity) }]}>
                  <Text style={styles.severityText}>{trafficData.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.trafficDescription}>{trafficData.description}</Text>
              <View style={styles.trafficDetails}>
                <Text style={styles.trafficDetail}>📍 {trafficData.location.name}</Text>
                <Text style={styles.trafficDetail}>⏱️ {trafficData.estimatedDuration}</Text>
                <Text style={styles.trafficDetail}>🚗 {trafficData.timeAway}</Text>
                <Text style={styles.trafficDetail}>📊 {Math.round(trafficData.speedReduction)}% slower</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  trafficCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trafficHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trafficTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trafficDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  trafficDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  trafficDetail: {
    fontSize: 12,
    color: '#888',
    marginRight: 10,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 