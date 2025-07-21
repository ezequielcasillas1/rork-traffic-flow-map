import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

import { useMapSettings } from "@/hooks/use-map-settings";
import TrafficLegend from "@/components/TrafficLegend";
import MapControls from "@/components/MapControls";
import { LocationSearch } from "@/components/LocationSearch";

export default function TrafficMapScreen() {
  const mapRef = useRef<MapView | null>(null);
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
    requestLocationPermission();
  }, [requestLocationPermission]);

  const goToUserLocation = useCallback(() => {
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
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: result.lat,
        longitude: result.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Fallback for web platform
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.webMessage}>
          Google Maps with traffic data is not fully supported on web.
          Please use the mobile app for the full experience.
        </Text>
      </View>
    );
  }

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
  webMessage: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
    color: "#555",
  },
});