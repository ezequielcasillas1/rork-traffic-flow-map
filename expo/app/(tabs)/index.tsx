import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';

import { useMapSettings } from "@/hooks/use-map-settings";
import TrafficLegend from "@/components/TrafficLegend";
import MapControls from "@/components/MapControls";
import { LocationSearch } from "@/components/LocationSearch";
import { getGoogleMapStyles, GoogleMapStyle } from "@/lib/google-maps";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type SearchedLocation = {
  latitude: number;
  longitude: number;
  name?: string;
};

export default function TrafficMapScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128, // Default to NYC as a more central starting point
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapStyles, setMapStyles] = useState<GoogleMapStyle[]>([]);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const [mapLoadingTimeout, setMapLoadingTimeout] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  
  const { showTraffic, setShowTraffic, mapType, setMapType } = useMapSettings();
  const googleMapsApiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCYObeujRbMi5mXvhEtGbR8KaYp61PYHPo';

  // Check if running on web
  const isWeb = Platform.OS === 'web';
  
  // Debug logging
  console.log('Platform detected:', Platform.OS);
  console.log('isWeb:', isWeb);
  console.log('Google Maps API Key:', googleMapsApiKey ? 'Present' : 'Missing');

  // Load map styles on component mount
  useEffect(() => {
    const styles = getGoogleMapStyles();
    setMapStyles(styles);
  }, []);

  // Set timeout for map loading - only run once
  useEffect(() => {
    console.log('Setting up map loading timeout...');
    const timer = setTimeout(() => {
      console.log('Timeout triggered! mapLoadFailed:', mapLoadFailed);
      if (!mapLoadFailed) {
        console.log('Setting mapLoadingTimeout to true');
        setMapLoadingTimeout(true);
        console.log('Map loading timeout - showing fallback');
      } else {
        console.log('Map already failed, not setting timeout');
      }
    }, 5000); // Reduced to 5 seconds for faster testing

    return () => {
      console.log('Clearing timeout');
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - only run once

  // Count renders and force fallback after too many - only run once
  useEffect(() => {
    const newCount = renderCount + 1;
    setRenderCount(newCount);
    console.log('Render count:', newCount);
    
    if (newCount > 10) { // Force fallback after 10 renders
      console.log('Too many renders, forcing fallback');
      setMapLoadingTimeout(true);
    }
  }, []); // Only run once to prevent infinite loops

  // Convert map type to react-native-maps format
  const getMapTypeForNative = () => {
    switch (mapType) {
      case 'satellite':
        return 'satellite';
      case 'hybrid':
        return 'hybrid';
      case 'standard':
      default:
        return 'standard';
    }
  };

  // Handle traffic display
  const shouldShowTraffic = () => {
    return showTraffic;
  };

  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLocationLoading(true);
      setLocationError(null);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        setIsLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Update the map region to focus on user's location
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      
      // Animate to user location on mobile
      if (!isWeb && mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      
      console.log('User location set:', { latitude, longitude });
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Failed to get location");
    } finally {
      setIsLocationLoading(false);
    }
  }, [isWeb]);

  useEffect(() => {
    // Request location permission on both mobile and web
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Function to center map on user location
  const centerOnUserLocation = useCallback(() => {
    if (userLocation && !isWeb && mapRef.current) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [userLocation, isWeb]);

  const goToUserLocation = useCallback(() => {
    if (userLocation && !isWeb && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSearchedLocation(null);
    } else {
      requestLocationPermission();
    }
  }, [userLocation, requestLocationPermission, isWeb]);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleSearchResult = (result: { lat: number; lng: number; name?: string }) => {
    setSearchedLocation({
      latitude: result.lat,
      longitude: result.lng,
      name: result.name,
    });

    if (!isWeb && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: result.lat,
        longitude: result.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Web-compatible map placeholder
  const WebMapPlaceholder = () => (
    <View style={styles.webMapContainer}>
      <Text style={styles.webMapTitle}>🗺️ Traffic Flow Map</Text>
      <Text style={styles.webMapSubtitle}>Map View (Web Version)</Text>
      
      <View style={styles.mapInfo}>
        <Text style={styles.mapInfoText}>
          📍 Current Region: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
        </Text>
        <Text style={styles.mapInfoText}>
          🎯 Map Type: {mapType}
        </Text>
        <Text style={styles.mapInfoText}>
          🚦 Traffic Display: {showTraffic ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {userLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>📍 Your Location</Text>
          <Text style={styles.locationText}>
            {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {searchedLocation && (
        <View style={styles.searchedLocationInfo}>
          <Text style={styles.locationTitle}>🔍 Searched Location</Text>
          <Text style={styles.locationText}>
            {searchedLocation.name || `${searchedLocation.latitude.toFixed(4)}, ${searchedLocation.longitude.toFixed(4)}`}
          </Text>
        </View>
      )}

      <View style={styles.webNote}>
        <Text style={styles.webNoteText}>
          💡 This is the web version of the app. For full map functionality, 
          use the mobile app with Expo Go.
        </Text>
      </View>
    </View>
  );

  // Map component for mobile
  const renderMap = () => {
    console.log('renderMap called, isWeb:', isWeb);
    
    if (isWeb) {
      console.log('Returning web placeholder');
      return <WebMapPlaceholder />;
    }

    console.log('Attempting to render mobile map');
    console.log('About to create map container');
    
    // Show fallback if map failed to load or timed out
    console.log('Checking fallback conditions - mapLoadFailed:', mapLoadFailed, 'mapLoadingTimeout:', mapLoadingTimeout, 'renderCount:', renderCount);
    if (mapLoadFailed || mapLoadingTimeout || renderCount > 10) {
      console.log('Showing map fallback due to error, timeout, or too many renders');
      console.log('Rendering simple fallback component');
      return (
        <View style={styles.simpleFallback}>
          <Text style={styles.simpleFallbackTitle}>🗺️ Traffic Flow Map</Text>
          <Text style={styles.simpleFallbackText}>Map Loading Failed</Text>
          <Text style={styles.simpleFallbackText}>Showing Fallback Interface</Text>
          <Text style={styles.simpleFallbackText}>Render Count: {renderCount}</Text>
          <Text style={styles.simpleFallbackText}>FALLBACK ACTIVE</Text>
        </View>
      );
    }
    
    // Mobile map with error handling
    try {
      console.log('Creating map container');
      const result = (
        <View style={styles.mapContainer}>
          <Text style={styles.debugText}>Map Container Loaded</Text>
          <Text style={styles.debugText2}>Attempting to load Google Maps</Text>
          <TouchableOpacity 
            style={styles.forceFallbackButton}
            onPress={() => {
              setMapLoadingTimeout(true);
              console.log('Manually forcing fallback');
            }}
          >
            <Text style={styles.forceFallbackText}>Force Fallback (Test)</Text>
          </TouchableOpacity>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            showsTraffic={shouldShowTraffic()}
            mapType={getMapTypeForNative()}
            onError={(error) => {
              console.error('Map error:', error);
              setMapLoadFailed(true);
            }}
            onLoad={() => {
              console.log('Map loaded successfully');
              setMapLoadFailed(false);
            }}
            onMapReady={() => {
              console.log('Map is ready');
            }}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
                description="You are here"
                pinColor="green"
              />
            )}
            
            {/* Searched location marker */}
            {searchedLocation && (
              <Marker
                coordinate={{
                  latitude: searchedLocation.latitude,
                  longitude: searchedLocation.longitude,
                }}
                title={searchedLocation.name || "Searched Location"}
                description="Selected location"
                pinColor="red"
              />
            )}
          </MapView>
        </View>
      );
      console.log('Map container created successfully');
      return result;
    } catch (error) {
      console.error('Error rendering map:', error);
      return <MobileMapFallback />;
    }
  };

  // Fallback for mobile when map fails
  const MobileMapFallback = () => {
    console.log('MobileMapFallback component rendering');
    return (
      <View style={styles.mobileFallbackContainer}>
        <Text style={styles.mobileFallbackTitle}>🗺️ Traffic Flow Map</Text>
        <Text style={styles.mobileFallbackSubtitle}>Mobile Version (FALLBACK)</Text>
        
        <View style={styles.mobileMapInfo}>
          <Text style={styles.mobileMapInfoText}>
            📍 Current Region: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
          </Text>
          <Text style={styles.mobileMapInfoText}>
            🎯 Map Type: {mapType}
          </Text>
          <Text style={styles.mobileMapInfoText}>
            🚦 Traffic Display: {showTraffic ? 'Enabled' : 'Disabled'}
          </Text>
          <Text style={styles.mobileMapInfoText}>
            📱 Platform: {Platform.OS}
          </Text>
          <Text style={styles.mobileMapInfoText}>
            🔑 API Key: {googleMapsApiKey ? 'Configured' : 'Missing'}
          </Text>
        </View>

        {userLocation && (
          <View style={styles.mobileLocationInfo}>
            <Text style={styles.mobileLocationTitle}>📍 Your Location</Text>
            <Text style={styles.mobileLocationText}>
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setMapLoadFailed(false);
            setMapLoadingTimeout(false);
            setRenderCount(0);
          }}
        >
          <Text style={styles.retryText}>Retry Loading Map</Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log('About to render main component');
  console.log('Current state - mapLoadFailed:', mapLoadFailed, 'mapLoadingTimeout:', mapLoadingTimeout);
  const mapComponent = renderMap();
  console.log('Map component rendered:', mapComponent ? 'Yes' : 'No');
  
  return (
    <View style={[styles.container, { backgroundColor: isWeb ? "#f8f9fa" : "transparent" }]}>
      {mapComponent}
      
      {/* Location Status Indicator */}
      {isLocationLoading && (
        <View style={styles.locationStatusContainer}>
          <Text style={styles.locationStatusText}>📍 Detecting your location...</Text>
        </View>
      )}
      
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestLocationPermission}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <LocationSearch onSelectLocation={handleSearchResult} />
      
      <MapControls
        onMyLocationPress={goToUserLocation}
        showTraffic={shouldShowTraffic()}
        onToggleTraffic={() => setShowTraffic(!showTraffic)}
        mapStyles={mapStyles}
        selectedMapStyle={mapType}
        onMapStyleChange={(styleId: string) => {
          setMapType(styleId as any);
        }}
      />
      
      <TrafficLegend />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "transparent",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  debugText: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: 5,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugText2: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "rgba(255,0,0,0.7)",
    color: "white",
    padding: 5,
    borderRadius: 4,
    zIndex: 1000,
  },
  testMap: {
    flex: 1,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  testMapText: {
    fontSize: 16,
    color: "#1976d2",
    marginBottom: 10,
    textAlign: "center",
  },
  debugOverlay: {
    position: "absolute",
    top: 100,
    right: 10,
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
  },
  debugOverlayText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  forceFallbackButton: {
    position: "absolute",
    top: 80,
    right: 10,
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
    zIndex: 1000,
  },
  forceFallbackText: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  simpleFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    padding: 40,
    zIndex: 9999,
    borderWidth: 10,
    borderColor: "red",
  },
  simpleFallbackTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  simpleFallbackText: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
    textAlign: "center",
  },
  webMapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webMapTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2f95dc",
    marginBottom: 8,
    textAlign: "center",
  },
  webMapSubtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  mapInfo: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  },
  mapInfoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  locationInfo: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  searchedLocationInfo: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  webNote: {
    backgroundColor: "#fff8e1",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  webNoteText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    lineHeight: 20,
  },
  locationStatusContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 123, 255, 0.9)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 10,
  },
  locationStatusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
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
    backgroundColor: "#2f95dc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
  mobileFallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mobileFallbackTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2f95dc",
    marginBottom: 8,
    textAlign: "center",
  },
  mobileFallbackSubtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  mobileMapInfo: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  },
  mobileMapInfoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  mobileLocationInfo: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  mobileLocationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  mobileLocationText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});