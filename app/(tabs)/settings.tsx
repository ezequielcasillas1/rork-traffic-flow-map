import React from "react";
import { StyleSheet, View, Text, Switch, ScrollView } from "react-native";
import { useMapSettings } from "@/hooks/use-map-settings";

export default function SettingsScreen() {
  const { 
    showTraffic, 
    setShowTraffic,
    mapType,
    setMapType,
    showLegend,
    setShowLegend
  } = useMapSettings();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Traffic</Text>
          <Switch
            value={showTraffic}
            onValueChange={setShowTraffic}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={showTraffic ? "#2f95dc" : "#f4f3f4"}
            testID="traffic-toggle"
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show Traffic Legend</Text>
          <Switch
            value={showLegend}
            onValueChange={setShowLegend}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={showLegend ? "#2f95dc" : "#f4f3f4"}
            testID="legend-toggle"
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Map Type</Text>
          <View style={styles.mapTypeContainer}>
            {["standard", "satellite", "hybrid"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mapTypeButton,
                  mapType === type && styles.mapTypeButtonActive,
                ]}
                onPress={() => setMapType(type)}
                testID={`map-type-${type}`}
              >
                <Text
                  style={[
                    styles.mapTypeText,
                    mapType === type && styles.mapTypeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Traffic Tracker App v1.0.0
        </Text>
        <Text style={styles.aboutDescription}>
          This app displays real-time traffic data using Google Maps API.
          Traffic conditions are indicated by color-coded lines:
        </Text>
        
        <View style={styles.trafficInfo}>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, styles.trafficGreen]} />
            <Text style={styles.trafficText}>Light Traffic</Text>
          </View>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, styles.trafficOrange]} />
            <Text style={styles.trafficText}>Medium Traffic</Text>
          </View>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, styles.trafficRed]} />
            <Text style={styles.trafficText}>Heavy Traffic</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  section: {
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#444",
  },
  mapTypeContainer: {
    flexDirection: "row",
  },
  mapTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: "#f0f0f0",
  },
  mapTypeButtonActive: {
    backgroundColor: "#2f95dc",
  },
  mapTypeText: {
    fontSize: 14,
    color: "#555",
  },
  mapTypeTextActive: {
    color: "white",
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },
  aboutDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  trafficInfo: {
    marginTop: 10,
  },
  trafficItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  trafficIndicator: {
    width: 30,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  trafficGreen: {
    backgroundColor: "#4CAF50",
  },
  trafficOrange: {
    backgroundColor: "#FF9800",
  },
  trafficRed: {
    backgroundColor: "#F44336",
  },
  trafficText: {
    fontSize: 14,
    color: "#555",
  },
});