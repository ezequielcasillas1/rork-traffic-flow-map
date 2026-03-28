import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useMapSettings } from "@/hooks/use-map-settings";
import { AlertRadiusSlider } from "@/components/AlertRadiusSlider";
import { lightTheme, darkTheme } from "@/constants/theme";

export default function SettingsScreen() {
  const {
    showTraffic,
    setShowTraffic,
    showLegend,
    setShowLegend,
    mapType,
    setMapType,
    darkMode,
    setDarkMode,
    alertRadius,
    setAlertRadius,
    trafficAlertsEnabled,
    setTrafficAlertsEnabled,
    roadClosuresEnabled,
    setRoadClosuresEnabled,
    accidentsEnabled,
    setAccidentsEnabled,
  } = useMapSettings();

  const theme = darkMode ? darkTheme : lightTheme;

  const handleTermsOfService = () => {
    Alert.alert(
      "Terms of Use",
      `Effective Date: August 2025

These Terms govern your use of the Traffic Tracker mobile application. By using the app, you agree to these terms.

1. Eligibility
You must be at least 13 years old or have parental/guardian consent to use this app.

2. App Usage
Use the app responsibly and in accordance with traffic laws. Do not use the app while operating a vehicle unless it's in hands-free mode.

3. License
You are granted a limited, non-exclusive, non-transferable license to use Traffic Tracker for personal use only.

4. Limitations
We do our best to ensure data accuracy, but Traffic Tracker is not liable for:
• Inaccurate or delayed alerts
• Decisions made based on app information
• Any direct or indirect damage resulting from app usage

5. Updates and Changes
We may modify these Terms and the app features at any time. Continued use of the app indicates your acceptance of updated terms.`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Traffic Tracker",
      `🚦 Traffic Tracker is your real-time companion for safe and smart navigation.

We provide users with timely alerts on traffic congestion, road closures, accidents, and hazards nearby. Whether you're commuting or planning a trip, Traffic Tracker helps you stay ahead of delays and drive with confidence.

Key Features:
• Live traffic notification alerts
• Real-time accident and hazard notifications
• Road closure updates
• Visual traffic heatmaps (color-coded by severity)

Traffic Tracker is built with user experience, safety, and accuracy in mind. Our mission is to make travel easier for everyone, using technology to keep you informed and on the move.`,
      [{ text: "OK", style: "default" }]
    );
  };

  // Map type options that match the MapType from the hook
  const mapTypeOptions: Array<"standard" | "satellite" | "hybrid"> = [
    "standard",
    "satellite",
    "hybrid"
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Alert Radius Section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Alert Radius</Text>
        <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
          Receive alerts for traffic incidents within this distance
        </Text>
        
        <AlertRadiusSlider
          value={alertRadius}
          onValueChange={setAlertRadius}
          disabled={Platform.OS === 'web'}
          theme={theme}
        />
      </View>

      {/* Notifications Section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Traffic Alerts</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Updates on nearby traffic jams within {alertRadius} miles</Text>
          </View>
          <Switch
            value={trafficAlertsEnabled}
            onValueChange={setTrafficAlertsEnabled}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={trafficAlertsEnabled ? theme.primary : "#f4f3f4"}
            testID="traffic-alerts-toggle"
            disabled={Platform.OS === 'web'}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Road Closures</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Alerts for closed or blocked roads within {alertRadius} miles</Text>
          </View>
          <Switch
            value={roadClosuresEnabled}
            onValueChange={setRoadClosuresEnabled}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={roadClosuresEnabled ? theme.primary : "#f4f3f4"}
            testID="road-closures-toggle"
            disabled={Platform.OS === 'web'}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingContent}>
            <View style={styles.settingHeader}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Accidents</Text>
              <View style={[styles.comingSoonBadge, { backgroundColor: theme.warning + '20' }]}>
                <Text style={[styles.comingSoonText, { color: theme.warning }]}>Coming Soon</Text>
              </View>
            </View>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Notifications about nearby accidents</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={theme.secondary}
            testID="accidents-toggle"
            disabled={true}
          />
        </View>

        {Platform.OS === 'web' && (
          <View style={[styles.webNotice, { backgroundColor: theme.warning + '20', borderLeftColor: theme.warning }]}>
            <Text style={[styles.webNoticeText, { color: theme.warning }]}>
              Notification settings are only available on mobile devices.
            </Text>
          </View>
        )}
      </View>

      {/* Map Settings Section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Map Settings</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Show Traffic</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Display real-time traffic conditions on the map
            </Text>
          </View>
          <Switch
            value={showTraffic}
            onValueChange={setShowTraffic}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={showTraffic ? theme.primary : "#f4f3f4"}
            disabled={Platform.OS === 'web'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Show Legend</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Display traffic legend on the map
            </Text>
          </View>
          <Switch
            value={showLegend}
            onValueChange={setShowLegend}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={showLegend ? theme.primary : "#f4f3f4"}
            disabled={Platform.OS === 'web'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Use dark theme for better night viewing
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: theme.secondary, true: theme.primaryLight }}
            thumbColor={darkMode ? theme.primary : "#f4f3f4"}
            disabled={Platform.OS === 'web'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Map Type</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Choose your preferred map display style
            </Text>
          </View>
        </View>

        <View style={styles.mapTypeContainer}>
          {mapTypeOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.mapTypeButton,
                { backgroundColor: theme.borderLight },
                mapType === type && { backgroundColor: theme.primary },
                Platform.OS === 'web' && { backgroundColor: theme.borderLight, opacity: 0.6 },
              ]}
              onPress={() => Platform.OS !== 'web' && setMapType(type)}
              testID={`map-type-${type}`}
              disabled={Platform.OS === 'web'}
            >
              <Text
                style={[
                  styles.mapTypeText,
                  { color: theme.textSecondary },
                  mapType === type && { color: '#ffffff' },
                  Platform.OS === 'web' && { color: theme.textTertiary },
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {Platform.OS === 'web' && (
          <View style={[styles.webNotice, { backgroundColor: theme.warning + '20', borderLeftColor: theme.warning }]}>
            <Text style={[styles.webNoticeText, { color: theme.warning }]}>
              Map settings are only available on mobile devices.
            </Text>
          </View>
        )}
      </View>

      {/* App Info Section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>App Info</Text>
        
        <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Version</Text>
          <Text style={[styles.infoValue, { color: theme.textSecondary }]}>1.0</Text>
        </View>
        
        <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Last Updated</Text>
          <Text style={[styles.infoValue, { color: theme.textSecondary }]}>08/2025</Text>
        </View>
        
        <TouchableOpacity style={[styles.linkItem, { borderBottomColor: theme.border }]} onPress={handleTermsOfService}>
          <Text style={[styles.linkLabel, { color: theme.text }]}>Terms of Service</Text>
          <ChevronRight size={20} color={theme.textTertiary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.linkItem, { borderBottomColor: theme.border }]} onPress={handleAbout}>
          <Text style={[styles.linkLabel, { color: theme.text }]}>About Traffic Tracker</Text>
          <ChevronRight size={20} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Traffic Information</Text>
        <Text style={[styles.aboutDescription, { color: theme.textSecondary }]}>
          This app displays real-time traffic data using Google Maps API.
          Traffic conditions are indicated by color-coded lines:
        </Text>
        
        <View style={styles.trafficInfo}>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, { backgroundColor: theme.trafficGreen }]} />
            <Text style={[styles.trafficText, { color: theme.text }]}>Light Traffic</Text>
          </View>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, { backgroundColor: theme.trafficOrange }]} />
            <Text style={[styles.trafficText, { color: theme.text }]}>Medium Traffic</Text>
          </View>
          <View style={styles.trafficItem}>
            <View style={[styles.trafficIndicator, { backgroundColor: theme.trafficRed }]} />
            <Text style={[styles.trafficText, { color: theme.text }]}>Heavy Traffic</Text>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={[styles.webInfo, { backgroundColor: theme.info + '20', borderLeftColor: theme.info }]}>
            <Text style={[styles.webInfoTitle, { color: theme.info }]}>Web Version Limitations:</Text>
            <Text style={[styles.webInfoText, { color: theme.info }]}>• No real-time map display</Text>
            <Text style={[styles.webInfoText, { color: theme.info }]}>• No GPS location services</Text>
            <Text style={[styles.webInfoText, { color: theme.info }]}>• No traffic data visualization</Text>
            <Text style={[styles.webInfoText, { color: theme.info }]}>• Limited search functionality</Text>
            <Text style={[styles.webInfoText, { color: theme.info }]}>• No push notifications</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
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
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 18,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
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
  },
  mapTypeText: {
    fontSize: 14,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  linkLabel: {
    fontSize: 16,
  },
  webNotice: {
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    borderLeftWidth: 4,
  },
  webNoticeText: {
    fontSize: 14,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  aboutSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#333",
  },
  featureList: {
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  termsDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  termsDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 18,
  },
  termsSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#333",
  },
  termsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    lineHeight: 18,
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
  },
  webInfo: {
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
    borderLeftWidth: 4,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  webInfoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  webInfoText: {
    fontSize: 13,
    marginBottom: 4,
  },
});