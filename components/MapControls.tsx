import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Modal, Text, ScrollView } from "react-native";
import { MapPin, Layers, Palette, Settings } from "lucide-react-native";
import { useMapSettings } from "@/hooks/use-map-settings";
import { lightTheme, darkTheme } from "@/constants/theme";

// Unified map style interface
interface MapStyle {
  id: string;
  name: string;
  description: string;
}

type MapControlsProps = {
  onMyLocationPress: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  mapStyles?: MapStyle[];
  selectedMapStyle?: string;
  onMapStyleChange?: (styleId: string) => void;
};

export default function MapControls({
  onMyLocationPress,
  showTraffic,
  onToggleTraffic,
  mapStyles = [],
  selectedMapStyle = 'main',
  onMapStyleChange,
}: MapControlsProps) {
  const { darkMode } = useMapSettings();
  const theme = darkMode ? darkTheme : lightTheme;
  const [showMapStyles, setShowMapStyles] = useState(false);
  
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={onMyLocationPress}
        testID="my-location-button"
      >
        <MapPin size={24} color={theme.text} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.controlButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          showTraffic && { backgroundColor: theme.primaryLight },
        ]}
        onPress={onToggleTraffic}
        testID="traffic-toggle-button"
      >
        <Layers size={24} color={showTraffic ? theme.primary : theme.text} />
      </TouchableOpacity>

      {mapStyles.length > 0 && onMapStyleChange && (
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => setShowMapStyles(true)}
          testID="map-style-button"
        >
          <Palette size={24} color={theme.text} />
        </TouchableOpacity>
      )}

      {/* Map Style Modal */}
      <Modal
        visible={showMapStyles}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMapStyles(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Map Style</Text>
              <TouchableOpacity
                onPress={() => setShowMapStyles(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.mapStylesList}>
              {mapStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.mapStyleItem,
                    { borderBottomColor: theme.border },
                    selectedMapStyle === style.id && { backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => {
                    onMapStyleChange?.(style.id);
                    setShowMapStyles(false);
                  }}
                >
                  <Text style={[
                    styles.mapStyleName,
                    { color: theme.text },
                    selectedMapStyle === style.id && { color: theme.primary },
                  ]}>
                    {style.name}
                  </Text>
                  <Text style={[styles.mapStyleDescription, { color: theme.textSecondary }]}>
                    {style.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    right: 16,
    bottom: 100,
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
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderRadius: 10,
    width: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
     closeButton: {
     padding: 5,
   },
  closeButtonText: {
    fontSize: 24,
  },
  mapStylesList: {
    maxHeight: 300,
  },
  mapStyleItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  mapStyleName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mapStyleDescription: {
    fontSize: 12,
  },
});