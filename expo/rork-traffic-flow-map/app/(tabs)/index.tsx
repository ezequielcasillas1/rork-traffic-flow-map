import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Platform, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Layers, AlertCircle, Navigation } from 'lucide-react-native';

import { useMapSettings } from '@/hooks/useMapSettings';
import { useTheme } from '@/hooks/useTheme';
import { TransparentCard } from '@/components/TransparentCard';
import { TransparentButton } from '@/components/TransparentButton';
import { colors } from '@/constants/colors';

// Conditionally import MapView only on native platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
}

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function TrafficMapScreen() {
  const mapRef = useRef<any>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { showTraffic, mapType, showLegend } = useMapSettings();
  const { isDark } = useTheme();

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Update region without triggering onRegionChangeComplete
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Failed to get location");
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestLocationPermission();
    }
  }, [requestLocationPermission]);

  const goToUserLocation = useCallback(() => {
    if (Platform.OS === 'web') {
      console.log('Location features not available on web');
      return;
    }
    
    if (userLocation && mapRef.current) {
      const newRegion = {
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      // Update region directly without triggering onRegionChangeComplete
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    } else {
      requestLocationPermission();
    }
  }, [userLocation, requestLocationPermission]);

  // Web fallback component
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? colors.black.primary : colors.white.primary }]}>
        <TransparentCard variant="heavy" style={styles.webContainer}>
          <Text style={styles.webTitle}>Traffic Flow Map</Text>
          <Text style={styles.webMessage}>
            Google Maps with traffic data is not fully supported on web.
            Please use the mobile app for the full experience.
          </Text>
          <View style={styles.webFeatures}>
            <Text style={styles.webFeaturesTitle}>Available on Mobile:</Text>
            <Text style={styles.webFeature}>• Real-time traffic data</Text>
            <Text style={styles.webFeature}>• Location search</Text>
            <Text style={styles.webFeature}>• GPS navigation</Text>
            <Text style={styles.webFeature}>• Traffic condition indicators</Text>
          </View>
        </TransparentCard>
      </View>
    );
  }

  // Native component with MapView
  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.black.primary : colors.white.primary }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsTraffic={showTraffic}
        mapType={mapType}
        testID="traffic-map"
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
            pinColor={colors.accent.blue}
          />
        )}
      </MapView>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TransparentCard variant="medium" style={styles.searchCard}>
          <View style={styles.searchContent}>
            <MapPin size={20} color={colors.white.primary} style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search location...</Text>
          </View>
        </TransparentCard>
      </View>
      
      {/* Simple Map Controls */}
      <View style={styles.controlsContainer}>
        <TransparentCard variant="medium" style={styles.controlsCard}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.transparent.primary }]}
            onPress={goToUserLocation}
            activeOpacity={0.8}
          >
            <MapPin size={20} color={colors.white.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: showTraffic ? colors.accent.blue : colors.transparent.secondary }
            ]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Layers size={20} color={colors.white.primary} />
          </TouchableOpacity>
        </TransparentCard>
      </View>
      
      {/* Traffic Legend */}
      {showTraffic && showLegend && (
        <View style={styles.legendContainer}>
          <TransparentCard variant="medium" style={styles.legendCard}>
            <Text style={styles.legendTitle}>Traffic Conditions</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: colors.accent.green }]} />
                <Text style={styles.legendText}>Light Traffic</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: colors.accent.yellow }]} />
                <Text style={styles.legendText}>Medium Traffic</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: colors.accent.red }]} />
                <Text style={styles.legendText}>Heavy Traffic</Text>
              </View>
            </View>
          </TransparentCard>
        </View>
      )}
      
      {/* Error Message */}
      {locationError && (
        <View style={styles.errorContainer}>
          <TransparentCard variant="dark" style={styles.errorCard}>
            <View style={styles.errorContent}>
              <AlertCircle size={20} color={colors.white.primary} />
              <Text style={styles.errorText}>{locationError}</Text>
              <TransparentButton
                title="Retry"
                onPress={requestLocationPermission}
                variant="outline"
                size="small"
              />
            </View>
          </TransparentCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  
  // Search
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchCard: {
    padding: 16,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: colors.white.primary,
    opacity: 0.8,
    flex: 1,
  },
  
  // Controls
  controlsContainer: {
    position: "absolute",
    top: 140,
    right: 20,
    zIndex: 10,
  },
  controlsCard: {
    padding: 12,
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.light,
  },
  
  // Legend
  legendContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  legendCard: {
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: colors.white.primary,
    flex: 1,
  },
  
  // Error Container
  errorContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  errorCard: {
    padding: 16,
  },
  errorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.white.primary,
  },
  
  // Web Fallback Styles
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 40,
  },
  webTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.white.primary,
  },
  webMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    color: colors.white.primary,
  },
  webFeatures: {
    padding: 20,
    borderRadius: 12,
  },
  webFeaturesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.white.primary,
  },
  webFeature: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 20,
    color: colors.white.primary,
  },
});
