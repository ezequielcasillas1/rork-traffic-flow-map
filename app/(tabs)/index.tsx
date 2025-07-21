import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import * as Location from "expo-location";

import { useMapSettings } from "@/hooks/use-map-settings";
import TrafficLegend from "@/components/TrafficLegend";
import MapControls from "@/components/MapControls";
import { LocationSearch } from "@/components/LocationSearch";

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
  const { showTraffic, setShowTraffic } = useMapSettings();

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
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
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
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      requestLocationPermission();
    }
  }, [userLocation, requestLocationPermission]);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleSearchResult = (result: { lat: number; lng: number; name?: string }) => {
    if (Platform.OS === 'web') {
      console.log('Search navigation not available on web');
      return;
    }
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: result.lat,
        longitude: result.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Web fallback component
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webContainer}>
          <Text style={styles.webTitle}>Traffic Tracker</Text>
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
        </View>
      </View>
    );
  }

  // Native component with MapView
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsTraffic={showTraffic}
        onRegionChangeComplete={handleRegionChange}
        testID="traffic-map"
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
            pinColor="#2f95dc"
          />
        )}
      </MapView>
      
      <View style={styles.searchContainer}>
        <LocationSearch onSelectLocation={handleSearchResult} />
      </View>
      
      <MapControls 
        onMyLocationPress={goToUserLocation}
        showTraffic={showTraffic}
        onToggleTraffic={() => setShowTraffic(!showTraffic)}
      />
      
      {showTraffic && <TrafficLegend />}
      
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={requestLocationPermission}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 5,
  },
  errorContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: "red",
    fontWeight: "bold",
  },
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
  },
  webTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2f95dc",
    marginBottom: 20,
    textAlign: "center",
  },
  webMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    lineHeight: 24,
  },
  webFeatures: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webFeaturesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  webFeature: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
});