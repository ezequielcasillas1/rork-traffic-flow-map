import React from "react";
import { StyleSheet, View, Text, Switch, ScrollView, TouchableOpacity, Platform } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useMapSettings } from "@/hooks/use-map-settings";
import { AlertRadiusSlider } from "@/components/AlertRadiusSlider";

export default function SettingsScreen() {
  const { 
    showTraffic, 
    setShowTraffic,
    mapType,
    setMapType,
    showLegend,
    setShowLegend,
    alertRadius,
    setAlertRadius,
    trafficAlertsEnabled,
    setTrafficAlertsEnabled,
    roadClosuresEnabled,
    setRoadClosuresEnabled,
    accidentsEnabled,
    setAccidentsEnabled,
  } = useMapSettings();

  const handlePrivacyPolicy = () => {
    console.log("Privacy Policy pressed");
  };

  const handleTermsOfService = () => {
    console.log("Terms of Service pressed");
  };

  const handleAbout = () => {
    console.log("About Traffic Tracker pressed");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Alert Radius Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Radius</Text>
        <Text style={styles.sectionDescription}>
          Receive alerts for traffic incidents within this distance
        </Text>
        
        <AlertRadiusSlider
          value={alertRadius}
          onValueChange={setAlertRadius}
          disabled={Platform.OS === 'web'}
        />
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Traffic Alerts</Text>
            <Text style={styles.settingDescription}>Updates on nearby traffic jams</Text>
          </View>
          <Switch
            value={trafficAlertsEnabled}
            onValueChange={setTrafficAlertsEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={trafficAlertsEnabled ? "#2f95dc" : "#f4f3f4"}
            testID="traffic-alerts-toggle"
            disabled={Platform.OS === 'web'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Road Closures</Text>
            <Text style={styles.settingDescription}>Alerts for closed or blocked roads</Text>
          </View>
          <Switch
            value={roadClosuresEnabled}
            onValueChange={setRoadClosuresEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={roadClosuresEnabled ? "#2f95dc" : "#f4f3f4"}
            testID="road-closures-toggle"
            disabled={Platform.OS === 'web'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Accidents</Text>
            <Text style={styles.settingDescription}>Notifications about nearby accidents</Text>
          </View>
          <Switch
            value={accidentsEnabled}
            onValueChange={setAccidentsEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={accidentsEnabled ? "#2f95dc" : "#f4f3f4"}
            testID="accidents-toggle"
            disabled={Platform.OS === 'web'}
          />
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              Notification settings are only available on mobile devices.
            </Text>
          </View>
        )}
      </View>

      {/* Map Settings Section */}
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
            disabled={Platform.OS === 'web'}
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
            disabled={Platform.OS === 'web'}
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
                  Platform.OS === 'web' && styles.mapTypeButtonDisabled,
                ]}
                onPress={() => Platform.OS !== 'web' && setMapType(type)}
                testID={`map-type-${type}`}
                disabled={Platform.OS === 'web'}
              >
                <Text
                  style={[
                    styles.mapTypeText,
                    mapType === type && styles.mapTypeTextActive,
                    Platform.OS === 'web' && styles.mapTypeTextDisabled,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              Map settings are only available on mobile devices.
            </Text>
          </View>
        )}
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>2.4.1</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last Updated</Text>
          <Text style={styles.infoValue}>July 15, 2025</Text>
        </View>
        
        <TouchableOpacity style={styles.linkItem} onPress={handlePrivacyPolicy}>
          <Text style={styles.linkLabel}>Privacy Policy</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem} onPress={handleTermsOfService}>
          <Text style={styles.linkLabel}>Terms of Service</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem} onPress={handleAbout}>
          <Text style={styles.linkLabel}>About Traffic Tracker</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traffic Information</Text>
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

        {Platform.OS === 'web' && (
          <View style={styles.webInfo}>
            <Text style={styles.webInfoTitle}>Web Version Limitations:</Text>
            <Text style={styles.webInfoText}>• No real-time map display</Text>
            <Text style={styles.webInfoText}>• No GPS location services</Text>
            <Text style={styles.webInfoText}>• No traffic data visualization</Text>
            <Text style={styles.webInfoText}>• Limited search functionality</Text>
            <Text style={styles.webInfoText}>• No push notifications</Text>
          </View>
        )}
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
    marginBottom: 8,
    color: "#333",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 18,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: "#444",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 16,
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
  mapTypeButtonDisabled: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  mapTypeText: {
    fontSize: 14,
    color: "#555",
  },
  mapTypeTextActive: {
    color: "white",
  },
  mapTypeTextDisabled: {
    color: "#999",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#444",
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  linkLabel: {
    fontSize: 16,
    color: "#444",
  },
  webNotice: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  webNoticeText: {
    color: "#856404",
    fontSize: 14,
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
  webInfo: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  webInfoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1565c0",
    marginBottom: 8,
  },
  webInfoText: {
    fontSize: 13,
    color: "#1976d2",
    marginBottom: 4,
  },
});