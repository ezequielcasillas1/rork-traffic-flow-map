import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { MapPin, Layers } from "lucide-react-native";

type MapControlsProps = {
  onMyLocationPress: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
};

export default function MapControls({
  onMyLocationPress,
  showTraffic,
  onToggleTraffic,
}: MapControlsProps) {
  // Don't render controls on web
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onMyLocationPress}
        testID="my-location-button"
      >
        <MapPin size={24} color="#333" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.controlButton,
          showTraffic && styles.activeControlButton,
        ]}
        onPress={onToggleTraffic}
        testID="traffic-toggle-button"
      >
        <Layers size={24} color={showTraffic ? "#2f95dc" : "#333"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activeControlButton: {
    backgroundColor: "#f0f8ff",
  },
});